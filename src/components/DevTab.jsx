import React, { useState, useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import axios from "axios";

const DevTab = () => {
    const [description, setDescription] = useState("");
    const [issueType, setIssueType] = useState("Bug");
    const [message, setMessage] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        microsoftTeams.initialize();
    }, []);

    const handleFileChange = (e) => {
        setAttachments(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage("");

        const formData = new FormData();
        formData.append("description", description);
        formData.append("issueType", issueType);
        
        Array.from(attachments).forEach((file) => {
            formData.append("attachments", file);
        });

        try {
            const response = await axios.post(
                "http://localhost:5000/create-jira-issue-with-attachments",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setMessage(`✅ Issue ${response.data.issueKey} created successfully!`);
            setTimeout(() => {
                microsoftTeams.tasks.submitTask({ 
                    success: true, 
                    message: `Issue Created: ${response.data.issueKey}` 
                });
            }, 1500);
        } catch (error) {
            setMessage("❌ Failed to create issue. Please try again.");
            setTimeout(() => {
                microsoftTeams.tasks.submitTask({ 
                    success: false, 
                    message: "Failed to create Jira issue." 
                });
            }, 2000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.heading}>
                        <span style={styles.icon}>📋</span>
                        Create New Issue
                    </h2>
                    <div style={styles.progressBar}>
                        <div style={{...styles.progressFill, width: isSubmitting ? '100%' : '0%'}}></div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Issue Type</label>
                        <div style={styles.selectWrapper}>
                            <select
                                value={issueType}
                                onChange={(e) => setIssueType(e.target.value)}
                                style={styles.select}
                                disabled={isSubmitting}
                            >
                                <option value="Bug">🐞 Bug</option>
                                <option value="Task">✅ Task</option>
                                <option value="Story">📖 Story</option>
                                <option value="Epic">🚀 Epic</option>
                            </select>
                            <span style={styles.selectArrow}>▼</span>
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            style={styles.textarea}
                            placeholder="Describe the issue in detail..."
                            disabled={isSubmitting}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Attachments</label>
                        <label style={styles.fileInput}>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                disabled={isSubmitting}
                            />
                            <div style={styles.fileInputContent}>
                                <span style={styles.uploadIcon}>📎</span>
                                <div>
                                    <p style={styles.uploadText}>Drag & drop files or click to upload</p>
                                    {attachments.length > 0 && (
                                        <p style={styles.fileCount}>
                                            {attachments.length} file{attachments.length > 1 ? 's' : ''} selected
                                        </p>
                                    )}
                                </div>
                            </div>
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        style={{
                            ...styles.button,
                            ...(isSubmitting && styles.buttonSubmitting)
                        }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span style={styles.buttonContent}>
                                <span style={styles.spinner}></span>
                                Creating...
                            </span>
                        ) : (
                            <span style={styles.buttonContent}>
                                🚀 Create Issue
                            </span>
                        )}
                    </button>
                </form>

                {message && (
                    <div style={{
                        ...styles.message,
                        ...(message.includes("✅") ? styles.successMessage : styles.errorMessage)
                    }}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '20px',
        width: '100vw'
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
    header: {
        position: 'relative',
        marginBottom: '24px',
    },
    heading: {
        fontSize: '24px',
        color: '#1a1a1a',
        margin: '0 0 16px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    icon: {
        fontSize: '32px',
    },
    progressBar: {
        height: '4px',
        background: '#eee',
        borderRadius: '2px',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        background: '#0078D4',
        transition: 'width 0.3s ease',
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
    fileInput: {
        border: '2px dashed #e0e0e0',
        borderRadius: '8px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        ':hover': {
            borderColor: '#0078D4',
            background: 'rgba(0,120,212,0.05)'
        }
    },
    fileInputContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: '#666',
    },
    uploadIcon: {
        fontSize: '24px',
    },
    uploadText: {
        margin: '0',
        fontSize: '14px',
        fontWeight: '500',
    },
    fileCount: {
        margin: '4px 0 0 0',
        fontSize: '12px',
        color: '#0078D4',
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
    buttonContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    },
    buttonSubmitting: {
        background: '#0078D4',
        opacity: '0.8',
        cursor: 'not-allowed',
        transform: 'none',
        boxShadow: 'none',
    },
    spinner: {
        width: '18px',
        height: '18px',
        border: '2px solid #fff',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    message: {
        marginTop: '16px',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        textAlign: 'center',
        animation: 'slideIn 0.3s ease',
    },
    successMessage: {
        background: '#e3fcef',
        color: '#00875a',
        border: '1px solid #abf5d1',
    },
    errorMessage: {
        background: '#ffebe6',
        color: '#de350b',
        border: '1px solid #ffbdad',
    },
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' }
    },
    '@keyframes slideIn': {
        '0%': { opacity: 0, transform: 'translateY(-10px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' }
    }
};

export default DevTab;