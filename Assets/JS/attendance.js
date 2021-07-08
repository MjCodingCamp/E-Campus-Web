const user_class = sessionStorage.getItem('Class');
const year = sessionStorage.getItem('Year');
const user_name = sessionStorage.getItem('Name');
const roll_no = sessionStorage.getItem('Roll No');

let spinner = document.getElementById('loadingDiv');
spinner.classList.remove('d-none');

const node = (roll_no + "-" + user_name);

function fetchAttendance() {
    let spinner = document.getElementById('loadingDiv');
    spinner.classList.remove('d-none');

    const databaseRef = firebase.database().ref();
    const Ref = databaseRef.child('Links').child (year).child(user_class).child('Attendance');
    const subRef = Ref.child('Subject');

    subRef.once('value', snap => {  
        let subarr = []; 
        let col = "";
        const subject = document.getElementById('subject');
        snap.forEach(child => {
            subarr.push(child.val());
        }) 
        for(let i =0 ; i < subarr.length; i++){
            const Ref = databaseRef.child('Links').child (year).child(user_class).child('Attendance').child('Student').child(node).child(subarr[i]);
            Ref.once('value', snap=> {
                let attend = [];
                snap.forEach(child =>{
                    attend.push(child.val());
                })
                col += `<div class = "col-5 col-md-4 mt-2">
                            <button class="btn btn-dark" id = "btn"><b>${subarr[i]}</b></button>
                            <table class = "table table-striped">
                                <tr style = "color:green;">
                                    <th>Presents : </th>
                                    <th>${attend[0]}</th>
                                </tr>
                                <tr style = "color:red;">
                                    <th>Absents : </th>
                                    <th>${(attend[1] - attend[0])}</th>
                                </tr>
                                <tr>
                                    <th>Total : </th>
                                    <th>${attend[1]}</th>
                                </tr>
                            </table>
                        </div>
                        `;
                    subject.innerHTML = col; 
                    spinner.setAttribute('class', 'd-none');
            },
            function (error) {
                // The fetch failed.
                console.error(error);
                spinner.setAttribute('class', 'd-none');
            });
        }
    },
    function (error) {
        // The fetch failed.
        console.error(error);
    });
}


function checkAuth() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log('user logged in ' + user.uid);
            fetchAttendance();
           
        } else {
            // No user is signed in.
            window.location = "Login.html"
            spinner.setAttribute('class', 'd-none');
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

