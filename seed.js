import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { Address } from './models/address.js';
import { connectDB } from './server.js';

dotenv.config();


const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        console.log('MongoDB connected for seeding!');

        //Generate fake addresses
        const fakeAddresses = Array.from ({ length: 100 }).map(() => ({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            phone: faker.phone.number(),
            email: faker.internet.email(),
            streetAddress: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode(),
            category: [faker.word.noun(), faker.word.noun()]
        }));

        //Insert fake address data into the database
        await Address.deleteMany();
        console.log('Existing addresses deleted.');

        await Address.insertMany(fakeAddresses).catch((error) => {
            console.error('Insert failed:', error);
        });
        console.log('Database seeded with 100 fake addresses.');
    } catch (error) {
        console.error('Error seeding the database:', error);
        console.error('Error details:', error.stack);
    } finally {
        //Close the database connection
        try {
            await mongoose.connection.close();
            console.log('MongoDB connection closed.');
        } catch (closeError) {
            console.error('Error closing MongoDB connection:', closeError);
        }
    }
};

seedDatabase();
