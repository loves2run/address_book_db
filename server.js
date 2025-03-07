import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import methodOverride from 'method-override';
import routes from './routes.js';
import https from 'https';
import fs from 'fs';

dotenv.config();

const app = express();
const HTTP_PORT = process.env.HTTP_PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// HTTPS redirect middleware
app.enable('trust proxy');
app.use((req, res, next) => {
    if(!req.secure) {
        return res.redirect(`https://${req.headers.host.split(':')[0]}:${HTTPS_PORT}${req.url}`);
    }
    next();
});

// Register view engine
app.set('view engine', 'ejs');

// Add a root route handler
app.get('/', (req, res) => {
    res.send('Server is running!'); // Or res.render('index') if you have an index view
});

// Register routes
app.use('/api', routes);

// SSL/TLS options
const options = {
    key: fs.readFileSync('./certs/private.key'),
    cert: fs.readFileSync('./certs/certificate.pem')
};

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Connection error:', err);
        process.exit(1); // Exit the process with an error code
    }
};

// Create HTTPS server
const httpsServer = https.createServer(options, app);

// Start servers
(async () => {
    await connectDB();

    // Start both servers
    app.listen(HTTP_PORT, () => {
        console.log(`HTTP Server running on port ${HTTP_PORT} (redirecting to HTTPS)`);
    });
    
    httpsServer.listen(HTTPS_PORT, () => {
        console.log(`HTTPS Server running on port ${HTTPS_PORT}`);
    });
})();

export { connectDB };