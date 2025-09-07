import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class KanWebhook implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Kan Webhook',
    name: 'kanWebhook',
    icon: 'file:kan.svg',
    group: ['transform'],
    version: 1,
    description: 'Manage Kanboard webhooks',
    defaults: {
      name: 'Kan Webhook',
    },
    inputs: [
      { type: NodeConnectionType.Main, displayName: 'Input' },
    ],
    outputs: [
      { type: NodeConnectionType.Main, displayName: 'Output' },
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
          { name: 'List All', value: 'list' },
          { name: 'Delete', value: 'delete' },
        ],
        default: 'list',
        description: 'The operation to perform',
      },
      {
        displayName: 'Webhook ID',
        name: 'webhookId',
        type: 'string',
        displayOptions: {
          show: { operation: ['get', 'delete'] },
        },
        default: '',
        description: 'The ID of the webhook',
        required: true,
      },
      {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        displayOptions: {
          show: { operation: ['create'] },
        },
        default: '',
        description: 'The URL where the webhook payload will be sent',
        required: true,
      },
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        displayOptions: {
          show: { operation: ['create'] },
        },
        options: [
          { name: 'Task Create', value: 'task.create' },
          { name: 'Task Update', value: 'task.update' },
          { name: 'Task Move', value: 'task.move' },
          { name: 'Task Delete', value: 'task.delete' },
          { name: 'Comment Create', value: 'comment.create' },
          { name: 'Comment Update', value: 'comment.update' },
          { name: 'Comment Delete', value: 'comment.delete' },
          { name: 'Project Create', value: 'project.create' },
          { name: 'Project Update', value: 'project.update' },
          { name: 'Project Delete', value: 'project.delete' },
        ],
        default: ['task.create'],
        description: 'Events to subscribe to',
        required: true,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const credentials = (await this.getCredentials('kanApi')) as {
      url: string;
      apiKey: string;
    };

    const operation = this.getNodeParameter('operation', 0) as string;
    const baseUrl = credentials.url.replace(/\/$/, ''); // Remove trailing slash
    let responseData: any;

    try {
      switch (operation) {
        case 'create':
          const url = this.getNodeParameter('url', 0) as string;
          const events = this.getNodeParameter('events', 0) as string[];

          const createBody = {
            url,
            events,
          };

          responseData = await this.helpers.request({
            method: 'POST',
            url: `${baseUrl}/api/v1/webhooks`,
            body: createBody,
            json: true,
          });
          break;

        case 'get':
          const getWebhookId = this.getNodeParameter('webhookId', 0) as string;
          responseData = await this.helpers.request({
            method: 'GET',
            url: `${baseUrl}/api/v1/webhooks/${getWebhookId}`,
            json: true,
          });
          break;

        case 'list':
          responseData = await this.helpers.request({
            method: 'GET',
            url: `${baseUrl}/api/v1/webhooks`,
            json: true,
          });
          break;

        case 'delete':
          const deleteWebhookId = this.getNodeParameter('webhookId', 0) as string;
          await this.helpers.request({
            method: 'DELETE',
            url: `${baseUrl}/api/v1/webhooks/${deleteWebhookId}`,
          });
          responseData = { success: true, webhookId: deleteWebhookId };
          break;

        default:
          throw new NodeOperationError(
            this.getNode(),
            `Unknown operation: ${operation}`,
          );
      }

      return [this.helpers.returnJsonArray(responseData)];
    } catch (error: any) {
      throw new NodeOperationError(
        this.getNode(),
        `Kan Webhook operation failed: ${error.message}`,
      );
    }
  }
}