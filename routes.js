import express from 'express';
import { getAllAddresses, searchAddresses, addNewAddress, } from './controllers/addressControllers.js';
import { editAddress } from './controllers/edit-address.js';

const router = express.Router();

//Get all addresses
router.get('/', getAllAddresses);

//Dynamically search addressbook by parameters
router.get('/search', searchAddresses);

//View new address form
router.get('/new-address', addNewAddress);

//Save new address
router.post('/new-address', addNewAddress);

//Display address to be edited
router.get('/edit:id', editAddress);

//Edit address
router.patch('/edit/:id', editAddress);


export default router;