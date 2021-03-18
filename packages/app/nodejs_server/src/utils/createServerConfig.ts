//= Functions & Modules
// Own
import Routes from '../api';
import getRenderRoutes from './getRenderRoutes';
// Others
import { createRequestManager, ServerSettings } from '@aykelith/xalgenezis-expressjs';

export default async (): Promise<ServerSettings> => {
    const serverConfig: ServerSettings = {
        viewEngine: 'ejs',
        viewsPaths: [global.Config.viewsPath],
        supportJSONRequest: {
            limit: '100mb',
        },
        supportGet: {
            limit: '100mb',
            extended: true,
        },
        session: {
            secret: global.Config.sessionSecret,
            saveUninitialized: false,
            resave: false,
            cookie: {
                secure: false,
            },
        },
        trustProxy: true,
        plugins: [
            createRequestManager({
                routes: [await getRenderRoutes()],
                routeErrorHandler: () => {},
            }),
        ],
        port: global.Config.port,
    };

    if (process.env.GSP_HOT_RELOAD) {
        serverConfig.hmr = {
            webpackConfigFilePath: process.env.GSP_HOT_RELOAD,
            eventsEmitter: global.EventEmitter,
            webpackStatsFilePath: global.Config.webpackStatsFilePath,
        };
    }

    return serverConfig;
};
