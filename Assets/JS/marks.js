const user_class = sessionStorage.getItem('Class');
const year = sessionStorage.getItem('Year');
const user_name = sessionStorage.getItem('Name');
const roll_no = sessionStorage.getItem('Roll No');

let spinner = document.getElementById('loadingDiv');
spinner.classList.remove('d-none');

const node = (roll_no + "-" + user_name);

function fetchMarks() {
   

    const databaseRef = firebase.database().ref();
    const Ref = databaseRef.child('Links').child (year).child(user_class).child('Marks').child('Student').child(node);

    Ref.once('value', snap => {  
        const subject = document.getElementById('marks');
        let html = `<thead class="table-dark"><tr>
                        <th>Date</th>
                        <th>Exam Name</th>
                        <th>Subject Name</th>
                        <th>Teacher</th>
                        <th>Marks</th>
                    </tr></thead>`;
        
        snap.forEach(child => {
            let obj = child.val();
            let date = obj["Date"];
            let exam_name = obj["Exam-Name"];
            let sub = obj["Subject"];
            let teacher = obj["Teacher"];
            let obtain = obj["Obtain"];
            let total = obj["Total"];
            
           if(date != undefined){
                html += `<tr>
                            <th>${date}</th>
                            <th>${exam_name}</th>
                            <th>${sub}</th>
                            <th>${teacher}</th>
                            <th>${obtain + "/" + total }</th>
                        </tr>`;
           }
           else{

           }
        }) 
        subject.innerHTML = html;
        spinner.setAttribute('class', 'd-none');
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
            fetchMarks();
            
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