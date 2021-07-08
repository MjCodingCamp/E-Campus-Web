const spinner = document.getElementById("loadingDiv")

function showSyallbus(html){
    let data = document.getElementById('Library');
    data.innerHTML = html;
    spinner.setAttribute('class', 'd-none');
}

function fetchData(imageRef,pdfRef){
    spinner.classList.remove('d-none');
    imageRef.once('value', snap =>{
        let imagearr = [];
        snap.forEach(child => {
            imagearr.push(child.val());
        })

        pdfRef.once('value', snap=> {
            let pdfarr = [];
            snap.forEach(child =>{
                pdfarr.push(child.val());
            })
            // console.log(imagearr.length)
            // console.log(pdfarr.length)

            let html = "";
            for(let i =0 ; i<imagearr.length ; i++){
                html +=`<div class="col-5 col-md-3">
                            <div class="card mt-4" style="background-color:#e0e0e0;">
                                <img src=${imagearr[i]} class="card-img-top img img-responsive p-2 rounded bg-dark" height="250" id = "library-book" alt="Book Cover" loading=lazy>
                                <div class="card-body text-center">
                                <a href=${pdfarr[i]} target = "_blank" class="btn btn-dark pdf">Check It Out</a>
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
                library();
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
