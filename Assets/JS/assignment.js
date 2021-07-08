function fetchAssignments() {
    let spinner = document.getElementById('loadingDiv');
    spinner.classList.remove('d-none');

    const user_class = sessionStorage.getItem('Class');
    const year = sessionStorage.getItem('Year');

    const databaseRef = firebase.database().ref();
    const notesRef = databaseRef.child('Links').child(year).child(user_class).child('Assignment');

    notesRef.once('value', snap => {
        let html = "";
        snap.forEach(child => {
            let date = child.val().Date;
            let teacher = child.val().Teacher;
            let link = child.val().Link;
            let sub = child.val().Subject;

            if(teacher != undefined){
                html += appendAssignments(date, teacher, link, sub);
            }
            else{

            }
        })
        showAssignments(html);
        spinner.setAttribute('class', 'd-none');
    },
        function (error) {
            // The fetch failed.
            console.error(error);
        })
}

function showAssignments(html) {
    let data = document.getElementById('Assignments');
    data.innerHTML = html;
}

function appendAssignments(date, teacher, link, sub) {
    let html = "";
    html += `<div class="col-6 col-md-3 p-2">
                <div class="card mt-3 p-1 rounded shadow" style="background-color:#f1f1f1;">
                    <span style="height:220px;">
                    <h6 class="bg-dark text-center text-white text-truncate pt-3 pb-3 rounded">${sub}</h6>
                    <h6 class="pl-4 mt-3">BY ${teacher}</h6><hr>
                    <h6 class="pl-4 mt-3">${date}</h6>
                    </span>
                    <div class="card-body text-center">
                    <a href=${link} target = "_blank" class="btn btn-dark btn-block ">Check It Out</a>
                    </div>
                </div>
            </div>`;

    return html;
}

function checkAuth() {
    let spinner = document.getElementById('loadingDiv');
    spinner.classList.remove('d-none');

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log('user logged in ' + user.uid);
            fetchAssignments();
            spinner.setAttribute('class', 'd-none');
        } else {
            // No user is signed in.
            window.location = "Login.html"

        }
    });
}

function logout() {
    firebase.auth().signOut().then(function () {
        console.log("Logged out!");
        window.location = 'Login.html';
    }, function (error) {
        console.log(error.code);
        console.log(error.message);
    });
}