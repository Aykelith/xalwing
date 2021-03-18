//= Structures & Data
// Own
import Config from '../data/Config';

export default (rawConfig: { [key: string]: any }): Config => {
    const config = <Config>rawConfig;

    if (!config.port) throw new Error('Config field "port" is misisng');
    if (!config.requestToken)
        throw new Error('Config field "requestToken" is misisng');
    if (!config.gitlabPAT)
        throw new Error('Config field "gitlabPAT" is misisng');
    if (!config.mongoURI) throw new Error('Config field "mongoURI" is misisng');

    return config;
};
