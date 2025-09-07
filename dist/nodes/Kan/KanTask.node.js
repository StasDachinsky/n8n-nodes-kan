"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanTask = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class KanTask {
    constructor() {
        this.description = {
            displayName: 'Kan Task',
            name: 'kanTask',
            icon: 'file:kan.svg',
            group: ['transform'],
            version: 1,
            description: 'Interact with Kanboard tasks',
            defaults: {
                name: 'Kan Task',
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
                        { name: 'Get', value: 'get' },
                        { name: 'Update', value: 'update' },
                        { name: 'Delete', value: 'delete' },
                        { name: 'List All', value: 'list' },
                    ],
                    default: 'get',
                    description: 'The operation to perform',
                },
                // Task ID for get, update, delete operations
                {
                    displayName: 'Task ID',
                    name: 'taskId',
                    type: 'string',
                    displayOptions: {
                        show: { operation: ['get', 'update', 'delete'] },
                    },
                    default: '',
                    description: 'The ID of the task',
                    required: true,
                },
                // Project ID for create and list operations
                {
                    displayName: 'Project ID',
                    name: 'projectId',
                    type: 'string',
                    displayOptions: {
                        show: { operation: ['create', 'list'] },
                    },
                    default: '',
                    description: 'The ID of the project (required for create, optional for list)',
                },
                // Required fields for creating a task
                {
                    displayName: 'Title',
                    name: 'title',
                    type: 'string',
                    displayOptions: {
                        show: { operation: ['create'] },
                    },
                    default: '',
                    description: 'The title of the task',
                    required: true,
                },
                // Optional fields for creating/updating a task
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: { operation: ['create', 'update'] },
                    },
                    options: [
                        {
                            displayName: 'Description',
                            name: 'description',
                            type: 'string',
                            typeOptions: {
                                rows: 4,
                            },
                            default: '',
                            description: 'The description of the task',
                        },
                        {
                            displayName: 'Column ID',
                            name: 'column_id',
                            type: 'string',
                            default: '',
                            description: 'The ID of the column to place the task in',
                        },
                        {
                            displayName: 'Owner ID',
                            name: 'owner_id',
                            type: 'string',
                            default: '',
                            description: 'The ID of the user assigned to the task',
                        },
                        {
                            displayName: 'Due Date',
                            name: 'due_date',
                            type: 'dateTime',
                            default: '',
                            description: 'The due date for the task (ISO 8601 format)',
                        },
                        {
                            displayName: 'Position',
                            name: 'position',
                            type: 'number',
                            default: 1,
                            description: 'The position of the task in the column',
                        },
                    ],
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
                case 'create':
                    const title = this.getNodeParameter('title', 0);
                    const projectId = this.getNodeParameter('projectId', 0);
                    const additionalFields = this.getNodeParameter('additionalFields', 0);
                    const createBody = {
                        title,
                        project_id: projectId,
                        ...additionalFields,
                    };
                    // Convert due_date to ISO string if provided
                    if (createBody.due_date) {
                        createBody.due_date = new Date(createBody.due_date).toISOString();
                    }
                    responseData = await this.helpers.request({
                        method: 'POST',
                        url: `${baseUrl}/api/v1/tasks`,
                        body: createBody,
                        json: true,
                    });
                    break;
                case 'get':
                    const getTaskId = this.getNodeParameter('taskId', 0);
                    responseData = await this.helpers.request({
                        method: 'GET',
                        url: `${baseUrl}/api/v1/tasks/${getTaskId}`,
                        json: true,
                    });
                    break;
                case 'update':
                    const updateTaskId = this.getNodeParameter('taskId', 0);
                    const updateFields = this.getNodeParameter('additionalFields', 0);
                    // Convert due_date to ISO string if provided
                    if (updateFields.due_date) {
                        updateFields.due_date = new Date(updateFields.due_date).toISOString();
                    }
                    responseData = await this.helpers.request({
                        method: 'PUT',
                        url: `${baseUrl}/api/v1/tasks/${updateTaskId}`,
                        body: updateFields,
                        json: true,
                    });
                    break;
                case 'delete':
                    const deleteTaskId = this.getNodeParameter('taskId', 0);
                    await this.helpers.request({
                        method: 'DELETE',
                        url: `${baseUrl}/api/v1/tasks/${deleteTaskId}`,
                    });
                    responseData = { success: true, taskId: deleteTaskId };
                    break;
                case 'list':
                    let listUrl = `${baseUrl}/api/v1/tasks`;
                    const listProjectId = this.getNodeParameter('projectId', 0);
                    if (listProjectId) {
                        listUrl += `?project_id=${encodeURIComponent(listProjectId)}`;
                    }
                    responseData = await this.helpers.request({
                        method: 'GET',
                        url: listUrl,
                        json: true,
                    });
                    break;
                default:
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
            }
            return [this.helpers.returnJsonArray(responseData)];
        }
        catch (error) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Kan Task operation failed: ${error.message}`);
        }
    }
}
exports.KanTask = KanTask;
