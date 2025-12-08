const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Student = require('./student');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Cho phép Frontend gọi API
app.use(express.json()); // Để đọc dữ liệu JSON gửi lên

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/student_db')
  .then(() => console.log("✅ Đã kết nối MongoDB thành công"))
  .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// --- ROUTES (API) ---

// 1. Lấy danh sách học sinh (GET)
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find(); // Lấy tất cả từ DB
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Thêm học sinh mới (POST)
app.post('/api/students', async (req, res) => {
  try {
    // Tạo học sinh mới từ dữ liệu gửi lên (req.body)
    const newStudent = await Student.create(req.body); 
    
    // Trả về dữ liệu vừa tạo kèm mã 201 (Created)
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// 3. Cập nhật thông tin học sinh (PUT)
app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ URL
    
    // Tìm theo ID và cập nhật (option {new: true} để trả về data mới sau khi sửa)
    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedStudent) {
      return res.status(404).json({ error: "Không tìm thấy học sinh" });
    }

    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. Xóa học sinh (DELETE)
app.delete('/api/students/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Student.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    // Trả về thông báo và ID đã xóa
    res.json({ message: "Đã xóa học sinh", id: deleted._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Chạy server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});