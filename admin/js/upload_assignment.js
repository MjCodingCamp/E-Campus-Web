let spinner = document.getElementById('loadingDiv');
function checkAuth() {
    const admin_name = document.getElementById('admin_name');   
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const adminId = user.uid;
            // User is signed in.
            const usersRef = firebase.database().ref().child('Login').child('Teacher');
            usersRef.once('value', function(snapshot) {
            if (snapshot.hasChild(adminId)) {
                // Teacher is signed in.
                const admin = sessionStorage.getItem('admin_name');
                admin_name.innerText = admin;
    
            }
            else{
                //Teacher is Not signed in
                window.location = "../Login.html"
                spinner.className += " d-none";
               
            }
            });
  
        } else {
            // No user is signed in.
            window.location = "../Login.html"
        }
    });
}

// ================================================logout====================================================================

function logout() {
    firebase.auth().signOut().then(function () {
        console.log("Logged out!");
        window.location = '../Login.html';
    }, function (error) {
        console.log(error.code);
        console.log(error.message);
    });
}

// ==================================================Upload Assignment===========================================================================

//const upload_form  = document.getElementsByName('AssignmentUploadForm')[0];
function uploadAssignment() {
    spinner.classList.remove('d-none');
    const year = document.getElementById('year').value;
    const branch = document.getElementById('branch').value;
    const assignment_name = document.getElementById('assignment_name').value;
    const assignment_pdf = document.getElementById('assignment').files[0];

    let fileInput = document.getElementById('assignment');
    let filePath = fileInput.value;
    let allowedExtensions = /(\.pdf)$/i;


    if (year == "" || branch == "" || assignment_name == "") {
        spinner.className += " d-none";
        alert("Please fill the Form correctly");
    }
    else if(!allowedExtensions.exec(filePath)){   
        alert("Please Upload Only pdf type File");
        fileInput.value = '';
        spinner.className += " d-none";
    }
    else {
        const storage = firebase.storage();
        const storageref = storage.ref();

        const thisref = storageref.child("Assignments").child(year).child(branch).child(assignment_pdf.name).put(assignment_pdf);
        thisref.on('state_changed', function (snapshot) {
        }, function (error) {
            spinner.className += " d-none";
            console.log(error)
        }, function () {
            // Uploaded completed successfully, now we can get the download URL
            thisref.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                //getting url of image

                UploadAssignmentToDatabase(downloadURL, year, branch, assignment_name);

            });
        });
    }

    return false;

}

function UploadAssignmentToDatabase(downloadURL, year, branch, assignment_name) {
    const admin_Id = sessionStorage.getItem('admin_Id');
    console.log(admin_Id);

    const Ref = firebase.database().ref().child('Login').child('Teacher').child(admin_Id).child('Assignment-History');
    Ref.once('value', snap => {
        const id = snap.val().ID;
        //console.log(id);
        const newId = (Number(id) - 1);


        let d = new Date();
        let today = [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('-');

        const Teacher = sessionStorage.getItem("admin_name");

        Ref.child(newId).set({
            Branch: branch,
            Date: today,
            Link: downloadURL,
            Subject: assignment_name,
            Teacher: Teacher
        }).then(function () {
            Ref.update({
                ID: newId
            }).then(function () {

                const AssignmentRef = firebase.database().ref().child('Links').child(year).child(branch).child('Assignment');
                AssignmentRef.once("value", snap => {
                    const st_id = snap.val().ID;

                    console.log(st_id);
                    const st_newId = (Number(st_id) - 1);


                    AssignmentRef.child(st_newId).set({
                        Branch: branch,
                        Date: today,
                        Link: downloadURL,
                        Subject: assignment_name,
                        Teacher: Teacher
                    }).then(function () {
                        AssignmentRef.update({
                            ID: st_newId
                        }).then(function () {
                            alert("Assignment Uploaded Successfully !");
                            document.getElementsByName('AssignmentUploadForm')[0].reset();
                            spinner.className += " d-none";
                            //upload_form.style.zIndex = "1";

                        }).catch(() => {
                            alert("Error! Please Try Again");
                            spinner.className += " d-none";
                        })

                    }).catch(() => {
                        alert("Error! Please Try Again");
                        spinner.className += " d-none";
                    })

                })

            }).catch(() => {
                alert("Error! Please Try Again");
                spinner.className += " d-none";
            })

        }, error => {
            console.log(error);
            alert("Error! Please Try Again");
            spinner.className += " d-none";
        })
    })
}
