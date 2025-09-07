import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class KanProject implements INodeType {
  description: INodeTypeDescription = {
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
          const projectId = this.getNodeParameter('projectId', 0) as string;
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
          throw new NodeOperationError(
            this.getNode(),
            `Unknown operation: ${operation}`,
          );
      }

      return [this.helpers.returnJsonArray(responseData)];
    } catch (error: any) {
      throw new NodeOperationError(
        this.getNode(),
        `Kan Project operation failed: ${error.message}`,
      );
    }
  }
}