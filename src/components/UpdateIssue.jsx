import React, { useState, useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import axios from "axios";

const UpdateIssue = () => {
    const [issueKey, setIssueKey] = useState("");
    const [updatedDescription, setUpdatedDescription] = useState("");
    const [updatedIssueType, setUpdatedIssueType] = useState("Bug");
    const [feedbackMessage, setFeedbackMessage] = useState("");

    useEffect(() => {
        microsoftTeams.initialize();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put("http://localhost:5000/updateIssue", {
                verb: "updateIssue",
                data: {
                    issueKey,
                    updatedIssueType,
                    updatedDescription
                }
            });

            console.log("✅ Issue Updated:", response.data);
            setFeedbackMessage(`✅ Issue Updated: ${issueKey}`);
            microsoftTeams.tasks.submitTask({
                success: true,
                message: `Issue Updated: ${issueKey}`
            });
        } catch (error) {
            console.error("❌ Failed to update issue:", error.response?.data || error.message);
            setFeedbackMessage("❌ Failed to update Jira issue.");
            microsoftTeams.tasks.submitTask({
                success: false,
                message: "Failed to update Jira issue."
            });
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.heading}>Update Jira Issue ✏️</h2>
                <form onSubmit={handleUpdate}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Issue Key:</label>
                        <input
                            type="text"
                            value={issueKey}
                            onChange={(e) => setIssueKey(e.target.value)}
                            required
                            style={styles.input}
                            placeholder="Enter Issue Key (e.g., JIRA-123)"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>New Issue Type:</label>
                        <select
                            value={updatedIssueType}
                            onChange={(e) => setUpdatedIssueType(e.target.value)}
                            style={styles.input}
                        >
                            <option value="Bug">Bug</option>
                            <option value="Task">Task</option>
                            <option value="Story">Story</option>
                        </select>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>New Description:</label>
                        <textarea
                            value={updatedDescription}
                            onChange={(e) => setUpdatedDescription(e.target.value)}
                            required
                            style={styles.textarea}
                            placeholder="Enter updated description"
                        />
                    </div>

                    <button type="submit" style={styles.button}>
                        Update Issue
                    </button>
                </form>
                {feedbackMessage && <p style={styles.feedback}>{feedbackMessage}</p>}
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
        padding: "20px",
        backgroundColor: "#f4f4f4",
        width: "100vw",
    },
    card: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        width: "100%",
    },
    heading: {
        textAlign: "center",
        color: "#333",
        marginBottom: "15px",
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
        textAlign: "center",
        fontWeight: "bold",
        color: "#0078D4",
    }
};

export default UpdateIssue;
