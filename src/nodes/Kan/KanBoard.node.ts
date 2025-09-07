import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class KanBoard implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Kan Board',
    name: 'kanBoard',
    icon: 'file:kan.svg',
    group: ['transform'],
    version: 1,
    description: 'Interact with Kanboard boards and columns',
    defaults: {
      name: 'Kan Board',
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
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Board', value: 'board' },
          { name: 'Column', value: 'column' },
        ],
        default: 'board',
        description: 'The resource to interact with',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['board'] },
        },
        options: [
          { name: 'Get', value: 'get' },
          { name: 'List All', value: 'list' },
        ],
        default: 'get',
        description: 'The operation to perform on boards',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['column'] },
        },
        options: [
          { name: 'Get', value: 'get' },
          { name: 'List All', value: 'list' },
        ],
        default: 'list',
        description: 'The operation to perform on columns',
      },
      {
        displayName: 'Board ID',
        name: 'boardId',
        type: 'string',
        displayOptions: {
          show: { 
            resource: ['board'], 
            operation: ['get'] 
          },
        },
        default: '',
        description: 'The ID of the board',
        required: true,
      },
      {
        displayName: 'Project ID',
        name: 'projectId',
        type: 'string',
        displayOptions: {
          show: { 
            resource: ['board'], 
            operation: ['list'] 
          },
        },
        default: '',
        description: 'The ID of the project to list boards for',
        required: true,
      },
      {
        displayName: 'Board ID',
        name: 'boardId',
        type: 'string',
        displayOptions: {
          show: { 
            resource: ['column'], 
            operation: ['list'] 
          },
        },
        default: '',
        description: 'The ID of the board to list columns for',
        required: true,
      },
      {
        displayName: 'Column ID',
        name: 'columnId',
        type: 'string',
        displayOptions: {
          show: { 
            resource: ['column'], 
            operation: ['get'] 
          },
        },
        default: '',
        description: 'The ID of the column',
        required: true,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const credentials = (await this.getCredentials('kanApi')) as {
      url: string;
      apiKey: string;
    };

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;
    const baseUrl = credentials.url.replace(/\/$/, ''); // Remove trailing slash
    let responseData: any;

    try {
      if (resource === 'board') {
        switch (operation) {
          case 'get':
            const boardId = this.getNodeParameter('boardId', 0) as string;
            responseData = await this.helpers.request({
              method: 'GET',
              url: `${baseUrl}/api/v1/boards/${boardId}`,
              json: true,
            });
            break;

          case 'list':
            const projectId = this.getNodeParameter('projectId', 0) as string;
            responseData = await this.helpers.request({
              method: 'GET',
              url: `${baseUrl}/api/v1/projects/${projectId}/boards`,
              json: true,
            });
            break;
        }
      } else if (resource === 'column') {
        switch (operation) {
          case 'get':
            const columnId = this.getNodeParameter('columnId', 0) as string;
            responseData = await this.helpers.request({
              method: 'GET',
              url: `${baseUrl}/api/v1/columns/${columnId}`,
              json: true,
            });
            break;

          case 'list':
            const listBoardId = this.getNodeParameter('boardId', 0) as string;
            responseData = await this.helpers.request({
              method: 'GET',
              url: `${baseUrl}/api/v1/boards/${listBoardId}/columns`,
              json: true,
            });
            break;
        }
      }

      return [this.helpers.returnJsonArray(responseData)];
    } catch (error: any) {
      throw new NodeOperationError(
        this.getNode(),
        `Kan Board operation failed: ${error.message}`,
      );
    }
  }
}