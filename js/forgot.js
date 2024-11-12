import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const db = getFirestore(app);

// Xử lý khi bấm nút gửi liên kết đặt lại mật khẩu
document.getElementById('submitBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const messageDiv = document.getElementById('message');

    // Kiểm tra nếu email hoặc số điện thoại trống
    if (!email) {
        showMessage(messageDiv, "Vui lòng nhập email.", "red");
        return;
    }
    if (!phone) {
        showMessage(messageDiv, "Vui lòng nhập số điện thoại.", "red");
        return;
    }

    try {
        // Tìm người dùng với email trong Firestore
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            showMessage(messageDiv, "Sai địa chỉ email hoặc email không tồn tại.", "red");
            return;
        }

        // Lấy dữ liệu người dùng từ kết quả truy vấn
        const userData = querySnapshot.docs[0].data();

        // Kiểm tra số điện thoại
        if (userData.phone !== phone) {
            showMessage(messageDiv, "Sai số điện thoại.", "red");
            return;
        }

        // Gửi email đặt lại mật khẩu
        await sendPasswordResetEmail(auth, email);
        showMessage(messageDiv, "Vui lòng kiểm tra email để reset mật khẩu.", "green");

    } catch (error) {
        const errorMessage = error.message;
        showMessage(messageDiv, `Lỗi khi gửi email: ${errorMessage}`, "red");
    }
});

// Hàm hiển thị thông báo
function showMessage(element, message, color) {
    element.innerText = message;
    element.style.color = color;
    element.style.display = "block"; 
    setTimeout(() => {
        element.style.display = "none"; 
    }, 4000); 
}