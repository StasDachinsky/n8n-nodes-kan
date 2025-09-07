import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class KanComment implements INodeType {
  description: INodeTypeDescription = {
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

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const credentials = (await this.getCredentials('kanApi')) as {
      url: string;
      apiKey: string;
    };

    const operation = this.getNodeParameter('operation', 0) as string;
    const taskId = this.getNodeParameter('taskId', 0) as string;
    const baseUrl = credentials.url.replace(/\/$/, ''); // Remove trailing slash
    let responseData: any;

    try {
      switch (operation) {
        case 'create':
          const content = this.getNodeParameter('content', 0) as string;
          const userId = this.getNodeParameter('userId', 0) as string;

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
          throw new NodeOperationError(
            this.getNode(),
            `Unknown operation: ${operation}`,
          );
      }

      return [this.helpers.returnJsonArray(responseData)];
    } catch (error: any) {
      throw new NodeOperationError(
        this.getNode(),
        `Kan Comment operation failed: ${error.message}`,
      );
    }
  }
}