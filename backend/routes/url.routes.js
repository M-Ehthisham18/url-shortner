import express from 'express';
import {generateNewShortUrl ,handleRedirectUrl} from '../controllers/url.controller.js';

const router = express.Router();


router.post('/',generateNewShortUrl);
// router.get('/:shortId', handleRedirectUrl )

export default router;;