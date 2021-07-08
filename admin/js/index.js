let a = 0;
const databaseRef = firebase.database().ref();

let spinner = document.getElementById('loadingDiv');

function appendNotice(title, content, date, image, publisher) {
    let html = "";
    let un = undefined;
    if (a == 0) {
        html += `
        <div class="carousel-item active">
        <div class="row">
            <div class="col-12 col-md-6 order-12" style="padding: 30px;">
                <h4>${title}</h4>
                <h5>${date}</h5>
                <p class="text-justify" >
                    ${content}
                </p>
                <h6> ${publisher}</h6>
            </div>
            <div class="col-12 col-md-5 rounded shadow order-1 text-center" >
              <img class="responsive" src="${image}">
            </div>
        </div>
    </div>`;
    }
    else {
        html += `
        <div class="carousel-item">
        <div class="row">
            <div class="col-12 col-md-6 order-12" style="padding: 30px;">
                <h4>${title}</h4>
                <h5>${date}</h5>
                <p class="text-justify" >
                    ${content}
                </p>
                <h6> ${publisher}</h6>
            </div>
            <div class="col-12 col-md-5 rounded shadow order-1 text-center" >
              <img class="responsive" src="${image}">

            </div>
        </div>
    </div>`;
    }
    a = a + 1;
    return html;

}

function showNotice(completehtml) {
    const noticeContainer = document.getElementById('notice');
    noticeContainer.innerHTML = completehtml;
    spinner.setAttribute('class', 'd-none');
}

function fetchNotice() {
    spinner.classList.remove('d-none');
    const noticeRef = databaseRef.child('Notice');

    noticeRef.on('value', snap => {
        let html = "";

        snap.forEach(child => {

            let title = child.val().Title;
            let content = child.val().Content;
            let date = child.val().Date;
            let publisher = child.val().Publisher;
            let image = child.val().Link;

            if (title != undefined) {

                html += appendNotice(title, content, date, image, publisher);
            }
            else {

            }
        })

        showNotice(html);
    },
        function (error) {
            // The fetch failed.
            console.error(error);
        });
}

// ===========================================================Check Login user===========================================

