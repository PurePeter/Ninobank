import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Initialize Firebase Authentication
const auth = getAuth();


// Hàm để hiển thị thông tin người dùng
function displayUsername() {
    const user = auth.currentUser;
    if (user) {
        // Hiển thị tên người dùng trên trang
        document.getElementById("usernameDisplay").innerText = user.email; // Hoặc user.phone nếu bạn muốn hiển thị số điện thoại
    } else {
        // Nếu không có người dùng nào đăng nhập, chuyển đến trang đăng nhập
        window.location.href = "./login.html";
    }
}

// Hàm đăng xuất
function setupLogoutButton() {
    const logoutButton = document.getElementById("logoutButton");
    logoutButton.addEventListener("click", () => {
        signOut(auth).then(() => {
            // Đăng xuất thành công, chuyển đến trang đăng nhập
            window.location.href = "./index.html";
        }).catch((error) => {
            // Xử lý lỗi đăng xuất
            console.error("Lỗi khi đăng xuất:", error.message);
        });
    });
}


// Gọi các hàm khi trang được tải
displayUsername();
setupLogoutButton();
