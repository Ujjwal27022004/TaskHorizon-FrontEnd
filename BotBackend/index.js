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
            } else {
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
    });
});

// UI Forms for different Jira actions

function createIssueForm() {
    return {
        type: "AdaptiveCard",
        body: [
            { type: "TextBlock", text: "Create a new Jira Issue", weight: "Bolder", size: "Medium" },
            { type: "Input.Text", id: "issueTitle", placeholder: "Enter issue title" },
            { type: "Input.Text", id: "issueDescription", placeholder: "Enter issue description" },
            { type: "Input.ChoiceSet", id: "priority", title: "Priority",placeholder: "Issue-Type", choices: [
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
