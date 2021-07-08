const databaseRef = firebase.database().ref();
let spinner = document.getElementById('loadingDiv');

function firstYear() {
    const imageRef = databaseRef.child('Syllabus').child('Syllabus_Icon').child('First_Year');
    const pdfRef = databaseRef.child('Syllabus').child('Syllabus_Link').child('First_Year');
    fetchData(imageRef, pdfRef);
}

function secondYear() {
    const imageRef = databaseRef.child('Syllabus').child('Syllabus_Icon').child('Second_Year');
    const pdfRef = databaseRef.child('Syllabus').child('Syllabus_Link').child('Second_Year');
    fetchData(imageRef, pdfRef);
}

function thirdYear() {
    const imageRef = databaseRef.child('Syllabus').child('Syllabus_Icon').child('Third_Year');
    const pdfRef = databaseRef.child('Syllabus').child('Syllabus_Link').child('Third_Year');
    fetchData(imageRef, pdfRef);
}

function fourthYear() {
    const imageRef = databaseRef.child('Syllabus').child('Syllabus_Icon').child('Fourth_Year');
    const pdfRef = databaseRef.child('Syllabus').child('Syllabus_Link').child('Fourth_Year');
    fetchData(imageRef, pdfRef);
}



function showSyallbus(html) {
    let data = document.getElementById('syllabus');
    data.innerHTML = html;
    spinner.setAttribute('class', 'd-none');
}

function fetchData(imageRef, pdfRef) {
    spinner.classList.remove('d-none');

    imageRef.once('value', snap => {
        let imagearr = [];
        snap.forEach(child => {
            imagearr.push(child.val());
        })

        pdfRef.once('value', snap => {
            let pdfarr = [];
            snap.forEach(child => {
                pdfarr.push(child.val());
            })
            console.log(imagearr.length)
            console.log(pdfarr.length)

            let html = "";
            for (let i = 0; i < imagearr.length; i++) {
                html += `<div class="col-3">
                            <div class="card">
                                <img src=${imagearr[i]} class="card-img-top" alt="...">
                                <div class="card-body text-center">
                                <a href=${pdfarr[i]} target = "_blank" class="btn btn-dark pdf">Show Pdf</a>
                                </div>
                            </div>
                        </div>`;
            }

            showSyallbus(html);
            
        })

    })

}

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
                const admin = sessionStorage.getItem('admin_name');
                admin_name.innerText = admin;
                firstYear();
                //spinner.className += " d-none";
    
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
            spinner.setAttribute('class', 'd-none');
        }
    });
}

function logout() {
    firebase.auth().signOut().then(function () {
        console.log("Logged out!");
        window.location = '../Login.html';
    }, function (error) {
        console.log(error.code);
        console.log(error.message);
    });
}
