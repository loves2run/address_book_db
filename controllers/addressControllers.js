import { Address } from '../models/address.js';

//controller to get all addresses
export const getAllAddresses = async (req, res) => {
    try {
        const addresses = await Address.find();
        res.status(200).json(addresses);
    } catch (err) {
        res.statu(500).json({ error: err.message });
    }
};


















