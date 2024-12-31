import { Address } from '../models/address.js';
import mongoose from 'mongoose';

export const deleteAddress = async (req, res) => {
    try {
        const addressId = req.params.id;
        // console.log('Incoming DELETE request from ID:', addressId);

        //validate ID
        if(!mongoose.isValidObjectId(addressId)) {
            console.error('Invalid address ID:', addressId);
            return res.status(400).send('Invalid address ID')
        }

        //Delete address
        const deletedAddress = await Address.findByIdAndDelete(addressId);
        
        if (!deletedAddress) {
            console.error('Address not found for ID:', addressId);
            return res.status(404).send('Address not found');
        }

        // console.log('Deleted Address:', deletedAddress);

        //send success response
        return res.status(200).json({
            message: 'Address deleted successfully',
            deletedAddress: deletedAddress
        });

    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({
            error: 'Failed to delete address. Please try again later'
        })

    }
};