import React, { useState, useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import axios from "axios";

const GetIssue = () => {
    const [issues, setIssues] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        microsoftTeams.initialize();
    }, []);

    const fetchAllIssues = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:5000/get-jira-issues");
            setIssues(response.data);
        } catch (error) {
            console.error("❌ Failed to fetch issues:", error);
            setIssues([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchIssueDetails = async (issueKey) => {
        setDetailLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/get-jira-issue-details/${issueKey}`);
            setSelectedIssue(response.data);
        } catch (error) {
            console.error("❌ Failed to fetch details:", error);
            setSelectedIssue(null);
        } finally {
            setDetailLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.heading}>Jira Issues Dashboard 📋</h2>
                
                <div style={styles.controls}>
                    <button onClick={fetchAllIssues} style={styles.refreshButton}>
                        🔄 Refresh Issues
                    </button>
                </div>

                {loading ? (
                    <div style={styles.loadingContainer}>
                        <div style={styles.spinner}></div>
                        <p>Loading issues...</p>
                    </div>
                ) : (
                    <div style={styles.issueGrid}>
                        {issues.map((issue) => (
                            <div 
                                key={issue.id} 
                                style={styles.issueCard}
                                onClick={() => fetchIssueDetails(issue.key)}
                            >
                                <div style={styles.cardHeader}>
                                    <span style={styles.issueTypeBadge[issue.issueType] || styles.issueTypeBadge.default}>
                                        {issue.issueType}
                                    </span>
                                    <h3 style={styles.issueTitle}>{issue.key}</h3>
                                </div>
                                <p style={styles.issueSummary}>{issue.summary}</p>
                            </div>
                        ))}
                    </div>
                )}

                {selectedIssue && (
                    <div style={styles.modal}>
                        <div style={styles.modalContent}>
                            <div style={styles.modalHeader}>
                                <h2>{selectedIssue.key}</h2>
                                <button 
                                    style={styles.closeButton}
                                    onClick={() => setSelectedIssue(null)}
                                >
                                    ×
                                </button>
                            </div>
                            
                            {detailLoading ? (
                                <div style={styles.loadingContainer}>
                                    <div style={styles.spinner}></div>
                                    <p>Loading details...</p>
                                </div>
                            ) : (
                                <div style={styles.detailContent}>
                                    <div style={styles.detailSection}>
                                        <h3 style={styles.detailHeading}>📝 Description</h3>
                                        <p style={styles.description}>{selectedIssue.description || 'No description available'}</p>
                                    </div>

                                    <div style={styles.detailRow}>
                                        <div style={styles.detailItem}>
                                            <span style={styles.detailLabel}>Status:</span>
                                            <span style={styles.statusBadge[selectedIssue.status] || styles.statusBadge.default}>
                                                {selectedIssue.status}
                                            </span>
                                        </div>
                                        <div style={styles.detailItem}>
                                            <span style={styles.detailLabel}>Priority:</span>
                                            <span style={styles.priorityBadge}>{selectedIssue.priority}</span>
                                        </div>
                                    </div>

                                    <div style={styles.detailSection}>
                                        <h3 style={styles.detailHeading}>📎 Attachments ({selectedIssue.attachments.length})</h3>
                                        {selectedIssue.attachments.length > 0 ? (
                                            <div style={styles.attachments}>
                                                {selectedIssue.attachments.map((attachment) => (
                                                    <a
                                                        key={attachment.id}
                                                        href={attachment.content}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={styles.attachmentItem}
                                                    >
                                                        📄 {attachment.filename}
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <p style={styles.noAttachments}>No attachments available</p>
                                        )}
                                    </div>

                                    <div style={styles.metaInfo}>
                                        <p>Created: {selectedIssue.created}</p>
                                        <p>Reported by: {selectedIssue.reporter}</p>
                                    </div>
                                </div>
                            )}
                        </div>
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
        alignItems: 'flex-start',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '40px 20px',
        width: '100vw',
    },
    card: {
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        padding: '32px',
        width: '100%',
        maxWidth: '1200px',
        position: 'relative',
    },
    heading: {
        fontSize: '28px',
        color: '#1a1a1a',
        margin: '0 0 24px 0',
        textAlign: 'center',
        fontWeight: '600',
    },
    controls: {
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'flex-end',
    },
    refreshButton: {
        background: '#0078D4',
        color: '#fff',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        ':hover': {
            background: '#006cbd',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0,120,212,0.2)'
        }
    },
    issueGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
    },
    issueCard: {
        background: '#fff',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        ':hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
        }
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    issueTypeBadge: {
        Bug: {
            background: '#ffebe6',
            color: '#de350b',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
        },
        Task: {
            background: '#e3fcef',
            color: '#00875a',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
        },
        Story: {
            background: '#e6f0ff',
            color: '#0052cc',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
        },
        default: {
            background: '#e3e8ee',
            color: '#42526e',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
        }
    },
    issueTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a1a1a',
        margin: 0,
    },
    issueSummary: {
        color: '#666',
        fontSize: '14px',
        lineHeight: '1.5',
        margin: 0,
    },
    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        background: '#fff',
        borderRadius: '16px',
        padding: '32px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#666',
        ':hover': {
            color: '#333'
        }
    },
    detailContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    detailSection: {
        background: '#f8f9fa',
        borderRadius: '8px',
        padding: '20px',
    },
    detailHeading: {
        fontSize: '20px',
        margin: '0 0 16px 0',
        color: '#1a1a1a',
    },
    description: {
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#444',
        whiteSpace: 'pre-wrap',
    },
    detailRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
    },
    detailItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    detailLabel: {
        fontSize: '12px',
        color: '#666',
        fontWeight: '600',
    },
    statusBadge: {
        'To Do': {
            background: '#dfe1e6',
            color: '#42526e',
        },
        'In Progress': {
            background: '#deebff',
            color: '#0052cc',
        },
        Done: {
            background: '#e3fcef',
            color: '#00875a',
        },
        default: {
            background: '#e3e8ee',
            color: '#42526e',
        }
    },
    priorityBadge: {
        background: '#ffebe6',
        color: '#de350b',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
    },
    attachments: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    attachmentItem: {
        color: '#0078D4',
        textDecoration: 'none',
        padding: '8px 12px',
        borderRadius: '6px',
        transition: 'all 0.2s ease',
        ':hover': {
            background: '#e6f0ff',
        }
    },
    noAttachments: {
        color: '#666',
        fontStyle: 'italic',
    },
    metaInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#666',
        marginTop: '24px',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '40px 0',
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #0078D4',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' }
    }
};

export default GetIssue;