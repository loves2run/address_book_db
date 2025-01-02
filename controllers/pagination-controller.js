import { Address } from '../models/address.js';

export const paginateDocs = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        //execute query with page and limit values
        const addresses = await Address.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        //get total documents in the Address collection
        const count = await Address.countDocuments();

        //return response with posts, total pages, and current page
        res.json({
            addresses,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        console.error(error.message);
    }
};