"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanProject = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class KanProject {
    constructor() {
        this.description = {
            displayName: 'Kan Project',
            name: 'kanProject',
            icon: 'file:kan.svg',
            group: ['transform'],
            version: 1,
            description: 'Interact with Kanboard projects',
            defaults: {
                name: 'Kan Project',
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
                    description: 'The operation to perform',
                },
                {
                    displayName: 'Project ID',
                    name: 'projectId',
                    type: 'string',
                    displayOptions: {
                        show: { operation: ['get'] },
                    },
                    default: '',
                    description: 'The ID of the project',
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
                    const projectId = this.getNodeParameter('projectId', 0);
                    responseData = await this.helpers.request({
                        method: 'GET',
                        url: `${baseUrl}/api/v1/projects/${projectId}`,
                        json: true,
                    });
                    break;
                case 'list':
                    responseData = await this.helpers.request({
                        method: 'GET',
                        url: `${baseUrl}/api/v1/projects`,
                        json: true,
                    });
                    break;
                default:
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
            }
            return [this.helpers.returnJsonArray(responseData)];
        }
        catch (error) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Kan Project operation failed: ${error.message}`);
        }
    }
}
exports.KanProject = KanProject;
