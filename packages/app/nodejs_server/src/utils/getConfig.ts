//= Structures & Data
// Own
import Config from "../data/Config";

export default (rawConfig: any): Config => {
    const config = <Config>rawConfig;

    if (!config.port) throw new Error('Missing config parameter "port"');
    if (!config.viewsPath) throw new Error('Missing config parameter "viewsPath"');
    if (!config.sessionSecret) throw new Error('Missing config parameter "sessionSecret"');
    if (!config.webpackStatsFilePath) throw new Error('Missing config parameter "webpackStatsFilePath"');
    if (!config.oscService) throw new Error('Missing config parameter "oscService"');
    if (!config.oscService.url) throw new Error('Missing config parameter "oscService.url"');
    if (!config.oscService.requestToken) throw new Error('Missing config parameter "oscService.requestToken"');
    if (!config.dataFilePath) throw new Error('Missing config parameter "dataFilePath"');
    if (!config.adminPassword) throw new Error('Missing config parameter "adminPassword"');

    return config;
};
