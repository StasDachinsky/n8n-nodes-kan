import {
  ICredentialType,
  ICredentialTestRequest,
  ICredentialDataDecryptedObject,
  INodeProperties,
  IHttpRequestOptions,
} from 'n8n-workflow';

export class KanApi implements ICredentialType {
  name = 'kanApi';
  displayName = 'Kan API';
  properties: INodeProperties[] = [
    {
      displayName: 'API Base URL',
      name: 'url',
      type: 'string',
      default: 'http://localhost:8000',
      placeholder: 'http://you-kanboard-server:8000',
      description: 'Base URL of your Kanboard instance',
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      default: '',
      description: 'Your Kanboard API key (found in your user profile under API)',
      required: true,
    },
  ];

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.url}}',
      url: '/api/v1/projects',
      method: 'GET',
      headers: {
        Authorization: '=Bearer {{$credentials.apiKey}}',
        accept: 'application/json',
      },
      timeout: 10000,
    },
  };

  authenticate(
    credentials: ICredentialDataDecryptedObject,
    requestOptions: IHttpRequestOptions,
  ): Promise<IHttpRequestOptions> {
    const apiKey = credentials.apiKey as string;
    
    if (!apiKey?.trim()) {
      throw new Error('API Key is required for Kan API authentication');
    }
    
    requestOptions.headers = {
      Authorization: `Bearer ${apiKey.trim()}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
      ...requestOptions.headers,
    };
    
    return Promise.resolve(requestOptions);
  }
}