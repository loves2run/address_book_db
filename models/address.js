import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const addressSchema = new Schema({
    firstName: String,
    lastName: String,
    phone: String,
    email: {
        type: String,
        lowercase: true
    },
    streetAddress: String,
    city: String,
    state: String,
    zipCode: String,
    category: [String]
});

//Presave middleware to convert fields to lowercase
addressSchema.pre('save', function(next) {
    if (this.firstName) this.firstName = this.firstName.toLowerCase();
    if (this.lastName) this.lastName = this.lastName.toLowerCase();
    if (this.email) this.email = this.email.toLowerCase();
    if (this.streetAddress) this.streetAddress = this.streetAddress.toLowerCase();
    if (this.city) this.city = this.city.toLowerCase();
    if (this.state) this.state = this.state.toLowerCase();
    if (this.category) {this.category = this.category.map(cat => cat.toLowerCase());
    }
    next();
});

const Address = model('Address', addressSchema);

export { Address };