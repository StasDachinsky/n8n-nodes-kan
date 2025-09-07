"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanApi = void 0;
class KanApi {
    constructor() {
        this.name = 'kanApi';
        this.displayName = 'Kan API';
        this.properties = [
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
        this.test = {
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
    }
    authenticate(credentials, requestOptions) {
        const apiKey = credentials.apiKey;
        if (!(apiKey === null || apiKey === void 0 ? void 0 : apiKey.trim())) {
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
exports.KanApi = KanApi;
