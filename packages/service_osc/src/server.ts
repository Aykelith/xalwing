//= Functions & Modules
// Own
import getConfig from './utils/getConfig';
// Others
import { createServer } from '@aykelith/xalgenezis-expressjs';
import { loadConfigFromFiles } from '@aykelith/xalgenezis-server';
import { connectToDB } from '@aykelith/xalgenezis-mongodb';

//= Structures & Data
// Own
import Config from './data/Config';
import EnvironmentalVariables from './data/EnvironmentalVariables';

declare global {
    namespace NodeJS {
        interface Global {
            Config: Config;
        }

        interface ProcessEnv extends EnvironmentalVariables {}
    }
}

export default async () => {
    if (!process.env.CONFIG_PATH) throw new Error();

    global.Config = getConfig(loadConfigFromFiles(process.env.CONFIG_PATH));

    const db = await connectToDB(global.Config.mongoURI);

    await createServer({});
};
