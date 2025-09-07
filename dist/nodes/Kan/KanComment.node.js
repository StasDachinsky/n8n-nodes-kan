"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanComment = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class KanComment {
    constructor() {
        this.description = {
            displayName: 'Kan Comment',
            name: 'kanComment',
            icon: 'file:kan.svg',
            group: ['transform'],
            version: 1,
            description: 'Interact with Kanboard task comments',
            defaults: {
                name: 'Kan Comment',
            },
            inputs: [
                { type: "main" /* NodeConnectionType.Main */, displayName: 'Input' },
            ],
            outputs: [
                { type: "main" /* NodeConnectionType.Main */, displayName: 'Output' },
            ],
            credentials: [
                { name: 'kanApi', required: true },
            ],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        { name: 'Create', value: 'create' },
                        { name: 'List All', value: 'list' },
                    ],
                    default: 'list',
                    description: 'The operation to perform',
                },
                {
                    displayName: 'Task ID',
                    name: 'taskId',
                    type: 'string',
                    default: '',
                    description: 'The ID of the task',
                    required: true,
                },
                {
                    displayName: 'Comment Content',
                    name: 'content',
                    type: 'string',
                    typeOptions: {
                        rows: 4,
                    },
                    displayOptions: {
                        show: { operation: ['create'] },
                    },
                    default: '',
                    description: 'The text of the comment',
                    required: true,
                },
                {
                    displayName: 'User ID',
                    name: 'userId',
                    type: 'string',
                    displayOptions: {
                        show: { operation: ['create'] },
                    },
                    default: '',
                    description: 'The ID of the user posting the comment',
                    required: true,
                },
            ],
        };
    }
    async execute() {
        const credentials = (await this.getCredentials('kanApi'));
        const operation = this.getNodeParameter('operation', 0);
        const taskId = this.getNodeParameter('taskId', 0);
        const baseUrl = credentials.url.replace(/\/$/, ''); // Remove trailing slash
        let responseData;
        try {
            switch (operation) {
                case 'create':
                    const content = this.getNodeParameter('content', 0);
                    const userId = this.getNodeParameter('userId', 0);
                    const createBody = {
                        content,
                        user_id: userId,
                    };
                    responseData = await this.helpers.request({
                        method: 'POST',
                        url: `${baseUrl}/api/v1/tasks/${taskId}/comments`,
                        body: createBody,
                        json: true,
                    });
                    break;
                case 'list':
                    responseData = await this.helpers.request({
                        method: 'GET',
                        url: `${baseUrl}/api/v1/tasks/${taskId}/comments`,
                        json: true,
                    });
                    break;
                default:
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
            }
            return [this.helpers.returnJsonArray(responseData)];
        }
        catch (error) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Kan Comment operation failed: ${error.message}`);
        }
    }
}
exports.KanComment = KanComment;
