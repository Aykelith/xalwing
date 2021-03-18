//= Functions & Modules
// Others
import { createRequest, createRouteStructure, RequestError } from '@aykelith/xalgenezis-expressjs';
import axios from 'axios';

//= Structures & Data
// Others
import { APIRoutes } from '@softprovider-remote-tasks/app_remote_tasks/data_server';

export default () => {
    return createRouteStructure(
        APIRoutes.LOGIN.method,
        APIRoutes.LOGIN.path,
        createRequest({}, (req, data, onSuccess) => {
            if (!data.username) throw new RequestError(400, 'Username is missing');
            if (!data.password) throw new RequestError(400, 'Password is missing');

            // Authentificate on manager server
            try {
            } catch (error) {
                console.error(error);
            }
        })
    );
};
