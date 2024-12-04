import { Address } from '../models/address.js';
import validator from 'validator';

//controller to get all addresses
export const getAllAddresses = async (req, res) => {
    try {
        const addresses = await Address.find();
        res.status(200).json(addresses);
    } catch (err) {
        res.statu(500).json({ error: err.message });
    }
};


//controller to dynamically search by paramaters
export const searchAddresses = async (req, res) => {
    try {
        const { firstName, lastName, phone, city, state, zipcode, category, 
            page=1, 
            limit=10, 
            sortBy=req.query.sortBy || 'lastName', 
            sortOrder='asc' 
        } = req.query;

        let query = {};

        if (firstName) {
            query.firstName = { $regex: firstName, $options: 'i' };
        }

        if (lastName) {
            query.lastName = { $regex: lastName, $options: 'i'};
        }

        if (phone) {
            query.phone = { $regex: phone, $options: 'i'};
        }

        if (city) {
            query.city = { $regex: city, $options: 'i'};
        }

        if (state) {
            query.state = { $regex: state, $options: 'i'};
        }

        if (zipcode) {
            query.zipcode = { $regex: zipcode, $options: 'i'};
        }

        if (category) {
            query.category = { $in: category.split(',') };
        }

        //calculate pagination
        const skip = (page-1) * limit;

        //build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        //execute search with pagination
        const [results, total] = await Promise.all([
            Address.find(query)
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
                .select('-__v'), //exclude version key
            Address.countDocuments(query)
        ]);

        //Return response
        res.json({
            status: 'Success',
            data: {
                results,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalResults: total,
                    hasNextPage: skip + results.length < total,
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occured while searching addresses',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }

};


//controller to create new address and view in browser
export const addNewAddress = async (req, res) => {
    //if get request, show the form
    if (req.method === 'GET') {
        return res.render('add-address');
    }

    //if post request, process the form
    try {
        const errors = [];

        //validate input fields with validator
        if (!req.body.firstName || !validator.isAlpha(req.body.firstName)) {
            errors.push('First name is required and must contain only letters.');
        }

        if (!req.body.lastName || !validator.isAlpha(req.body.lastName)) {
            errors.push('Last name is required and must contain only letters.');
        }

        if(!req.body.email || !validator.isEmail(req.body.email)) {
            errors.push('A valid email address is required.');
        }

        if (!req.body.phone || !validator.isMobilePhone(req.body.phone, 'en-US')) {
            errors.push('A valid phone number is required.');
        }

        if (!req.body.zipCode || !validator.isNumeric(req.body.zipCode.toString())) {
            errors.push('Zip code must be numeric.');
        }

        if(errors.length > 0) {
            //if there are validations errors, re-render the form with errors
            return res.render('add-address', {
                error: errors.join(' '), //combine error messages
                formData: req.body  //Pass form data to repopulate fields
            });
        }

        //split categories string to an array and remove whitespace
        const category = req.body.category
        ? req.body.category.split(',').map(cat => cat.trim())
        : [];

        //create new address document
        const newAddress = new Address({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            email: req.body.email,
            streetAddress: req.body.streetAddress,
            city: req.body.city,
            zipCode: req.body.zipCode,
            category
        });

        //save to database
        await newAddress.save();

        //redirect to the main address list page
        res.redirect('/api');

    } catch (error) {
        console.error('Error saving address:', error);
        res.render('add-address', {
            error: 'Failed to save address. Please try again.',
            formData: req.body //pass back the form data to repopulate fields
        });
    }
};











