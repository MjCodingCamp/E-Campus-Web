let spinner = document.getElementById('loadingDiv');
function checkAuth() {
    const admin_name = document.getElementById('admin_name');
    spinner.classList.remove('d-none');
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('user logged in ' + user.uid);
            const adminId = user.uid;
            // User is signed in.
            const usersRef = firebase.database().ref().child('Login').child('Teacher');
            usersRef.once('value', function(snapshot) {
            if (snapshot.hasChild(adminId)) {
                // Teacher is signed in.
                const admin = sessionStorage.getItem("admin_name");
                admin_name.innerText = admin;
                spinner.className += " d-none";
    
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
            spinner.className += " d-none";
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

// ==================================================Upload Notes===========================================================================

function uploadNotes() {
    spinner.classList.remove('d-none');
    const year = document.getElementById('year').value;
    const branch = document.getElementById('branch').value;
    const notes_name = document.getElementById('notes_name').value;
    const notes_pdf = document.getElementById('notes').files[0];

    let fileInput = document.getElementById('notes');
    let filePath = fileInput.value;
    let allowedExtensions = /(\.pdf)$/i;


    if (year == "" || branch == "" || notes_name == "") {
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

        const thisref = storageref.child("Notes").child(year).child(branch).child(notes_pdf.name).put(notes_pdf);
        thisref.on('state_changed', function (snapshot) {
        }, function (error) {
            console.log(error)
        }, function () {
            // Uploaded completed successfully, now we can get the download URL
            thisref.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                //getting url of image

                UploadNotesToDatabase(downloadURL, year, branch, notes_name);

            });
        });
    }

    return false;

}

function UploadNotesToDatabase(downloadURL, year, branch, notes_name) {
    spinner.classList.remove('d-none');
    const admin_Id = sessionStorage.getItem('admin_Id');
    console.log(admin_Id);

    const Ref = firebase.database().ref().child('Login').child('Teacher').child(admin_Id).child('Notes-History');
    Ref.once('value', snap => {
        const id = snap.val().ID;

        console.log(id);
        const newId = (Number(id) - 1);


        let d = new Date();
        let today = [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('-');

        const Teacher = sessionStorage.getItem("admin_name");

        Ref.child(newId).set({
            Branch: branch,
            Date: today,
            Link: downloadURL,
            Subject: notes_name,
            Teacher: Teacher
        }).then(function () {
            Ref.update({
                ID: newId
            }).then(function () {

                const notesRef = firebase.database().ref().child('Links').child(year).child(branch).child('Notes');
                notesRef.once("value", snap => {
                    const st_id = snap.val().ID;

                    console.log(st_id);
                    const st_newId = (Number(st_id) - 1);


                    notesRef.child(st_newId).set({
                        Branch: branch,
                        Date: today,
                        Link: downloadURL,
                        Subject: notes_name,
                        Teacher: Teacher
                    }).then(function () {
                        notesRef.update({
                            ID: st_newId
                        }).then(function () {
                            alert("Notes Uploaded Successfully !");
                            document.getElementsByName('NotesUploadForm')[0].reset();
                            spinner.className += " d-none";
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
