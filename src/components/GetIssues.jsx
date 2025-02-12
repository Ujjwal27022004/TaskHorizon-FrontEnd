import React, { useState, useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import axios from "axios";

const GetIssue = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        microsoftTeams.initialize();
    }, []);

    const fetchAllIssues = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:5000/get-jira-issues");
            setIssues(response.data); // Store fetched issues
            setLoading(false);
        } catch (error) {
            console.error("❌ Failed to fetch issues:", error.response?.data || error.message);
            setIssues([]);
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.heading}>Jira Issues 📋</h2>

                <button onClick={fetchAllIssues} style={styles.button}>
                    Get All Issues
                </button>

                {loading && <p style={styles.loading}>Fetching issues...</p>}

                {issues.length > 0 ? (
                    <div style={styles.issueList}>
                        {issues.map((issue) => (
                            <div key={issue.id} style={styles.issueCard}>
                                <h3 style={styles.issueTitle}>{issue.key}: {issue.summary}</h3>
                                <p><strong>Description:</strong> {issue.description}</p>
                                <p><strong>Type:</strong> {issue.issueType}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    !loading && <p style={styles.noIssues}>No issues found.</p>
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
        width: "100vw",
    },
    card: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        maxWidth: "500px",
        width: "100%",
    },
    heading: {
        textAlign: "center",
        color: "#333",
        marginBottom: "15px",
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
    loading: {
        textAlign: "center",
        marginTop: "10px",
        color: "#0078D4",
    },
    issueList: {
        marginTop: "20px",
    },
    issueCard: {
        padding: "10px",
        borderRadius: "5px",
        backgroundColor: "#eef",
        marginBottom: "10px",
    },
    issueTitle: {
        fontSize: "16px",
        fontWeight: "bold",
    },
    noIssues: {
        textAlign: "center",
        marginTop: "15px",
        color: "#666",
    },
};

export default GetIssue;
