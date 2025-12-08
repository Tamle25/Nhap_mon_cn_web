import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  
  // State cho Form
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  // [MỚI] State để lưu ID học sinh đang được sửa (null = không sửa ai cả)
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Hàm xử lý chung cho việc Submit (Tự động chọn Thêm hoặc Sửa)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const studentData = { name, age: Number(age), class: studentClass };

    try {
      if (editingId) {
        // --- LOGIC SỬA (UPDATE) ---
        const res = await axios.put(`http://localhost:5000/api/students/${editingId}`, studentData);
        console.log("Đã cập nhật:", res.data);

        // Cập nhật lại danh sách frontend (thay thế dòng cũ bằng dòng mới)
        setStudents(students.map(s => s._id === editingId ? res.data : s));
        
        // Thoát chế độ sửa
        setEditingId(null);
      } else {
        // --- LOGIC THÊM (CREATE) ---
        const res = await axios.post('http://localhost:5000/api/students', studentData);
        console.log("Đã thêm:", res.data);
        setStudents([...students, res.data]);
      }

      // Reset form
      setName("");
      setAge("");
      setStudentClass("");
    } catch (error) {
      console.error("Lỗi submit:", error);
    }
  };

  // [MỚI] Hàm khi bấm nút "Sửa" ở bảng
  const handleEditClick = (student) => {
    setEditingId(student._id); // Đánh dấu đang sửa ID này
    setName(student.name);     // Điền dữ liệu cũ lên form
    setAge(student.age);
    setStudentClass(student.class);
  };

  // [MỚI] Hàm nút Hủy (để quay lại chế độ thêm mới)
  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setAge("");
    setStudentClass("");
  };

  // Hàm xóa học sinh
  const handleDelete = (id) => {
    // 1. Xác nhận trước khi xóa
    if (!window.confirm("Bạn có chắc muốn xóa học sinh này?")) return;

    // 2. Gọi API xóa
    axios.delete(`http://localhost:5000/api/students/${id}`)
      .then(res => {
        console.log(res.data.message);
        
        // 3. Cập nhật state: Lọc bỏ phần tử có id vừa xóa khỏi danh sách hiện tại
        // Cách này không cần gọi lại API fetchStudents() nên rất nhanh
        setStudents(prevList => prevList.filter(s => s._id !== id));
      })
      .catch(err => console.error("Lỗi khi xóa:", err));
  };
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    
    if (nameA < nameB) return sortAsc ? -1 : 1;
    if (nameA > nameB) return sortAsc ? 1 : -1;
    return 0;
  });
  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>Quản Lý Học Sinh</h1>

      {/* Form dùng chung cho Thêm và Sửa */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', background: editingId ? '#fff3cd' : '#f9f9f9' }}>
        <h3>{editingId ? "Chỉnh Sửa Thông Tin" : "Thêm Học Sinh Mới"}</h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input type="text" placeholder="Họ tên" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="number" placeholder="Tuổi" value={age} onChange={(e) => setAge(e.target.value)} required />
          <input type="text" placeholder="Lớp" value={studentClass} onChange={(e) => setStudentClass(e.target.value)} required />
          
          <button type="submit" style={{ cursor: 'pointer', backgroundColor: editingId ? '#ffc107' : '#4CAF50', color: '#000', border: 'none', padding: '8px 15px' }}>
            {editingId ? "Cập Nhật" : "Thêm"}
          </button>

          {/* Hiện nút Hủy nếu đang sửa */}
          {editingId && (
            <button type="button" onClick={handleCancelEdit} style={{ cursor: 'pointer', marginLeft: '5px' }}>
              Hủy
            </button>
          )}
        </form>
      </div>
      {/* --- PHẦN TÌM KIẾM & SẮP XẾP --- */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="🔍 Tìm kiếm..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />
        
        {/* Nút Sắp xếp */}
        <button 
          onClick={() => setSortAsc(!sortAsc)}
          style={{ padding: '8px 15px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Sắp xếp: {sortAsc ? "A -> Z" : "Z -> A"}
        </button>
      </div>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Họ Tên</th>
            <th>Tuổi</th>
            <th>Lớp</th>
            <th>Hành động</th> {/* Thêm cột hành động */}
          </tr>
        </thead>
        <tbody>
          {/* Kiểm tra nếu danh sách lọc rỗng */}
          {sortedStudents.length === 0 ? (
            <tr><td colSpan="4" style={{ textAlign: 'center' }}>Không có dữ liệu</td></tr>
          ) : (
            sortedStudents.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.class}</td>
                <td>
                  <button onClick={() => handleEditClick(student)} style={{ marginRight: '5px' }}>✏️ Sửa</button>
                  <button onClick={() => handleDelete(student._id)} style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px' }}>🗑️ Xóa</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;