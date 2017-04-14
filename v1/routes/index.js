import { Router as routeConstructor } from 'express';

import users from './users';
import auth from './auth';

const v1 = routeConstructor();

v1.use('/', auth);
v1.use('/users', users);

export default v1;