function checkAuth() {
    spinner.classList.remove('d-none');
    const admin_name = document.getElementById('admin_name');

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('user logged in ' + user.uid);
            const adminId = user.uid;
            const usersRef = firebase.database().ref().child('Login').child('Teacher');
            usersRef.once('value', function(snapshot) {
            if (snapshot.hasChild(adminId)) {
                spinner.className += " d-none";
                sessionStorage.setItem("admin_Id", adminId);
                // Teacher is signed in.
                const Ref = firebase.database().ref().child('Login').child('Teacher').child(user.uid);
                Ref.once('value', snap => {
                    admin = snap.val().Name;
                    console.log(admin);
                    admin_name.innerText = admin;
                    sessionStorage.setItem("admin_name", admin);
    
    
                }, error => {
                    console.log(error);
                })
                fetchAttendance(adminId);
                fetchAssignment(adminId);
                fetchMarks(adminId);
                fetchNotice();
                fetchNotes(adminId);
    
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

// ===============================================Assignment=================================================================

function fetchAssignment(adminId) {
    spinner.classList.remove('d-none');
    const assignRef = databaseRef.child("Login").child("Teacher").child(adminId).child("Assignment-History");

    assignRef.on("value", snap => {
        let html = "";
        snap.forEach(child => {
            let date = child.val().Date;
            let teacher = child.val().Teacher;
            let link = child.val().Link;
            let sub = child.val().Subject;
            let branch = child.val().Branch;

            if (teacher != undefined) {
                html += appendAssignments(date, link, sub, branch);
            }
            else {

            }
        })
        showAssignments(html);
    },
        function (error) {
            // The fetch failed.
            console.error(error);
            spinner.setAttribute('class', 'd-none');
        })

}

function showAssignments(html) {
    let data = document.getElementById('Assignments');
    data.innerHTML = html;
    spinner.setAttribute('class', 'd-none');
}

function appendAssignments(date, link, sub, branch) {
    let html = "";
    html += `<div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-primary shadow h-100 py-2">
                    <div class="card-body">
                    <a href = ${link} target = "_blank">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-primary text-uppercase">${sub}</div>
                                <div class="h5 mb-0 font-weight-bold text-primary-800">${branch}</div>
                                <div class="text-sm font-weight-bold text-primary">${date}</div>
                                
                            </div>
                            <div class="col-auto">
                                <img src = "img/assignment.png" width = "50">
                            </div>
                        </div>
                    </a>
                    </div>
                </div>
            </div> `;

    return html;
}


// ========================================================Attendance============================================================

function fetchAttendance(adminId) {
    spinner.classList.remove('d-none');
    const attenRef = databaseRef.child("Login").child("Teacher").child(adminId).child("Attendance-History");

    attenRef.on("value", snap => {
        let html = "";
        snap.forEach(child => {
            let date = child.val().Date;
            let branch = child.val().Class;
            let sub = child.val().Subject;
            let subId = child.val().SubID;
            let time = child.val().Time;
            let year = child.val().Year;

            if (date != undefined) {
                html += appendAttendance(date, branch, sub, time, year, subId);
            }
            else {

            }
        })
        showAttendance(html);
    },
        function (error) {
            // The fetch failed.
            console.error(error);
            spinner.setAttribute('class', 'd-none');
        })

}

function showAttendance(html) {
    let data = document.getElementById('Attendance');
    data.innerHTML = html;
    spinner.setAttribute('class', 'd-none');
}

function appendAttendance(date, branch, sub, time, year, subId) {
    let html = "";
    html += `<div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-primary shadow h-100 py-2">
                    <div class="card-body" onclick = "listAttendance('${year}','${branch}','${date}','${subId}');" data-toggle="modal" data-target="#AttendanceModal">
                    
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-primary text-uppercase">${sub}</div>
                                <div class="h5 mb-0 font-weight-bold text-primary-800">${branch}</div>
                                <span class="text-sm font-weight-bold text-primary">${date}</span>
                                <span class="text-xs font-weight-bold text-primary">( ${time} )</span>
                                
                            </div>
                            <div class="col-auto">
                                <img src = "img/Attendance.png" width = "50">
                                
                            </div>
                        </div>
                    
                    </div>
                </div>
            </div> `;

    return html;
}

function listAttendance(year, branch, date, subID) {

    const list_id = document.getElementById("attendanceList")
    listRef = databaseRef.child("Links").child(year).child(branch).child("Attendance").child("Date-wise").child(date).child(subID);

    listRef.once('value', snap => {
        let obj = snap.val();
        let html = "";
        for (key in obj) {

            let td = "";
            if (obj[key] == "Absent") {
                td = `<td class = "text-danger">${obj[key]}</td>`
            }
            else if (obj[key] == "Present") {
                td = `<td class = "text-success">${obj[key]}</td>`
            }

            html += `<tr>
                        <td>${key}</td>
                        ${td}
                    </tr>
                    `;
        }

        list_id.innerHTML = html;

    })


}


// =========================================================Marks section=========================================================================

function fetchMarks(adminId) {
    spinner.classList.remove('d-none');
    const attenRef = databaseRef.child("Login").child("Teacher").child(adminId).child("Marks-History");

    attenRef.on("value", snap => {
        let html = "";
        snap.forEach(child => {
            let date = child.val().Date;
            let branch = child.val().Class;
            let sub = child.val().Subject;
            let subId = child.val().SubID;
            let year = child.val().Year;

            if (date != undefined) {
                html += appendMarks(date, branch, sub, year, subId);
            }
            else {

            }
        })
        showMarks(html);
    },
        function (error) {
            // The fetch failed.
            console.error(error);
            spinner.setAttribute('class', 'd-none');
        })

}

function showMarks(html) {
    let data = document.getElementById('Marks');
    data.innerHTML = html;
    spinner.setAttribute('class', 'd-none');
}

function appendMarks(date, branch, sub, year, subId) {
    let html = "";
    html += `<div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-primary shadow h-100 py-2">
                    <div class="card-body" onclick = "listMarks('${year}','${branch}','${date}','${subId}');" data-toggle="modal" data-target="#MarksModal">
                    
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-primary text-uppercase">${sub}</div>
                                <div class="h5 mb-0 font-weight-bold text-primary-800">${branch}</div>
                                <span class="text-sm font-weight-bold text-primary">${date}</span>
                                
                            </div>
                            <div class="col-auto">
                                <img src = "img/marks.png" width = "50">
                                
                            </div>
                        </div>
                    
                    </div>
                </div>
            </div> `;

    return html;
}

function listMarks(year, branch, date, subID) {

    const list_id = document.getElementById("MarksList")
    listRef = databaseRef.child("Links").child(year).child(branch).child("Marks").child("Date-wise").child(date).child(subID);

    listRef.once('value', snap => {
        let obj = snap.val();
        let html = "";
        for (key in obj) {
            html += `<tr>
                        <td>${key}</td>
                        <td>${obj[key]}</td>
                    </tr>
                    `;
        }

        list_id.innerHTML = html;

    })
}

// ===============================================Notes=================================================================

function fetchNotes(adminId) {
    spinner.classList.remove('d-none');
    const notesRef = databaseRef.child("Login").child("Teacher").child(adminId).child("Notes-History");

    notesRef.on("value", snap => {
        let html = "";
        snap.forEach(child => {
            let date = child.val().Date;
            let teacher = child.val().Teacher;
            let link = child.val().Link;
            let sub = child.val().Subject;
            let branch = child.val().Branch;

            if (teacher != undefined) {
                html += appendNotes(date, link, sub, branch);
            }
            else {

            }
        })
        showNotes(html);
    },
        function (error) {
            // The fetch failed.
            console.error(error);
            spinner.setAttribute('class', 'd-none');
        })

}

function showNotes(html) {
    let data = document.getElementById('Notes');
    data.innerHTML = html;
    spinner.setAttribute('class', 'd-none');
}

function appendNotes(date, link, sub, branch) {
    let html = "";
    html += `<div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-primary shadow h-100 py-2">
                    <div class="card-body">
                    <a href = ${link} target = "_blank">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-primary text-uppercase">${sub}</div>
                                <div class="h5 mb-0 font-weight-bold text-primary-800">${branch}</div>
                                <div class="text-sm font-weight-bold text-primary">${date}</div>
                                
                            </div>
                            <div class="col-auto">
                                <img src = "img/notes.png" width = "50">
                            </div>
                        </div>
                    </a>
                    </div>
                </div>
            </div> `;

    return html;
}


