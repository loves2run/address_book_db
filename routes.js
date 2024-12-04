import express from 'express';
import { getAllAddresses, searchAddresses, addNewAddress } from './controllers/addressControllers.js';


const router = express.Router();

//Get all addresses
router.get('/', getAllAddresses);

//Dynamically search addressbook by parameters
router.get('/search', searchAddresses);

//View new address form
router.get('/new-address', addNewAddress);

//allows me to add new address
router.post('/new-address', addNewAddress)


export default router;