//= Structures & Data
// Own
import { RouteTypes } from '@aykelith/xalgenezis-expressjs-data';

const Base = '/api';

export default {
    LOGIN: { method: RouteTypes.POST, path: `${Base}/login` },
};
