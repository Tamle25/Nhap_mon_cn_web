// Lấy các phần tử DOM cần thiết
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const productListContainer = document.getElementById('product-list');
const addProductBtn = document.getElementById('addProductBtn');
const addProductForm = document.getElementById('addProductForm');
const cancelBtn = document.getElementById('cancelBtn');
const errorMsg = document.getElementById('errorMsg');

// Lấy danh sách sản phẩm ban đầu
// Lưu ý: Gọi lại querySelectorAll trong hàm tìm kiếm để bao gồm cả sản phẩm mới

/**
 * Hàm tìm kiếm và lọc sản phẩm
 * Lấy danh sách sản phẩm hiện tại, duyệt qua, và ẩn/hiện dựa trên từ khóa.
 */
function filterProducts() {
    // Lấy từ khóa, chuyển về chữ thường để so sánh
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    // Lấy lại danh sách sản phẩm để bao gồm cả sản phẩm mới được thêm
    const productItems = document.querySelectorAll('.product-item'); 

    productItems.forEach(item => { // Duyệt qua danh sách sản phẩm
        // Lấy tên sản phẩm (giả sử có class 'product-name' bên trong article)
        const nameElement = item.querySelector('.product-name');
        if (!nameElement) return; // Bỏ qua nếu không tìm thấy tên
        
        const productName = nameElement.textContent.toLowerCase();

        // Kiểm tra xem tên sản phẩm có chứa từ khóa không
        if (productName.includes(searchTerm)) {
            // Hiển thị sản phẩm
            item.style.display = 'block'; 
        } else {
            // Ẩn sản phẩm
            item.style.display = 'none'; 
        }
    });
}

// Gắn sự kiện cho nút tìm kiếm
searchBtn.addEventListener('click', filterProducts);
// (Tùy chọn) Gắn sự kiện nhập liệu để lọc ngay khi gõ
searchInput.addEventListener('keyup', filterProducts);


// --- Xử lý sự kiện Ẩn/Hiện Form Thêm Sản Phẩm (Bài 3) ---

/**
 * Hàm toggle (ẩn/hiện) form thêm sản phẩm
 */
function toggleAddProductForm() {
    // Cách 1: Sử dụng classList.toggle
    addProductForm.classList.toggle('hidden');
    
    // Nếu form được hiện, reset nội dung form và thông báo lỗi
    if (!addProductForm.classList.contains('hidden')) {
        addProductForm.reset(); // Đặt lại giá trị form
        errorMsg.textContent = ''; // Xóa thông báo lỗi
    }
}

// Gắn sự kiện click cho nút "Thêm sản phẩm"
addProductBtn.addEventListener('click', toggleAddProductForm);

// Gắn sự kiện click cho nút "Hủy"
cancelBtn.addEventListener('click', toggleAddProductForm);


// --- Xử lý sự kiện Submit Form Thêm Sản Phẩm (Bài 4) ---

/**
 * Hàm validation dữ liệu form
 */
function validateNewProduct(name, price) {
    if (name === '') {
        return "Vui lòng nhập Tên sản phẩm."; // Tên không rỗng
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
        // Giá là số hợp lệ và lớn hơn 0
        return "Vui lòng nhập Giá là một số dương hợp lệ."; 
    }

    return ''; // Trả về chuỗi rỗng nếu hợp lệ
}

/**
 * Hàm tạo và chèn phần tử HTML sản phẩm mới
 */
function createNewProductElement(name, desc, price) {
    // Tạo phần tử <article> mới
    const newItem = document.createElement('article');
    newItem.className = 'product-item'; // Gắn class để áp dụng CSS từ Bài 2

    // Dùng template string và innerHTML để tạo nhanh nội dung
    newItem.innerHTML = `
        <img src="https://via.placeholder.com/300x200?text=${encodeURIComponent(name)}" alt="Bìa ${name}" style="max-width: 100%;">
        <h3 class="product-name">${name}</h3>
        <p class="product-desc">${desc || 'Không có mô tả.'}</p>
        <p class="product-price">Giá: <span class="price">${parseFloat(price).toLocaleString('vi-VN')}</span> VNĐ</p>
    `;

    // Lưu ý: Cần thêm class="product-name" cho thẻ h3 để chức năng tìm kiếm hoạt động

    return newItem;
}

// 2. Bắt sự kiện submit của form
addProductForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn form gửi yêu cầu và tải lại trang

    // 4. Lấy giá trị từ các trường input
    const name = document.getElementById('newName').value.trim();
    const price = document.getElementById('newPrice').value.trim();
    const desc = document.getElementById('newDesc').value.trim();

    // 5. Thực hiện kiểm tra hợp lệ
    const validationError = validateNewProduct(name, price);

    if (validationError) {
        // Nếu không đạt, hiển thị thông báo lỗi
        errorMsg.textContent = validationError;
        return; // Dừng xử lý
    }

    // Nếu dữ liệu hợp lệ: Xóa thông báo lỗi
    errorMsg.textContent = '';

    // 6. Tạo phần tử sản phẩm mới
    const newItemElement = createNewProductElement(name, desc, price);

    // 7. Chèn sản phẩm mới vào danh sách (Thêm vào đầu)
    productListContainer.prepend(newItemElement);

    // 14. Đóng form và reset
    addProductForm.reset(); // Đặt lại giá trị form
    addProductForm.classList.add('hidden'); // Ẩn form

    // 11. Cập nhật danh sách cho chức năng tìm kiếm (Không cần ở đây vì ta đã dùng document.querySelectorAll trong filterProducts)
    
    // (Tùy chọn) Sau khi thêm thành công, bạn có thể gọi filterProducts() 
    // để đảm bảo sản phẩm mới được hiển thị ngay cả khi ô tìm kiếm đang có từ khóa.
    filterProducts();
    
    alert(`Đã thêm sản phẩm "${name}" thành công!`);
});