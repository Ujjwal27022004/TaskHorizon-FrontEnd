import restify from 'restify';
import { BotFrameworkAdapter, CardFactory } from 'botbuilder';

// Create HTTP server
const server = restify.createServer();
server.listen(3978, () => console.log('Bot is running on http://localhost:3978'));

const adapter = new BotFrameworkAdapter({
    appId: '0bc21a2c-b9c1-4bd5-9989-0c5aaf324d64',
    appPassword: '.u78Q~Irq-p3AMO0sdjio0I~_yZC.oDivaNZvbHD'
});

// Handle incoming messages
server.post('/api/messages', async (req, res) => {
    console.log("Incoming request to /api/messages.............", req.body);
    
    await adapter.processActivity(req, res, async (context) => {
        console.log("Received activity:", context.activity.type);

        if (context.activity.type === 'message') {
            await context.sendActivity(`You said: "${context.activity.text}"`);
        }

        if (context.activity.type === 'invoke') {
            const commandId = context.activity.value.commandId;
            console.log(`📌 Command ID received: ${commandId}`);

            let responseCard;
            if (commandId === "Create-Issue") {
                responseCard = createIssueForm();
            } else if (commandId === "Update-Issue") {
                responseCard = updateIssueForm();
            } else if (commandId === "Get-Issues") {
                responseCard = getIssuesForm();
            } else if (commandId === "customAction") {
                responseCard = createIssueForm();
            } else if(commandId==="create_Issue"){
                responseCard = createIssueForm();
            }else if(commandId==="update_Issue"){
                responseCard = updateIssueForm();
            }else if(commandId==="get_Issues"){
                responseCard = getIssuesForm();
            }
            else {
                responseCard = {
                    type: 'AdaptiveCard',
                    body: [{ type: 'TextBlock', text: "Unknown action", weight: 'Bolder', size: 'Medium' }],
                    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
                    version: '1.2'
                };
            }

            await context.sendActivity({
                type: 'invokeResponse',
                value: {
                    status: 200,
                    body: {
                        task: {
                            type: 'continue',
                            value: {
                                card: CardFactory.adaptiveCard(responseCard),
                                title: "Action Form",
                                height: "medium"
                            }
                        }
                    }
                }
            });
        }

        if (context.activity.type === 'invoke') {
            const action = context.activity.value.action;  // Get action from Adaptive Card

            console.log(`📌 Action received: ${action}`);

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
        }
    });
});

// ===========================
// ✅ Jira API Call Functions
// ===========================

// Jira API Authentication
const JIRA_BASE_URL = "https://ujjwal27022004.atlassian.net/rest/api/3";
const JIRA_AUTH = {
    auth: {
        username: "ujjwal27022004@gmail.com",
        password: 'ATATT3xFfGF0OoksSQIRuyRfpqWeLsKckNyi394JprxLEgDKmeYt-QW6fnv4HBcv20VUgF0Ud63cybygBEvFL27fRoCEpN6z1X0Xj_XqODTRVaagTUtSwmKpobBOhRYaXqK4RTt60h56RbFailBhPK6dapTkHQs3DBenYYwYrW9bgguZA_RnsRU=93B020FA'
    }
};

// 1️⃣ Create Jira Issue
async function createJiraIssue(issueTitle, issueDescription, priority) {
    try {
        const response = await axios.post(`${JIRA_BASE_URL}/issue`, {
            fields: {
                project: { key: "PROJ" },  // Replace with actual Jira project key
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

// 2️⃣ Update Jira Issue
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

// 3️⃣ Get Jira Issues
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

// Helper function to map status names to Jira transition IDs
function getStatusId(status) {
    const statusMap = { "To Do": "11", "In Progress": "21", "Done": "31" }; // Replace with actual Jira transition IDs
    return statusMap[status] || "11";
}


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