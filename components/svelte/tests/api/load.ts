import { _api, addAPIProvider } from '../../dist';
import { mockAPIModule } from '@iconizza/core/lib/api/modules/mock';

// API provider for tests
export const provider = 'mock-api';

// Set API module for provider
addAPIProvider(provider, {
	resources: ['http://localhost'],
});
_api.setAPIModule(provider, mockAPIModule);

// Prefix
let counter = 0;
export const nextPrefix = () => 'mock-' + counter++;
