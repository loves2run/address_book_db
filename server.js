import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import http from 'node:http';
import methodOverride from 'method-override';
import routes from './routes.js';
import { Address } from './models/address.js';

dotenv.config();
// console.log('MONGO_URI:', process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT;

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//Connect to MongoDB
const connectDB = async () => {
    // console.log('ConnectDB called');
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
        // console.log('Connection state:', mongoose.connection.readyState);
    } catch (err) {
        console.error('Connection error:', err);
        process.exit(1); //Exit the process with an error code
    }
};

(async () => {
    await connectDB();
})();

//Register view engine
app.set('view engine', 'ejs');

//Register routes
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

export { connectDB };
