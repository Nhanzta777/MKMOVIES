/**
 * Hệ thống đăng nhập và đăng ký NKMOVIES
 * Bao gồm các chức năng:
 * - Đăng nhập với email Gmail
 * - Đăng ký tài khoản mới
 * - Quên mật khẩu và đặt lại
 * - Lưu trữ dữ liệu người dùng
 */

// Chuyển đổi giữa form đăng nhập và đăng ký
function toggleForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    // Kiểm tra trạng thái hiện tại và chuyển đổi
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

// Kiểm tra định dạng email Gmail
function isValidEmail(email) {
    // Regex kiểm tra định dạng email Gmail
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email);
}

// Kiểm tra độ mạnh của mật khẩu
function isValidPassword(password) {
    // Kiểm tra các yêu cầu:
    // - Ít nhất 8 ký tự
    // - Ít nhất 1 chữ hoa
    // - Ít nhất 1 ký tự đặc biệt
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[!@#$%^&*]/.test(password);
}

// Lưu dữ liệu người dùng vào localStorage
function saveUserData(userData) {
    // Lấy danh sách người dùng hiện có
    let users = JSON.parse(localStorage.getItem('users')) || [];
    // Thêm người dùng mới
    users.push(userData);
    // Lưu lại vào localStorage
    localStorage.setItem('users', JSON.stringify(users));
}

// Kiểm tra thông tin đăng nhập
function checkLogin(email, password) {
    // Lấy danh sách người dùng từ localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    // Tìm người dùng có email và mật khẩu khớp
    return users.find(user => user.email === email && user.password === password);
}

// Xử lý đăng nhập
function validateLogin(event) {
    event.preventDefault();
    
    // Lấy thông tin từ form và loại bỏ khoảng trắng thừa
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    
    // Kiểm tra trường trống
    if (!email || !password) {
        alert('Vui lòng điền đầy đủ thông tin đăng nhập');
        return false;
    }
    
    // Kiểm tra định dạng email
    if (!isValidEmail(email)) {
        alert('Vui lòng nhập đúng định dạng email Gmail!');
        return false;
    }
    
    // Kiểm tra thông tin đăng nhập
    const user = checkLogin(email, password);
    if (user) {
        // Lưu thông tin đăng nhập
        localStorage.setItem('currentUser', JSON.stringify(user));
        // Chuyển đến trang chủ
        window.location.href = 'home.html';
    } else {
        // Hiển thị modal quên mật khẩu
        showForgotPasswordModal();
        // Điền email vào form đặt lại mật khẩu
        document.getElementById('reset-email').value = email;
        // Hiển thị email trong dialog xác nhận
        document.getElementById('confirm-email').textContent = email;
        // Chuyển đến form đặt lại mật khẩu
        showResetPasswordForm();
    }
    return false;
}

// Xử lý đăng ký
function validateRegister(event) {
    event.preventDefault();
    
    // Lấy thông tin từ form
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // Kiểm tra định dạng email
    if (!isValidEmail(email)) {
        alert('Vui lòng nhập đúng định dạng email Gmail!');
        return false;
    }
    
    // Kiểm tra độ mạnh mật khẩu
    if (!isValidPassword(password)) {
        alert('Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa và 1 ký tự đặc biệt!');
        return false;
    }
    
    // Kiểm tra mật khẩu xác nhận
    if (password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return false;
    }
    
    // Lưu thông tin người dùng
    const userData = {
        name: name,
        email: email,
        password: password
    };
    saveUserData(userData);
    
    // Thông báo thành công và chuyển về form đăng nhập
    alert('Đăng ký thành công! Vui lòng đăng nhập.');
    toggleForms();
    return false;
}

// Hiển thị modal quên mật khẩu
function showForgotPasswordModal() {
    const modal = document.getElementById('forgot-password-modal');
    modal.style.display = 'block';
    // Reset modal về bước 1
    document.getElementById('forgot-password-step1').style.display = 'block';
    document.getElementById('forgot-password-step2').style.display = 'none';
}

// Đóng modal quên mật khẩu
function closeForgotPasswordModal() {
    const modal = document.getElementById('forgot-password-modal');
    modal.style.display = 'none';
}

// Hiển thị form đặt lại mật khẩu
function showResetPasswordForm() {
    const email = document.getElementById('reset-email').value;
    // Kiểm tra email có tồn tại trong hệ thống
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.email === email);
    
    if (!userExists) {
        alert('Email này chưa được đăng ký trong hệ thống!');
        return;
    }
    
    // Chuyển đến form đặt lại mật khẩu
    document.getElementById('forgot-password-step1').style.display = 'none';
    document.getElementById('forgot-password-step2').style.display = 'block';
}

// Chuyển đến form đăng ký
function showRegisterForm() {
    closeForgotPasswordModal();
    toggleForms();
}

// Xử lý đặt lại mật khẩu
function handleResetPassword(event) {
    event.preventDefault();
    
    // Lấy thông tin từ form
    const email = document.getElementById('reset-email').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;
    
    // Kiểm tra độ mạnh mật khẩu mới
    if (!isValidPassword(newPassword)) {
        alert('Mật khẩu mới phải có ít nhất 8 ký tự, 1 chữ hoa và 1 ký tự đặc biệt!');
        return false;
    }
    
    // Kiểm tra mật khẩu xác nhận
    if (newPassword !== confirmNewPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return false;
    }
    
    // Cập nhật mật khẩu mới
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.email === email);
    
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        alert('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.');
        closeForgotPasswordModal();
        toggleForms();
    }
    
    return false;
} 