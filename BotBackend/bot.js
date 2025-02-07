import { TeamsActivityHandler } from 'botbuilder';
import { CustomMessageExtension } from './customMessageExtension.js';

export default class Bot extends TeamsActivityHandler {
    constructor() {
        super();
        this.customMessageExtension = new CustomMessageExtension();
    }

    async handleTeamsMessagingExtensionFetchTask(context, action) {
        try {
            return await this.customMessageExtension.handleTeamsMessagingExtensionFetchTask(context, action);
        } catch (error) {
            console.error('Error in handleTeamsMessagingExtensionFetchTask:', error);
            throw new Error('Failed to fetch task module.');
        }
    }

    async handleTeamsMessagingExtensionSubmitAction(context, action) {
        try {
            return await this.customMessageExtension.handleTeamsMessagingExtensionSubmitAction(context, action);
        } catch (error) {
            console.error('Error in handleTeamsMessagingExtensionSubmitAction:', error);
            throw new Error('Failed to submit task module.');
        }
    }
}
