import React, { useState, useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import axios from "axios";

const UpdateIssue = () => {
    const [issueKey, setIssueKey] = useState("");
    const [updatedDescription, setUpdatedDescription] = useState("");
    const [updatedIssueType, setUpdatedIssueType] = useState("Bug");
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        microsoftTeams.initialize();
    }, []);

    // Debounce function to limit API calls
    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    // Fetch issue details automatically
    useEffect(() => {
        const fetchIssueDetails = async () => {
            if (issueKey.length > 3) { // Only search for valid-looking keys
                setIsLoading(true);
                try {
                    const response = await axios.get(
                        `http://localhost:5000/get-jira-issue/${issueKey}`
                    );
                    
                    setUpdatedDescription(response.data.description);
                    setUpdatedIssueType(response.data.issueType);
                    setFeedbackMessage("✅ Issue loaded successfully");
                } catch (error) {
                    setFeedbackMessage("❌ Issue not found");
                    setUpdatedDescription("");
                } finally {
                    setIsLoading(false);
                }
            }
        };

        const debouncedFetch = debounce(fetchIssueDetails, 500);
        debouncedFetch();
        
        // Cleanup function
        return () => {
            setFeedbackMessage("");
        };
    }, [issueKey]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setFeedbackMessage("");

        try {
            const response = await axios.put("http://localhost:5000/updateIssue", {
                verb: "updateIssue",
                data: {
                    issueKey,
                    updatedIssueType,
                    updatedDescription
                }
            });

            setFeedbackMessage(`✅ Issue Updated: ${issueKey}`);
            microsoftTeams.tasks.submitTask({
                success: true,
                message: `Issue Updated: ${issueKey}`
            });
        } catch (error) {
            setFeedbackMessage("❌ Failed to update Jira issue.");
            microsoftTeams.tasks.submitTask({
                success: false,
                message: "Failed to update Jira issue."
            });
        }
    };

    // Keep all your existing styles here...

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.heading}>
                    <span style={{ fontSize: '32px' }}>✏️</span>
                    Update Jira Issue
                </h2>
                <form onSubmit={handleUpdate} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Issue Key</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                value={issueKey}
                                onChange={(e) => setIssueKey(e.target.value.toUpperCase())}
                                required
                                style={styles.input}
                                placeholder="JIRA-123"
                            />
                            {isLoading && (
                                <div style={styles.loader}>
                                    <div style={styles.spinner}></div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Issue Type</label>
                        <div style={styles.selectWrapper}>
                            <select
                                value={updatedIssueType}
                                onChange={(e) => setUpdatedIssueType(e.target.value)}
                                style={styles.select}
                            >
                                <option value="Bug">🐞 Bug</option>
                                <option value="Task">✅ Task</option>
                                <option value="Story">📖 Story</option>
                            </select>
                            <span style={styles.selectArrow}>▼</span>
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Description</label>
                        <textarea
                            value={updatedDescription}
                            onChange={(e) => setUpdatedDescription(e.target.value)}
                            required
                            style={styles.textarea}
                            placeholder="Enter updated description..."
                        />
                    </div>

                    <button type="submit" style={styles.button}>
                        🚀 Update Issue
                    </button>
                </form>

                {feedbackMessage && (
                    <div style={{
                        ...styles.feedback,
                        ...(feedbackMessage.includes("❌") && styles.errorFeedback)
                    }}>
                        {feedbackMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

// Add these new styles to your existing styles object
const styles = {
    // ... keep existing styles ...
    
    loader: {
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)'
    },
    spinner: {
        width: '20px',
        height: '20px',
        border: '2px solid #0078D4',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '20px',
        width: '100vw',
    },
    card: {
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        padding: '32px',
        width: '100%',
        maxWidth: '500px',
        transition: 'transform 0.3s ease',
        ':hover': {
            transform: 'translateY(-2px)'
        }
    },
    heading: {
        fontSize: '24px',
        color: '#1a1a1a',
        margin: '0 0 24px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textAlign: 'center',
        justifyContent: 'center'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#4a4a4a',
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '2px solid #e0e0e0',
        fontSize: '14px',
        transition: 'border-color 0.3s ease',
        ':focus': {
            outline: 'none',
            borderColor: '#0078D4',
            boxShadow: '0 0 0 3px rgba(0,120,212,0.1)'
        }
    },
    selectWrapper: {
        position: 'relative',
    },
    select: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '2px solid #e0e0e0',
        appearance: 'none',
        fontSize: '14px',
        background: '#fff',
        cursor: 'pointer',
        transition: 'border-color 0.3s ease',
        ':focus': {
            outline: 'none',
            borderColor: '#0078D4',
            boxShadow: '0 0 0 3px rgba(0,120,212,0.1)'
        }
    },
    selectArrow: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        color: '#666',
    },
    textarea: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '2px solid #e0e0e0',
        fontSize: '14px',
        minHeight: '120px',
        resize: 'vertical',
        transition: 'border-color 0.3s ease',
        ':focus': {
            outline: 'none',
            borderColor: '#0078D4',
            boxShadow: '0 0 0 3px rgba(0,120,212,0.1)'
        }
    },
    button: {
        padding: '16px',
        background: '#0078D4',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        ':hover': {
            background: '#006cbd',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0,120,212,0.2)'
        }
    },
    feedback: {
        marginTop: '16px',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        textAlign: 'center',
        animation: 'slideIn 0.3s ease',
        background: '#e3fcef',
        color: '#00875a',
        border: '1px solid #abf5d1',
    },
    errorFeedback: {
        background: '#ffebe6',
        color: '#de350b',
        border: '1px solid #ffbdad',
    },
    '@keyframes slideIn': {
        '0%': { opacity: 0, transform: 'translateY(-10px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' }
    }
};

export default UpdateIssue;