import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAZjh5uhKM2pSrGlRGnA_u9J71VGukTBwc",
    authDomain: "agripulse-e079e.firebaseapp.com",
    projectId: "agripulse-e079e",
    storageBucket: "agripulse-e079e.firebasestorage.app",
    messagingSenderId: "621805575302",
    appId: "1:621805575302:web:28f6277fa5b095c469c507",
    measurementId: "G-4Q3BJFB55H"
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



    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    alert('Creating Account...');
    window.location.href = "../index.html";
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
    // ..
  });
  })