import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class KanUser implements INodeType {
  description: INodeTypeDescription = {
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
        case 'get':
          const userId = this.getNodeParameter('userId', 0) as string;
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
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      return [this.helpers.returnJsonArray(responseData)];
    } catch (error: any) {
      throw new NodeOperationError(this.getNode(), `Kan API error: ${error.message}`);
    }
  }
}
