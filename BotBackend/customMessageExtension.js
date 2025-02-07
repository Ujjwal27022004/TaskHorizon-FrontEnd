import { TeamsActivityHandler, CardFactory } from 'botbuilder';
import adaptiveCard from './adaptiveCard.json' assert { type: 'json' };

export class CustomMessageExtension extends TeamsActivityHandler {
    constructor() {
        super();
    }

    // Handles fetching the task module when an action is triggered
    async handleTeamsMessagingExtensionFetchTask(context, action) {
        try {
            const card = CardFactory.adaptiveCard(adaptiveCard);

            return {
                task: {
                    type: 'continue',
                    value: {
                        card,
                        height: 450,
                        width: 500,
                        title: 'Custom Message Action'
                    }
                }
            };
        } catch (error) {
            console.error('Error in handleTeamsMessagingExtensionFetchTask:', error);
            throw new Error('Failed to fetch task module.');
        }
    }

    // Handles submission of task module and returns a response
    async handleTeamsMessagingExtensionSubmitAction(context, action) {
        try {
            const data = action?.data ?? {}; // Ensure data exists
            const title = data.title || 'No Title Provided';
            const text = data.text || 'No Description Provided';

            const heroCard = CardFactory.heroCard(`You submitted: ${title}`, text);

            return {
                composeExtension: {
                    type: 'result',
                    attachmentLayout: 'list',
                    attachments: [heroCard]
                }
            };
        } catch (error) {
            console.error('Error in handleTeamsMessagingExtensionSubmitAction:', error);
            throw new Error('Failed to submit task module.');
        }
    }
}
