"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanUser = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class KanUser {
    constructor() {
        this.description = {
            displayName: 'Kan User',
            name: 'kanUser',
            icon: 'file:kan.svg',
            group: ['transform'],
            version: 1,
            description: 'Interact with Kanboard users and members',
            defaults: {
                name: 'Kan User',
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
                        { name: 'Get', value: 'get' },
                        { name: 'List All', value: 'list' },
                    ],
                    default: 'list',
                    description: 'The operation to perform on users',
                },
                {
                    displayName: 'User ID',
                    name: 'userId',
                    type: 'string',
                    displayOptions: {
                        show: { operation: ['get'] },
                    },
                    default: '',
                    placeholder: 'user_abc',
                    description: 'The ID of the user to retrieve',
                    required: true,
                },
            ],
        };
    }
    async execute() {
        const credentials = (await this.getCredentials('kanApi'));
        const operation = this.getNodeParameter('operation', 0);
        const baseUrl = credentials.url.replace(/\/$/, ''); // Remove trailing slash
        let responseData;
        try {
            switch (operation) {
                case 'get':
                    const userId = this.getNodeParameter('userId', 0);
                    responseData = await this.helpers.request({
                        method: 'GET',
                        url: `${baseUrl}/api/v1/users/${userId}`,
                        json: true,
                    });
                    break;
                case 'list':
                    responseData = await this.helpers.request({
                        method: 'GET',
                        url: `${baseUrl}/api/v1/users`,
                        json: true,
                    });
                    break;
                default:
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
            }
            return [this.helpers.returnJsonArray(responseData)];
        }
        catch (error) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Kan API error: ${error.message}`);
        }
    }
}
exports.KanUser = KanUser;
