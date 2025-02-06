import restify from 'restify';
import { BotFrameworkAdapter, CardFactory } from 'botbuilder';

// Create HTTP server
const server = restify.createServer();
server.listen(3978, () => console.log('Bot is running on http://localhost:3978'));

const adapter = new BotFrameworkAdapter({
    appId: '8a330d28-9f34-454f-98e2-7888c4fcb1d5',
    appPassword: '5Gu8Q~ul~rJD~nxCUWDcgYKcvObX3ebuCbfxOc~N'
});



// Handle incoming messages
server.post('/api/messages', async (req, res) => {

    //consoling the response of the body
    console.log("Incoming request to /api/messages............."+req.body);
    await adapter.processActivity(req, res, async (context) => {
        console.log("Received activity:.....", context.activity.type);
        if (context.activity.type === 'invoke') {
            // const commandId = context.activity.value.commandId;

                const commandId = context.activity.value.commandId;
                console.log(`📌 Command ID received: ${commandId}`);
            
            const responseText = {
                "Action-1": "Hello Action 1",
                "Action-2": "Hello Action 2",
                "Action-3": "Hello Action 3"
            }[commandId] || "Unknown Action";

            const responseCard = {
                type: 'AdaptiveCard',
                body: [{ type: 'TextBlock', text: responseText, weight: 'Bolder', size: 'Medium' }],
                $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
                version: '1.2'
            };

            await context.sendActivity({
                type: 'invokeResponse',
                value: { status: 200, body: { composeExtension: { type: 'result', attachmentLayout: 'list', attachments: [CardFactory.adaptiveCard(responseCard)] } } }
            });
        }
    });
});
