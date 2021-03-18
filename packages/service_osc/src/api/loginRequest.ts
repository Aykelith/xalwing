//= Functions & Modules
// Own
import checkPassword from '../utils/checkPassword';
// Others
import GenezisGeneralError from '@aykelith/xalgenezis-generalerror';
import { createRequest, createRouteStructure } from '@aykelith/xalgenezis-expressjs';
import { Collection as MongoCollection } from 'mongodb';

//= Structures & Data
// Own
import APIRoutes from '../data/APIRoutes';
import UserDBItem from '../modules/users/data/UserDBItem';
import UserDBFields from '../modules/users/data/UserDBFields';

type RequestData = {
    username: string;
    password: string;
};

export default (usersCollection: MongoCollection) => {
    return createRouteStructure(
        APIRoutes.LOGIN.method,
        APIRoutes.LOGIN.path,
        createRequest({}, (req: any, data: RequestData, onSuccess: Function) => {
            if (!data.username) throw new GenezisGeneralError('TODO');
            if (!data.password) throw new GenezisGeneralError('TODO2');

            const username = data.username.trim();

            const userDoc: UserDBItem | null = await usersCollection.findOne({ [UserDBFields.NAME]: username });

            if (userDoc === null) {
                throw new GenezisGeneralError('TODO3');
            }

            if (!checkPassword(data.password, userDoc.password)) {
                throw new GenezisGeneralError('TODO4');
            }
        })
    );
};
