//= Functions & Modules
// Others
import axios from 'axios';

//= Structures & Data
// Others
import { RouteTypes, RouteTypeValues } from '@aykelith/xalgenezis-expressjs';

export default async (method: RouteTypeValues, path: string, data: any) => {
    return axios({
        method: method === RouteTypes.GET ? 'get' : 'post',
        url: `${global.Config.managerService.url}${path}`,
        headers: {},
    });
};
