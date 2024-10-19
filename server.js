const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const ServiceRequest = require('./models/ServiceRequest');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.post('/api/requests', async (req, res) => {
    const { name, email, serviceType, message } = req.body;
    const newRequest = new ServiceRequest({ name, email, serviceType, message });
    
    try {
        await newRequest.save();
        res.status(201).json({ message: 'Service request submitted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting request.', error });
    }
});

app.get('/api/requests', async (req, res) => {
    try {
        const requests = await ServiceRequest.find();
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requests.', error });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
