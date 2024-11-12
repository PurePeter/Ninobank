// Import các module cần thiết từ Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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

const MAX_ATTEMPTS = 4;
const BLOCK_DURATION = 180000; // Thời gian khóa (3 phút)

document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("Button_Login");
    const messageDiv = document.getElementById("signInpMessage");
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("signInPassword");

    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    loginButton.addEventListener('click', (event) => {
        event.preventDefault();

        const phone = document.getElementById('signInPhone').value.trim();
        const email = document.getElementById('signInEmail').value.trim();
        const password = document.getElementById('signInPassword').value.trim();

        if (!phone || !email || !password) {
            showMessage(messageDiv, 'Vui lòng nhập đủ thông tin.', 'red');
            return;
        }

        // Kiểm tra trạng thái khóa tài khoản dựa trên email
        const isLocked = checkIfLocked(email);
        if (isLocked) {
            showMessage(messageDiv, `Tài khoản của bạn đang bị khóa.`, 'red');
            return;
        }

        signInUser(phone, email, password, messageDiv);
    });
});

// Hàm đăng nhập người dùng với Firebase Authentication
function signInUser(phone, email, password, messageDiv) {
    if (!isValidPhoneNumber(phone)) {
        incrementLoginAttempts(email, messageDiv, "Số điện thoại không hợp lệ!");
        return;
    }

    if (!isValidEmail(email)) {
        showMessage(messageDiv, "Sai cú pháp email. Vui lòng nhập lại.", "red");
        return;
    }

    if (!isValidPassword(password)) {
        incrementLoginAttempts(email, messageDiv, "Mật khẩu không chính xác!");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            resetLoginAttempts(email);  // Đặt lại số lần thử đăng nhập khi thành công
            showMessage(messageDiv, "Đăng nhập thành công!", "green");
            setTimeout(() => {
                window.location.href = "/user.html";
            }, 2000);
        })
        .catch((error) => {
            incrementLoginAttempts(email, messageDiv, "Sai mật khẩu hoặc tài khoản.");
            handleFirebaseError(error, messageDiv);
        });
}

// Hàm tăng số lần đăng nhập sai và kiểm tra nếu vượt quá giới hạn
function incrementLoginAttempts(email, messageDiv, errorMessage) {
    const loginAttemptsKey = `loginAttempts_${email}`;
    const attempts = parseInt(localStorage.getItem(loginAttemptsKey)) || 0;
    const newAttempts = attempts + 1;
    localStorage.setItem(loginAttemptsKey, newAttempts);

    showMessage(messageDiv, errorMessage, "red");

    if (newAttempts >= MAX_ATTEMPTS) {
        const lockUntil = Date.now() + BLOCK_DURATION;
        localStorage.setItem(`lockUntil_${email}`, lockUntil);
        showMessage(messageDiv, `Bạn đã nhập sai quá 3 lần. Tài khoản của bạn đã bị khóa.`, "red");

        // Đặt lại trạng thái khóa sau thời gian chờ
        setTimeout(() => {
            resetLoginAttempts(email);
            showMessage(messageDiv, "Tài khoản đã được mở khóa. Bạn có thể thử đăng nhập lại.", "green");
        }, BLOCK_DURATION);
    }
}

// Hàm kiểm tra trạng thái khóa cho một email
function checkIfLocked(email) {
    const lockUntil = localStorage.getItem(`lockUntil_${email}`);
    if (lockUntil && Date.now() < parseInt(lockUntil)) {
        return true;
    }
    return false;
}

// Hàm đặt lại số lần thử đăng nhập
function resetLoginAttempts(email) {
    localStorage.removeItem(`loginAttempts_${email}`);
    localStorage.removeItem(`lockUntil_${email}`);
}

// Hàm hiển thị thông báo
function showMessage(element, message, color) {
    if (!element) {
        console.error("Không tìm thấy phần tử để hiển thị thông báo.");
        return;
    }
    element.innerText = message;
    element.style.color = color;
    element.style.display = "block";

    setTimeout(() => {
        element.style.display = "none";
    }, 4000);
}

// Kiểm tra số điện thoại hợp lệ
function isValidPhoneNumber(phone) {
    return /^\d{10}$/.test(phone);
}

// Kiểm tra email hợp lệ
function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

// Kiểm tra mật khẩu hợp lệ
function isValidPassword(password) {
    return password.length >= 6;
}

// Xử lý lỗi từ Firebase
function handleFirebaseError(error, messageDiv) {
    switch (error.code) {
        case 'auth/invalid-email':
            showMessage(messageDiv, "Email không hợp lệ.", "red");
            break;
            case 'auth/user-disabled':
            showMessage(messageDiv, "Tài khoản của bạn đã bị vô hiệu hóa.", "red");
            break;
        case 'auth/user-not-found':
            showMessage(messageDiv, "Không tìm thấy người dùng với email này.", "red");
            break;
        case 'auth/wrong-password':
            showMessage(messageDiv, "Mật khẩu không chính xác.", "red");
            break;
        case 'auth/too-many-requests':
            showMessage(messageDiv, "Quá nhiều yêu cầu. Vui lòng thử lại sau.", "red");
            break;
        default:
            showMessage(messageDiv, `Lỗi: ${error.message}`, "red");
            break;
    }
}