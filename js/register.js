import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js"; // Import Firestore functions

// Cấu hình Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDqr2Fi0hT4JoM9cGzlKpPFFGUyAOmTUso",
    authDomain: "login-bank-7c2f5.firebaseapp.com",
    projectId: "login-bank-7c2f5",
    storageBucket: "login-bank-7c2f5.appspot.com",
    messagingSenderId: "696493635814",
    appId: "1:696493635814:web:e37ea2de49b4d5e9112327"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Khởi tạo Firestore

// Hàm đăng ký
document.getElementById('signUpForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const username = document.getElementById('signUpUsername').value;
    const phone = document.getElementById('signUpPhone').value;
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageDiv = document.getElementById('signUpMessage');

    // Kiểm tra định dạng số điện thoại
    if (!isValidPhoneNumber(phone)) {
        showMessage(messageDiv, "Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số.", "red");
        return;
    }

    // Kiểm tra email hợp lệ
    if (!isValidEmail(email)) {
        showMessage(messageDiv, "Sai cú pháp email. Vui lòng nhập lại.", "red");
        return;
    }

    // Kiểm tra mật khẩu trùng khớp
    if (password !== confirmPassword) {
        showMessage(messageDiv, "Mật khẩu và xác nhận không khớp.", "red");
        return;
    }

    // Tạo người dùng mới và cập nhật username
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Cập nhật username trong profile của người dùng
        await updateProfile(user, { displayName: username });
        
        // Gọi hàm để thêm dữ liệu người dùng vào Firestore
        await addUserToFirestore(user.uid, username, phone, email, password); // Gửi password lên Firestore

        showMessage(messageDiv, "Đăng ký thành công!", "green");
        setTimeout(() => {
            window.location.href = "./login.html"; // Chuyển đến trang đăng nhập
        }, 2100); 
    } catch (error) {
        const errorMessage = error.message;
        showMessage(messageDiv, `Lỗi trong quá trình đăng ký: ${errorMessage}`, "red");
    }
});

// Hàm thêm người dùng vào Firestore
async function addUserToFirestore(uid, username, phone, email, password) {
    try {
        await setDoc(doc(db, "users", uid), {
            username: username,
            phone: phone,
            email: email,
            password: password, // Thêm password vào Firestore
            createdAt: new Date()
        });
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}

// Hàm hiển thị thông báo
function showMessage(element, message, color) {
    element.innerText = message;
    element.style.color = color;
    element.style.display = "block"; 
    setTimeout(() => {
        element.style.display = "none"; 
    }, 4000); 
}

// Hàm kiểm tra định dạng số điện thoại
function isValidPhoneNumber(phone) {
    return /^\d{10}$/.test(phone); 
}

// Hàm kiểm tra định dạng email
function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

// Toggle password visibility
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', () => {
        const input = icon.previousElementSibling;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        icon.classList.toggle('fa-eye-slash');
        icon.classList.toggle('fa-eye');
    });
});

