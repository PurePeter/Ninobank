/*
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js"
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC2qsqST0VmCFk0iTdthNe4lqOSfkIPvV0",
    authDomain: "login-banking.firebaseapp.com",
    projectId: "login-banking",
    storageBucket: "login-banking.appspot.com",
    messagingSenderId: "430391372036",
    appId: "1:430391372036:web:312125d6ce30fc699a4851",
    measurementId: "G-ECEG6N1X6E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



function showMessage(message, divId){
    var messageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    },5000);
}

const signUp=document.getElementById('submitSignUp');
signUp.addEventListener('click', (event)=>{
    event.preventDefault();
    const phone=document.getElementById('rPhone').value;
    const password=document.getElementById('rPassword').value;
    const email=document.getElementById('rEmail').value;
    // const firstName=document.getElementById('fName').value;
    // const lastName=document.getElementById('lName').value;

    const auth=getAuth();
    const db=getFirestore();

    createUserWithEmailAndPassword(auth, email, password, phone)
    .then((userCredential)=>{
        const user=userCredential.user;
        const userData={
            phone: phone,
            password: password,
            email: email
            // firstName: firstName,
            // lastName:lastName
        };
        showMessage('Tài khoản được tạo thành công', 'signUpMessage');
        const docRef=doc(db, "users", user.uid);
        setDoc(docRef,userData)
        .then(()=>{
            window.location.href='/common/login.html';
        })
        .catch((error)=>{
            console.error("Lỗi", error);

        });
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode=='auth/email-already-in-use'){
            showMessage('Địa chỉ Email đã tồn tại !!!', 'signUpMessage');
        }
        else{
            showMessage('Không thể tạo người dùng', 'signUpMessage');
        }
    })
});

const signIn=document.getElementById('submitSignIn');
signIn.addEventListener('click', (event)=>{
    event.preventDefault();
    const phone=document.getElementById('phone').value;
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const auth=getAuth();

    signInWithEmailAndPassword(auth, email,password)
    .then((userCredential)=>{
        showMessage('Đăng nhập thành công', 'signInMessage');
        const user=userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href='/common/homepage.html';
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode==='auth/invalid-credential'){
            showMessage('Sđt hoặc mật khẩu không chính xác', 'signInMessage');
        }
        else{
            showMessage('Tài khoản không tồn tại', 'signInMessage');
        }
    })
})
    */
// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Cấu hình Firebase (thay thế bằng thông tin của bạn)
const firebaseConfig = {
    apiKey: "AIzaSyC2qsqST0VmCFk0iTdthNe4lqOSfkIPvV0",
    authDomain: "login-banking.firebaseapp.com",
    projectId: "login-banking",
    storageBucket: "login-banking.appspot.com",
    messagingSenderId: "430391372036",
    appId: "1:430391372036:web:312125d6ce30fc699a4851",
    measurementId: "G-ECEG6N1X6E"
};

// Khởi tạo Firebase app, auth và db
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Xuất auth và db để sử dụng ở các file khác
export { auth, db };
