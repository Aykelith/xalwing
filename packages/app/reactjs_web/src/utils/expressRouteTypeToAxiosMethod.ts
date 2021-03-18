//= Structures & Data
// Others
import { RouteTypes, RouteTypeValues } from '@aykelith/xalgenezis-expressjs-data';

export default (routeType: RouteTypeValues): string => {
    if (routeType === RouteTypes.GET) return 'GET';
    else return 'POST';
};
