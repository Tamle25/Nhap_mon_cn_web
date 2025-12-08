import React, { useState } from "react";

function AddStudentForm({ onAdd }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [stuClass, setStuClass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStudent = {
      name,
      age: Number(age),
      class: stuClass,
    };

    onAdd(newStudent);

    // reset form
    setName("");
    setAge("");
    setStuClass("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded bg-light mb-3">
      <h4 className="mb-3">Thêm học sinh mới</h4>

      <input
        className="form-control mb-2"
        type="text"
        placeholder="Họ tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        className="form-control mb-2"
        type="number"
        placeholder="Tuổi"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
      />

      <input
        className="form-control mb-3"
        type="text"
        placeholder="Lớp"
        value={stuClass}
        onChange={(e) => setStuClass(e.target.value)}
        required
      />

      <button type="submit" className="btn btn-primary w-100">
        Thêm học sinh
      </button>
    </form>
  );
}

export default AddStudentForm;
