import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
const auth = getAuth(app); // Khởi tạo auth sau khi đã khởi tạo app

// Lắng nghe sự thay đổi trạng thái đăng nhập
onAuthStateChanged(auth, (user) => {
    const usernameDisplay = document.getElementById('usernameDisplay'); // Thay 'usernameDisplay' bằng id của phần tử hiển thị tên người dùng

    if (user) {
        // Người dùng đã đăng nhập, lấy tên hiển thị
        const displayName = user.displayName || "Unknown"; // Nếu không có tên hiển thị, dùng "Unknown"
        usernameDisplay.innerText = displayName; // Thay thế chữ "Unknown" bằng tên người dùng
    } else {
        // Người dùng chưa đăng nhập
        usernameDisplay.innerText = "Unknown"; // Hoặc xử lý khác nếu cần
    }
});
// Số dư tài khoản thật
const actualBalance = "96,548,426,712";
const balanceElement = document.getElementById("balance");
const toggleButton = document.getElementById("toggleVisibility");

// Trạng thái ẩn/hiện mặc định là ẩn
let isHidden = true;

// Hàm chuyển đổi trạng thái ẩn/hiện số dư
toggleButton.addEventListener("click", function() {
    if (isHidden) {
        balanceElement.textContent = `${actualBalance} VND`; // Hiện số dư kèm VND
        toggleButton.classList.remove("fa-eye-slash"); // Đổi icon sang mắt mở
        toggleButton.classList.add("fa-eye");
    } else {
        balanceElement.textContent = "******"; // Ẩn số dư
        toggleButton.classList.remove("fa-eye"); // Đổi icon sang mắt đóng
        toggleButton.classList.add("fa-eye-slash");
    }
    isHidden = !isHidden; // Cập nhật trạng thái
});

