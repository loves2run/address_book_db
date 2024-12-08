import { Address } from '../models/address.js';
import { validateAddressData } from './validationUtils.js';
import mongoose from 'mongoose';

export const viewAddressToEdit = async (req, res) => {
    try {
        const params = req.params.id;

        //Validate ID
        if(!mongoose.isValidObjectId(params)) {
            console.error('Invalid address ID:', params);
            return res.status(400).send('Invalid address ID');
        }

        
        //Fetch address
        const address = await Address.findById(params);
        if (!address) {
            console.error('Address not found for ID:', params);
            return res.status(404).send('Address not found');
        }

        
        //Render edit-address.ejs with the fetched address
        res.render('edit-address.ejs', {
            formData: address,
            action: `/api/edit/${params}?_method=patch`
        });

        // console.log('Data sent to EJS', {
        //     FormData: address,
        //     action: `/api/addresses/${params}?_method=PATCH`,
        // });


    } catch (error) {
        console.error('Unable to fetch the requested address. Please try again', error);
        res.status(500).render('error', { message: 'Failed to fetch address. Please try again later.'});
    }
};



export const editAddress = async (req, res) => {
    try {
        const params = req.params.id;

        if (!mongoose.isValidObjectId(params)) {
            return res.status(400).send('Invalid address ID');
        }

        const validation = validateAddressData(req.body);

        if (!validation.isValid) {
            return res.render('edit-address', {
                error: validation.errors,
                formData: req.body,
                action: `/api/edit/${params}?_method=patch`
            });
        }

        // /api/edit/<%= address._id %>

        const updateAddress = await Address.findByIdAndUpdate(
            params,
            validation.processedData,
            { new: true, runValidators: true }
        );

        if (!updateAddress) {
            return res.stats(404).send('Address not found');
        }

        res.redirect('/api/');

    } catch (error) {
        console.error('Error updating address:', error);
        res.render('edit-address', {
            error: 'Failed to update address. Please try again.',
            formData: req.body,
            action:`/api/edit/${params}?_method=patch`
        });
    }
};


/***  psuedocode - steps to editing address  ****
 - select address by id and load the data into the add new address form
 - render new address form with populated info included
 - update h1 to read "Edit Address"
 - update button to read Submit edited Address
 - onClick submit PATCH request to update edited fields

  
*/