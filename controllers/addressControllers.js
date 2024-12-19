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