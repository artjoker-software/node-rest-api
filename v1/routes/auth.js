import { Router as routeConstructor } from 'express';
import { authService } from '../services';

const auth = routeConstructor();

auth.use('/login', authService.loginByLocal);
auth.use('/facebook/login', authService.loginByFacebook());
auth.use('/facebook/callback', authService.loginByFacebookCallback);
auth.use('/twitter/login', authService.loginByTwitter());
auth.use('/twitter/callback', authService.loginByTwitterCallback);

export default auth;
