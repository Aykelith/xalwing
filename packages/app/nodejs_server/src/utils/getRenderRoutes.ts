//= Functions & Modules
// Own
import checkIfLogged from './checkIfLogged';
// Others
import { WebpackStatsManager } from '@aykelith/xalgenezis-server';
import { RouteTypes } from '@aykelith/xalgenezis-expressjs';

const MAIN_ENTRYPOINT_NAME = 'index';
const AUTH_ENTRYPOINT_NAME = 'auth';

export default async () => {
    const webpackStatsManager = new WebpackStatsManager(global.Config.webpackStatsFilePath, global.EventEmitter);
    if (process.env.NODE_ENV == 'production') await webpackStatsManager._loadWebpackStats();
    const baseScripts = {};

    baseScripts[MAIN_ENTRYPOINT_NAME] = webpackStatsManager.getEntrypointScripts(MAIN_ENTRYPOINT_NAME);
    baseScripts[AUTH_ENTRYPOINT_NAME] = webpackStatsManager.getEntrypointScripts(AUTH_ENTRYPOINT_NAME);

    webpackStatsManager.onRefresh(() => {
        baseScripts[MAIN_ENTRYPOINT_NAME] = webpackStatsManager.getEntrypointScripts(MAIN_ENTRYPOINT_NAME);
        baseScripts[AUTH_ENTRYPOINT_NAME] = webpackStatsManager.getEntrypointScripts(AUTH_ENTRYPOINT_NAME);
    });

    return {
        path: '*',
        requestType: RouteTypes.GET,
        requestFunc: async (req: any, res: any) => {
            const isLogged = checkIfLogged(req);
            const entryPoint = isLogged ? MAIN_ENTRYPOINT_NAME : AUTH_ENTRYPOINT_NAME;

            console.log(entryPoint);

            let extraHead =
                // `<script type="text/javascript" src="/generated/${entryPoint}_${getRequestLanguage(req)}.js"></script>` +
                baseScripts[entryPoint];

            // render the index template with the embedded React markup
            res.render('index', {
                // helmet: helmet,
                extraHead,
                title: '',
                description: '',
                keywords: '',
            });
        },
    };
};
