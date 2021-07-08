function showSyallbus(html){
    let data = document.getElementById('Library');
    data.innerHTML = html;
}

function fetchData(imageRef,pdfRef){
   
    imageRef.once('value', snap =>{
        let imagearr = [];
        snap.forEach(child => {
            // console.log(child.val())
            // let image = child.val();
            // console.log('welcome');
            imagearr.push(child.val());
        })

        pdfRef.once('value', snap=> {
            let pdfarr = [];
            snap.forEach(child =>{
                pdfarr.push(child.val());
            })
            console.log(imagearr.length)
            console.log(pdfarr.length)

            let html = "";
            for(let i =0 ; i<imagearr.length ; i++){
                html +=`<div class="col-6 col-md-3">
                            <div class="card mt-4" style="background-color:#e0e0e0;">
                                <img src=${imagearr[i]} class="card-img-top img img-responsive p-2 rounded bg-dark"  id = "library-book" alt="Book Cover" loading=lazy>
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

function checkAuth(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
        console.log('user logged in ' + user.uid);
        fetchData();
        } else {
        // No user is signed in.
        window.location = "../Login.html"
        }
    }); 
}

function logout(){
    firebase.auth().signOut().then(function() {
    console.log("Logged out!");
    window.location = '../Login.html';
    }, function(error) {
    console.log(error.code);
    console.log(error.message);
    });
}



