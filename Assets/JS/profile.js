let spinner = document.getElementById('loadingDiv');


function fetchProfile() {
    spinner.classList.remove('d-none');
    const user_class = sessionStorage.getItem('Class');
    const year = sessionStorage.getItem('Year');
    const user_name = sessionStorage.getItem('Name');
    const roll_no = sessionStorage.getItem('Roll No');
    const branch = sessionStorage.getItem('Branch');
    const course = sessionStorage.getItem('Course');
    const email = sessionStorage.getItem('Email');
    const profile = document.getElementById('profile');

    let html = `<tr>
                    <th>Name :</th>
                    <th>${user_name}</th>
                </tr>
                <tr>
                    <th>Class :</th>
                    <th> ${user_class}</th>
                </tr>
                <tr>
                    <th>Email :</th>
                    <th> ${email}</th>
                </tr>
                <tr>
                    <th>Year : </th>
                    <th>${year}</th>
                </tr>
                <tr>
                    <th>Roll No :</th>
                    <th>${roll_no}</th>
                </tr>
                <tr>
                    <th>Branch :</th>
                    <th>${branch}</th>
                </tr>
                <tr>
                    <th>Course :</th>
                    <th>${course}</th>
                </tr>
                `;
    
    
    profile.innerHTML = html;
    spinner.setAttribute('class', 'd-none');
}


function checkAuth() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log('user logged in ' + user.uid);
            fetchProfile();
            
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