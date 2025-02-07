import React, { useState } from "react";

const CreateIssue = ({ onClose }) => {
  const [issueData, setIssueData] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });

  const handleChange = (e) => {
    setIssueData({ ...issueData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Creating Issue:", issueData);
    // Call API to create issue here
    onClose(); // Close the modal after submission
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Create Jira Issue</h2>
        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input type="text" name="title" value={issueData.title} onChange={handleChange} required />
          
          <label>Description:</label>
          <textarea name="description" value={issueData.description} onChange={handleChange} required />
          
          <label>Priority:</label>
          <select name="priority" value={issueData.priority} onChange={handleChange}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <button type="submit">Create</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default CreateIssue;
