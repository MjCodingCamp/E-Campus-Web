function changeDateFormat(inputDate) {
    var splitDate = inputDate.split('-');
    if (splitDate.count == 0) {
        return null;
    }

    var year = splitDate[0];
    var month = splitDate[1];
    var day = splitDate[2];

    return day + '-' + month + '-' + year;
}

function SubmitMarks() {

    let spinner = document.getElementById('loadingDiv');
    spinner.classList.remove('d-none');

    const year = document.getElementById("year").value;
    const branch = document.getElementById("branch").value;

    const total = document.getElementById("total_marks").value;
    const subject = document.getElementById("subject").value;
    let exam_name = document.getElementById("exam_name").value;
    const exam_date = document.getElementById("upload_date").value;
    const t_name = sessionStorage.getItem("admin_name");

    exam_name = exam_name + '(' + subject + ')';

    var newDate = changeDateFormat(exam_date);


    const databaseRef = firebase.database().ref();
    const Ref = databaseRef.child("Links").child(year).child(branch).child("Marks").child("Student");
    const dateRef = databaseRef.child("Links").child(year).child(branch).child("Marks").child("Date-wise").child(newDate).child(exam_name);

    const t_id = sessionStorage.getItem("admin_Id");
    console.log(t_id)

    try {

        let arr = [];

        const teacherRef = databaseRef.child("Login").child("Teacher").child(t_id).child("Marks-History");
        teacherRef.once("value", snap => {
            const id = snap.val().ID;
            console.log(id);
            const newId = (Number(id) - 1);
            teacherRef.child(newId).set({
                Class: branch,
                Date: newDate,
                SubID: exam_name,
                Subject: subject,
                Year: year
            }).then(() => {
                teacherRef.update({
                    ID: newId
                });

                Ref.on("value", snap => {
                    const obj = snap.val();
                    arr = Object.keys(obj);
                    //console.log(arr);

                })

                for (let i = 0; i < arr.length; i++) {
                    //console.log(arr[i])
                    let marks = document.getElementById(arr[i]).value;

                    let newmarks = marks + '/' + total;


                    let key = arr[i];
                    dateRef.child(key).set(
                        newmarks
                    ).then(() => {
                        //console.log("out")
                        dateWiseFunction(key, year, branch, newDate, exam_name, marks, subject, t_name, total);
                    })
                }
                spinner.className += " d-none";

            })
        })
        
    }
    catch (error) {
        console.log(error);
        spinner.className += " d-none";
    }
   

    //window.location = "upload_marks.html";
    return false;
}

function dateWiseFunction(key, year, branch, newDate, exam_name, marks, subject, t_name, total) {
    const databaseRef = firebase.database().ref();
    const st_Ref = databaseRef.child("Links").child(year).child(branch).child("Marks").child("Student").child(key);

    st_Ref.once("value", snap => {
        const id = snap.val().ID;
        //console.log(id);
        const newId = (Number(id) - 1);
        //console.log("IN")


        st_Ref.child(newId).set({
            Date: newDate,
            'Exam-Name' : exam_name,
            Obtain: marks,
            Subject: subject,
            Teacher: t_name,
            Total: total
        }).then(() => {
            console.log("success")
            st_Ref.update({
                ID: newId
            })
        })

    })
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