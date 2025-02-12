import restify from 'restify';
import { BotFrameworkAdapter } from 'botbuilder';
import { TeamsMessagingExtensionsActionBot } from './TeamsMessagingExtensionsActionBot.js';

// Create HTTP server
const server = restify.createServer();
server.listen(3978, () => console.log('✅ Bot is running on http://localhost:3978'));

// Initialize Adapter
const adapter = new BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID || '0bc21a2c-b9c1-4bd5-9989-0c5aaf324d64',
    appPassword: process.env.MICROSOFT_APP_PASSWORD || '.u78Q~Irq-p3AMO0sdjio0I~_yZC.oDivaNZvbHD'
});

// Create Bot Instance
const bot = new TeamsMessagingExtensionsActionBot();

// Handle incoming requests
server.post('/api/messages', async (req, res) => {
    await adapter.processActivity(req, res, async (context) => {
        await bot.run(context);
    });
});
