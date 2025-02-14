import React, { useState, useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import axios from "axios";

const DevTab = () => {
    const [description, setDescription] = useState("");
    const [issueType, setIssueType] = useState("Bug");
    const [message, setMessage] = useState("");

    useEffect(() => {
        microsoftTeams.initialize();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // Clear previous message

        const issueData = {
            description,
            issueType,
        };

        try {
            console.log("description is: ", issueData.description);
            console.log("issue type is: ", issueData.issueType);

            const response = await axios.post(
                "http://localhost:5000/create-jira-issue",
                { 
                    description: issueData.description, 
                    issueType: issueData.issueType 
                } 
            );

            console.log("✅ Issue Created:", response.data);
            setMessage(`✅ Issue Created: ${response.data.issueKey}`);
            microsoftTeams.tasks.submitTask({ 
                success: true, 
                message: `Issue Created: ${response.data.issueKey}` 
            });
        } catch (error) {
            console.error("❌ Failed to create issue:", error.response?.data || error.message);
            setMessage("❌ Failed to create Jira issue. Please try again.");
            microsoftTeams.tasks.submitTask({ 
                success: false, 
                message: "Failed to create Jira issue." 
            });
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.heading}>Create Jira Issue 📝</h2>
                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Issue Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            style={styles.textarea}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Issue Type:</label>
                        <select
                            value={issueType}
                            onChange={(e) => setIssueType(e.target.value)}
                            style={styles.input}
                        >
                            <option value="Bug">Bug</option>
                            <option value="Task">Task</option>
                            <option value="Issue">Issue</option>
                        </select>
                    </div>

                    <button type="submit" style={styles.button}>
                        Create Issue
                    </button>
                </form>
                {message && <p style={styles.feedback}>{message}</p>}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f4f4",
        padding: "20px",
        width: "100vw",
    },
    card: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        width: "100%",
    },
    heading: {
        textAlign: "center",
        color: "#333",
    },
    inputGroup: {
        marginBottom: "15px",
    },
    label: {
        display: "block",
        marginBottom: "5px",
        fontWeight: "bold",
        color: "#333",
    },
    input: {
        width: "100%",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "14px",
    },
    textarea: {
        width: "100%",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "14px",
        height: "100px",
        resize: "none",
    },
    button: {
        backgroundColor: "#0078D4",
        color: "#fff",
        padding: "12px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        width: "100%",
        fontSize: "16px",
        fontWeight: "bold",
        transition: "background 0.3s ease",
    },
    feedback: {
        marginTop: "10px",
        padding: "10px",
        borderRadius: "5px",
        fontWeight: "bold",
        textAlign: "center",
        color: "#fff",
        backgroundColor: "#28a745",
    },
};

export default DevTab;
