import { useState, useEffect } from "react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService";

function ResultTable({ keyword, user, onAdded }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Fetch users using Axios with async/await
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError("Lỗi khi tải dữ liệu: " + err.message);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Tải dữ liệu 1 lần khi component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Khi prop user thay đổi → thêm vào danh sách và POST to API
  useEffect(() => {
    const addUserToAPI = async () => {
      if (user) {
        try {
          const response = await createUser(user);
          console.log("User added:", response);

          const newUser = response;
          setUsers((prev) => [...prev, newUser]);

          alert("Thêm người dùng thành công!");
          onAdded();
        } catch (err) {
          alert("Lỗi khi thêm người dùng: " + err.message);
          console.error("Error adding user:", err);
        }
      }
    };

    addUserToAPI();
  }, [user, onAdded]);

  // Lọc danh sách theo keyword
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(keyword.toLowerCase()) ||
      u.username.toLowerCase().includes(keyword.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Change page
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [keyword]);

  // Xử lý sửa người dùng
  const editUser = (user) => {
    const address = user.address || { street: "", suite: "", city: "" };
    setEditing({ ...user, address: { ...address } });
  };

  // Xử lý thay đổi khi chỉnh sửa
  const handleEditChange = (field, value) => {
    if (["street", "suite", "city"].includes(field)) {
      setEditing({
        ...editing,
        address: { ...editing.address, [field]: value },
      });
    } else {
      setEditing({ ...editing, [field]: value });
    }
  };

  // Lưu sau khi chỉnh sửa với PUT request
  const saveUser = async () => {
    if (editing.name === "" || editing.username === "") {
      alert("Vui lòng nhập Name và Username!");
      return;
    }

    try {
      const response = await updateUser(editing.id, editing);
      console.log("User updated:", response);

      setUsers((prev) => prev.map((u) => (u.id === editing.id ? response : u)));
      setEditing(null);

      alert("Cập nhật người dùng thành công!");
    } catch (err) {
      alert("Lỗi khi cập nhật người dùng: " + err.message);
      console.error("Error updating user:", err);
    }
  };

  // Xóa người dùng với DELETE request
  const removeUser = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) {
      return;
    }

    try {
      await deleteUser(id);
      console.log("User deleted:", id);

      setUsers((prev) => prev.filter((u) => u.id !== id));

      alert("Xóa người dùng thành công!");
    } catch (err) {
      alert("Lỗi khi xóa người dùng: " + err.message);
      console.error("Error deleting user:", err);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="btn-retry" onClick={fetchUsers}>
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="result-container">
      <h3>Danh sách người dùng ({filteredUsers.length})</h3>

      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                Không tìm thấy người dùng
              </td>
            </tr>
          ) : (
            currentUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>
                  <button className="btn-edit" onClick={() => editUser(u)}>
                    Sửa
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => removeUser(u.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Trước
          </button>

          <div className="pagination-numbers">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`pagination-number ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            className="pagination-btn"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Sau →
          </button>
        </div>
      )}

      {/* Modal chỉnh sửa */}
      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>Chỉnh sửa người dùng</h4>

            <div className="form-group">
              <label htmlFor="edit-name">Name:</label>
              <input
                id="edit-name"
                type="text"
                value={editing.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-username">Username:</label>
              <input
                id="edit-username"
                type="text"
                value={editing.username}
                onChange={(e) => handleEditChange("username", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-email">Email:</label>
              <input
                id="edit-email"
                type="email"
                value={editing.email}
                onChange={(e) => handleEditChange("email", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-street">Street:</label>
              <input
                id="edit-street"
                type="text"
                value={editing.address.street}
                onChange={(e) => handleEditChange("street", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-suite">Suite:</label>
              <input
                id="edit-suite"
                type="text"
                value={editing.address.suite}
                onChange={(e) => handleEditChange("suite", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-city">City:</label>
              <input
                id="edit-city"
                type="text"
                value={editing.address.city}
                onChange={(e) => handleEditChange("city", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-phone">Phone:</label>
              <input
                id="edit-phone"
                type="text"
                value={editing.phone}
                onChange={(e) => handleEditChange("phone", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-website">Website:</label>
              <input
                id="edit-website"
                type="text"
                value={editing.website}
                onChange={(e) => handleEditChange("website", e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button className="btn-save" onClick={saveUser}>
                Lưu
              </button>
              <button className="btn-cancel" onClick={() => setEditing(null)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultTable;
