import React, { useState, useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import axios from "axios";

const GetIssue = () => {
    const [issueKey, setIssueKey] = useState("");
    const [issueData, setIssueData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        microsoftTeams.initialize();
    }, []);

    const handleFetch = async () => {
        if (!issueKey) return;

        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/get-jira-issue/${issueKey}`);
            setIssueData(response.data);
            setLoading(false);
        } catch (error) {
            console.error("❌ Failed to fetch issue:", error.response?.data || error.message);
            setIssueData(null);
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.heading}>Fetch Jira Issue 🔍</h2>
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

                <button onClick={handleFetch} style={styles.button}>
                    Fetch Issue
                </button>

                {loading && <p style={styles.loading}>Fetching issue...</p>}

                {issueData && (
                    <div style={styles.issueDetails}>
                        <h3 style={styles.issueTitle}>{issueData.title}</h3>
                        <p><strong>Description:</strong> {issueData.description}</p>
                        <p><strong>Status:</strong> {issueData.status}</p>
                        <p><strong>Priority:</strong> {issueData.priority}</p>
                    </div>
                )}
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
        width: "100vw"
    },
    card: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        maxWidth: "450px",
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
    issueDetails: {
        marginTop: "20px",
        padding: "15px",
        borderRadius: "5px",
        backgroundColor: "#eef",
    },
    issueTitle: {
        fontSize: "18px",
        fontWeight: "bold",
    },
    loading: {
        textAlign: "center",
        marginTop: "10px",
        color: "#0078D4",
    },
};

export default GetIssue;
