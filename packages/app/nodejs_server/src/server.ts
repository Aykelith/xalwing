//= Functions & Modules
// Own
import getConfig from "./utils/getConfig";
import createServerConfig from "./utils/createServerConfig";
import EventEmitter from "./utils/MyEventEmitter";
import Db from "./modules/db/util/Db";
// Others
import { createServer } from "@aykelith/xalgenezis-expressjs";
import { loadConfigFromFiles } from "@aykelith/xalgenezis-server";

//= Structures & Data
// Own
import Config from "./data/Config";
import Environment from "./data/Environment";

declare global {
    namespace NodeJS {
        interface Global {
            Config: Config;
            Db: Db;
            EventEmitter: EventEmitter;
        }

        interface ProcessEnv extends Environment {}
    }
}

export default async () => {
    if (!process.env.CONFIG_PATH) throw new Error("Environment variable CONFIG_PATH was not set");

    global.Config = getConfig(loadConfigFromFiles(process.env.CONFIG_PATH));
    global.EventEmitter = new EventEmitter();

    global.Db = new Db(global.Config.dataFilePath);

    await createServer(await createServerConfig());
};
