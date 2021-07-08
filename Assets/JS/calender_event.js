let a = 0;
    function appendRow(date, name){
      let html = "";
      if(a==0){
        html += `<tr>
                  <th>Name</th>
                <th>Date</th>
                </tr>
                <tr>
                <th>${name}</th>
                <th>${date}</th>
                </tr>`;

      }
      else{
        html += `<tr>
                <th>${name}</th>
                <th>${date}</th>
                </tr>`;
      }
      a =a+1;
      return html;
    }

    function fetchEvents(Ref,flag) {
        Ref.on('value', snap => {
          let html = "";
          snap.forEach(child => {
    
            let date = child.val().Date;
            let name = child.val().Name;
    
            html += appendRow(date, name);
            
          })
          if(flag==1){
            showExam(html);
          }
          if(flag==2){
              showHoliday(html);
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
              const databaseRef = firebase.database().ref();
                const examRef = databaseRef.child('Events').child('Exam');
                const holidayRef = databaseRef.child('Events').child('Holiday');
              console.log('user logged in ' + user.uid);
              fetchEvents(examRef,1);
              fetchEvents(holidayRef,2);
            } else {
              // No user is signed in.
              window.location = "../Login.html"
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
