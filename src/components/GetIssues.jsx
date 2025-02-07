import React, { useState } from "react";

const GetIssues = ({ onClose }) => {
  const [projectId, setProjectId] = useState("");
  const [issues, setIssues] = useState([]);

  const handleFetch = () => {
    console.log("Fetching issues for project:", projectId);
    // Call API to fetch issues here
    setIssues([
      { id: "JIRA-101", title: "Fix Login Bug", status: "In Progress" },
      { id: "JIRA-102", title: "Add Dark Mode", status: "To Do" },
    ]);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Get Jira Issues</h2>
        <label>Project ID:</label>
        <input type="text" value={projectId} onChange={(e) => setProjectId(e.target.value)} />
        
        <button onClick={handleFetch}>Fetch Issues</button>
        <button onClick={onClose}>Close</button>

        {issues.length > 0 && (
          <div>
            <h3>Issues List</h3>
            <ul>
              {issues.map((issue) => (
                <li key={issue.id}>
                  {issue.id}: {issue.title} ({issue.status})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetIssues;
