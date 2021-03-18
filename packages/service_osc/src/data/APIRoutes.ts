//= Structures & Data
// Others
import RouteInfo from '@softprovider-remote-tasks/data_general/RouteInfo';
import { RouteTypes } from '@aykelith/xalgenezis-expressjs';

const Base = '/api';

const Auth_Base = `${Base}/auth`;

export default {
    LOGIN: { method: RouteTypes.POST, path: `${Auth_Base}/login` },
    LOGOUT: { method: RouteTypes.POST, path: `${Auth_Base}/logout` },
} as { [key: string]: RouteInfo };
