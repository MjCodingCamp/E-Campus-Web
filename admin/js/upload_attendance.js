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

 function SubmitAttendance(){

    let spinner = document.getElementById('loadingDiv');
    spinner.classList.remove('d-none');

    const time = new Date();
       
    let new_time =  time.toLocaleString('en-US', { hour: 'numeric', minute : 'numeric', hour12: true });

    const date = document.getElementById('upload_date').value;
    const year = document.getElementById('year').value;
    const branch = document.getElementById('branch').value;
    const subject = document.getElementById('subject').value;

    let new_date = changeDateFormat(date);

    const sub_id = subject + '-' + new_time;

    console.log(new_date)
    console.log(year)
    console.log(branch)
    console.log(subject)

    const databaseRef = firebase.database().ref();
    const Ref = databaseRef.child("Links").child(year).child(branch).child("Attendance").child("Student");


    const dateRef = databaseRef.child("Links").child(year).child(branch).child("Attendance").child("Date-wise").child(new_date).child(sub_id);

    const t_id = sessionStorage.getItem("admin_Id");
    console.log(t_id)

    try {

        let arr = [];

        const teacherRef = databaseRef.child("Login").child("Teacher").child(t_id).child("Attendance-History");
        teacherRef.once("value", snap => {
            const id = snap.val().ID;
            console.log(id);
            const newId = (Number(id) - 1);
            teacherRef.child(newId).set({
                Class: branch,
                Date: new_date,
                SubID: sub_id,
                Subject: subject,
                Time : new_time,
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
                    let attendance =document.querySelector(`input[name= '${arr[i]}']:checked`).value;


                    let key = arr[i];
                    dateRef.child(key).set(
                        attendance
                    ).then(() => {
                        //console.log("out")
                        dateWiseFunction(key, year, branch, attendance, subject);
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
 
    return false;
}

function dateWiseFunction(key, year, branch,attendance, subject) {
    const databaseRef = firebase.database().ref();
    const st_Ref = databaseRef.child("Links").child(year).child(branch).child("Attendance").child("Student").child(key).child(subject);

    st_Ref.once("value", snap => {
        let attend = 0;
        let total = 0;
        try{
        attend = snap.val().Attend;
        total = snap.val().Total;
        }
        catch(error){
            attend = 0;
            total = 0;
        }
        //console.log(id);
        
        if(attendance == "Present"){
          attend = attend + 1;
          total = total +1;  
        }
        else if(attendance == "Absent"){
            total = total +1;
        }

        st_Ref.update({
            Attend : attend,
            Total:total
        }).then(() => {
            console.log("success")
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