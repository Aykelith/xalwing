//= Functions & Modules
// Own
import Routes from '../api';
// Others
import { createRequestManager, ServerSettings } from '@aykelith/xalgenezis-expressjs';

export default async (): Promise<ServerSettings> => {
    const serverConfig: ServerSettings = {
        supportJSONRequest: {
            limit: '100mb',
        },
        supportGet: {
            limit: '100mb',
            extended: true,
        },
        trustProxy: true,
        plugins: [
            createRequestManager({
                routes: Routes,
                routeErrorHandler: () => {},
            }),
        ],
        port: global.Config.port,
    };

    return serverConfig;
};
