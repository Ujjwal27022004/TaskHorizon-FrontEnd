import React, { useState } from "react";

const UpdateIssue = ({ onClose }) => {
  const [updateData, setUpdateData] = useState({
    issueId: "",
    status: "In Progress",
    comment: "",
  });

  const handleChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updating Issue:", updateData);
    // Call API to update issue here
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Update Jira Issue</h2>
        <form onSubmit={handleSubmit}>
          <label>Issue ID:</label>
          <input type="text" name="issueId" value={updateData.issueId} onChange={handleChange} required />
          
          <label>Status:</label>
          <select name="status" value={updateData.status} onChange={handleChange}>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>

          <label>Comment:</label>
          <textarea name="comment" value={updateData.comment} onChange={handleChange} />

          <button type="submit">Update</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateIssue;
