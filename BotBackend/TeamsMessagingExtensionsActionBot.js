import { TeamsActivityHandler, CardFactory } from 'botbuilder';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const JIRA_BASE_URL = "https://ujjwal27022004.atlassian.net/rest/api/3";
const JIRA_AUTH = {
    auth: {
        username: "ujjwal27022004@gmail.com",
        password: 'ATATT3xFfGF0OoksSQIRuyRfpqWeLsKckNyi394JprxLEgDKmeYt-QW6fnv4HBcv20VUgF0Ud63cybygBEvFL27fRoCEpN6z1X0Xj_XqODTRVaagTUtSwmKpobBOhRYaXqK4RTt60h56RbFailBhPK6dapTkHQs3DBenYYwYrW9bgguZA_RnsRU=93B020FA'
    }
};

export class TeamsMessagingExtensionsActionBot extends TeamsActivityHandler {
    constructor() {
        super();

        this.onInvokeActivity = async (context) => {
            const commandId = context.activity.value.commandId;
            console.log(`📌 Command ID received: ${commandId}`);
        
            let response;
            switch (commandId) {
                case "Create-Issue":
                case "create_Issue":
                    response = {
                        type: 'invokeResponse',
                        value: {
                            status: 200,
                            body: {
                                task: {
                                    type: 'continue',
                                    value: {
                                        url: "https://localhost:53000/#/tab",
                                        title: "Create Jira Issue",
                                        height: "medium",
                                        width: "medium",
                                    }
                                }
                            }
                        }
                    };
                    break;
                case "Update-Issue":
                case "update_Issue":
                    response = {
                        type: 'invokeResponse',
                        value: {
                            status: 200,
                            body: {
                                task: {
                                    type: 'continue',
                                    value: {
                                        card: CardFactory.adaptiveCard(updateIssueForm()),
                                        title: "Update Issue",
                                        height: "medium"
                                    }
                                }
                            }
                        }
                    };
                    break;
                case "Get-Issues":
                case "get_Issues":
                    response = {
                        type: 'invokeResponse',
                        value: {
                            status: 200,
                            body: {
                                task: {
                                    type: 'continue',
                                    value: {
                                        card: CardFactory.adaptiveCard(getIssuesForm()),
                                        title: "Get Issues",
                                        height: "medium"
                                    }
                                }
                            }
                        }
                    };
                    break;
                default:
                    response = {
                        type: 'invokeResponse',
                        value: {
                            status: 400,
                            body: {
                                task: {
                                    type: 'continue',
                                    value: {
                                        card: CardFactory.adaptiveCard({
                                            type: 'AdaptiveCard',
                                            body: [{ type: 'TextBlock', text: "Unknown action", weight: 'Bolder', size: 'Medium' }],
                                            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
                                            version: '1.2'
                                        }),
                                        title: "Error",
                                        height: "medium"
                                    }
                                }
                            }
                        }
                    };
            }
        
            await context.sendActivity(response);
        };
        

        this.onMessage = async (context, next) => {
            const action = context.activity.value?.action;

            if (action === "create_issue") {
                const { issueTitle, issueDescription, priority } = context.activity.value;
                const response = await createJiraIssue(issueTitle, issueDescription, priority);
                await context.sendActivity(response);
            } 
            else if (action === "update_issue") {
                const { issueId, newDescription, status } = context.activity.value;
                const response = await updateJiraIssue(issueId, newDescription, status);
                await context.sendActivity(response);
            } 
            else if (action === "get_issues") {
                const { projectId } = context.activity.value;
                const response = await fetchJiraIssues(projectId);
                await context.sendActivity(response);
            }

            await next();
        };
    }
}

// ===========================
// ✅ Jira API Call Functions
// ===========================

async function createJiraIssue(issueTitle, issueDescription, priority) {
    try {
        const response = await axios.post(`${JIRA_BASE_URL}/issue`, {
            fields: {
                project: { key: "PROJ" },
                summary: issueTitle,
                description: issueDescription,
                issuetype: { name: priority }
            }
        }, JIRA_AUTH);

        return `✅ Issue Created: ${response.data.key}`;
    } catch (error) {
        console.error("❌ Error creating Jira issue:", error.response?.data || error.message);
        return "❌ Failed to create issue.";
    }
}

async function updateJiraIssue(issueId, newDescription, status) {
    try {
        const response = await axios.put(`${JIRA_BASE_URL}/issue/${issueId}`, {
            fields: { description: newDescription },
            transition: { id: getStatusId(status) }
        }, JIRA_AUTH);

        return `✅ Issue ${issueId} updated successfully!`;
    } catch (error) {
        console.error("❌ Error updating Jira issue:", error.response?.data || error.message);
        return "❌ Failed to update issue.";
    }
}

async function fetchJiraIssues(projectId) {
    try {
        const response = await axios.get(`${JIRA_BASE_URL}/search?jql=project=${projectId}`, JIRA_AUTH);
        const issues = response.data.issues.map(issue => `🔹 ${issue.key}: ${issue.fields.summary}`).join("\n");

        return `✅ Issues for Project ${projectId}:\n${issues || "No issues found."}`;
    } catch (error) {
        console.error("❌ Error fetching Jira issues:", error.response?.data || error.message);
        return "❌ Failed to fetch issues.";
    }
}

function getStatusId(status) {
    const statusMap = { "To Do": "11", "In Progress": "21", "Done": "31" };
    return statusMap[status] || "11";
}

// ===========================
// ✅ Adaptive Card Functions
// ===========================

function createIssueForm() {
    return {
        type: "AdaptiveCard",
        body: [
            { type: "TextBlock", text: "Create a new Jira Issue", weight: "Bolder", size: "Medium" },
            { type: "Input.Text", id: "issueTitle", placeholder: "Enter issue title" },
            { type: "Input.Text", id: "issueDescription", placeholder: "Enter issue description" },
            { type: "Input.ChoiceSet", id: "priority", title: "Priority", choices: [
                { title: "Bug", value: "Bug" },
                { title: "Issue", value: "Issue" },
                { title: "Task", value: "Task" }
            ]},
            { type: "ActionSet", actions: [
                { type: "Action.Submit", title: "Create Issue", data: { action: "create_issue" } }
            ]}
        ],
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        version: "1.2"
    };
}

function updateIssueForm() {
    return {
        type: "AdaptiveCard",
        body: [
            { type: "TextBlock", text: "Update Jira Issue", weight: "Bolder", size: "Medium" },
            { type: "Input.Text", id: "issueId", placeholder: "Enter issue ID to update" },
            { type: "Input.Text", id: "newDescription", placeholder: "Enter new description" },
            { type: "Input.ChoiceSet", id: "status", title: "Status", choices: [
                { title: "To Do", value: "To Do" },
                { title: "In Progress", value: "In Progress" },
                { title: "Done", value: "Done" }
            ]},
            { type: "ActionSet", actions: [
                { type: "Action.Submit", title: "Update Issue", data: { action: "update_issue" } }
            ]}
        ],
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        version: "1.2"
    };
}

function getIssuesForm() {
    return {
        type: "AdaptiveCard",
        body: [
            { type: "TextBlock", text: "Fetch Jira Issues", weight: "Bolder", size: "Medium" },
            { type: "Input.Text", id: "projectId", placeholder: "Enter Project ID" },
            { type: "ActionSet", actions: [
                { type: "Action.Submit", title: "Get Issues", data: { action: "get_issues" } }
            ]}
        ],
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        version: "1.2"
    };
}
