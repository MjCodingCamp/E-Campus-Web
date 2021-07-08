let spinner = document.getElementById('loadingDiv');
function checkAuth() {
    spinner.classList.remove('d-none');
    const admin_name = document.getElementById('admin_name');

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
                //spinner.setAttribute('class', 'd-none');
                spinner.className += " d-none";
    
            }
            else{
                //Teacher Not signed in
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

// ==================================================Upload Image======================================================================

function uploadImage() {
    spinner.classList.remove('d-none');
    const image = document.getElementById("image");
    const storage = firebase.storage();
    const file = document.getElementById("notice_image").files[0];

    let fileInput = document.getElementById('notice_image');
    let filePath = fileInput.value;
    let allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

    if (!allowedExtensions.exec(filePath)) {

        alert("Please Upload Only JPEG/PNG type File");
        fileInput.value = '';
        spinner.className += " d-none";
    }
    else {
        const storageref = storage.ref();

        const thisref = storageref.child("Notices").child(file.name).put(file);
        thisref.on('state_changed', function (snapshot) {
        }, function (error) {
            console.log(error)
        }, function () {
            // Uploaded completed successfully, now we can get the download URL
            thisref.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                //getting url of image

                // console.log(downloadURL);
                UploadNotice(downloadURL);
                console.log("Success")

            });
        });
    }

    return false;
}

function UploadNotice(downloadURL) {
    //spinner.classList.remove('d-none');
    const noticeTitle = document.getElementById("notice_title").value;
    const noticeContent = document.getElementById("notice_Content").value;

    const Ref = firebase.database().ref().child('Notice');
    Ref.once('value', snap => {
        const id = snap.val().ID;
        newId = (Number(id) - 1);


        let d = new Date();
        let today = [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('-');

        let time = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

        today = today + '(' + time + ')';


        const publisher = sessionStorage.getItem("admin_name");

        Ref.child(newId).set({
            Content: noticeContent,
            Title: noticeTitle,
            Date: today,
            Link: downloadURL,
            Publisher: publisher
        }).then(function () {

            Ref.update({
                ID: newId
            }).then(function () {
                alert("Notice Uploaded Successfully !");
                document.getElementsByName('NoticeUploadForm')[0].reset();
                spinner.className += " d-none";

            }).catch(function () {
                alert("Error! Please Try Again");
                spinner.className += " d-none";

            });
        }).catch(() => {
            alert("Error! Please Try Again");
            spinner.className += " d-none";
        })

    }, error => {
        console.log(error);
        alert("Error! Please Try Again");
        spinner.className += " d-none";
    })
}