function showSyallbus(html){
    let data = document.getElementById('syllabus');
    data.innerHTML = html;
}

function fetchData(imageRef,pdfRef){

    let spinner = document.getElementById('loadingDiv');
    spinner.classList.remove('d-none');

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
                html +=`<div class="col-6 col-md-3 mb-3">
                            <div class="card">
                                <img src=${imagearr[i]} class="card-img-top" alt="...">
                                <div class="card-body text-center">
                                <a href=${pdfarr[i]} target = "_blank" class="btn btn-dark pdf">Show Pdf</a>
                                </div>
                            </div>
                        </div>`;
            }

            showSyallbus(html);
            spinner.setAttribute('class', 'd-none');
        })
        
    })
   
}

function checkAuth(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
        console.log('user logged in ' + user.uid);
        //fetchData();
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
