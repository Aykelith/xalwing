interface Config {
    port: number;
    viewsPath: string;
    sessionSecret: string;
    oscService: {
        url: string;
        requestToken: string;
    };
    webpackStatsFilePath: string;
    dataFilePath: string;
    adminPassword: string;
}

export default Config;
