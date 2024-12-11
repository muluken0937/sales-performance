const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS
const userRoutes = require('./routes/userRoutes');
const customerRoutes = require('./routes/customerRoutes');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
