import express from 'express';
import { getAllAddresses, addNewAddress, } from './controllers/addressControllers.js';
import { editAddress, viewAddressToEdit } from './controllers/edit-address-controller.js';
import { deleteAddress  } from './controllers/delete-address-controller.js';
import { searchAddresses } from './controllers/search-controller.js';

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
router.get('/edit/:id', viewAddressToEdit);

//Edit address
router.patch('/edit/:id', editAddress);

//Delete address
router.delete('/delete/:id', deleteAddress);


export default router;