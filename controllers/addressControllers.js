import { Address } from '../models/address.js';
import { validateAddressData } from './validationUtils.js';
import validator from 'validator';

//controller to get all addresses
export const getAllAddresses = async (req, res) => {
    try {
        const addresses = await Address.find();  //Fetch all addresses
        res.render('view-addresses', { addresses });  //Render the view-addresses.ejs
    } catch (err) {
        console.error('Error fetching addresses', err);
        res.status(500).send('Failed to retrieve addresses.');
    }
};


export const addNewAddress = async (req, res) => {
    if (req.method === 'GET') {
        return res.render('add-address');
    }

    try {
        const validation = validateAddressData(req.body);
        
        if (!validation.isValid) {
            return res.render('add-address', {
                error: validation.errors,
                formData: req.body
            });
        }

        const newAddress = new Address(validation.processedData);
        await newAddress.save();
        res.redirect('/api?added=true');

    } catch (error) {
        console.error('Error saving address:', error);
        res.render('add-address', {
            error: 'Failed to save address. Please try again.',
            formData: req.body
        });
    }
};