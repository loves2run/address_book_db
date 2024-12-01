import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const addressSchema = new Schema({
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    streetAddress: String,
    city: String,
    state: String,
    zipCode: String,
    category: [String]
});

const Address = model('Address', addressSchema);

export { Address };