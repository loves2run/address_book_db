import express from 'express';
import { getAllAddresses } from './controllers/addressControllers.js';


const router = express.Router();

router.get('/', getAllAddresses);




export default router;