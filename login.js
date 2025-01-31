import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  import { getAuth, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDicPk_mDgVOZwmpRHxCNT-ijsiZXRRve8",
    authDomain: "agri-7ba10.firebaseapp.com",
    projectId: "agri-7ba10",
    storageBucket: "agri-7ba10.firebasestorage.app",
    messagingSenderId: "1090807117992",
    appId: "1:1090807117992:web:d3c21b3afac239c9156a9d"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();


  //submit

  const submit = document.getElementById('submit');
  submit.addEventListener("click", function(event) {
    event.preventDefault();
    //alert('Signin success');
    
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;



  signInWithEmailAndPassword (auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    alert('Creating Account...');
    window.location.href = "../agripluse/index.html";
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
    // ..
  });
  })