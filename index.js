const dotenv = require("dotenv");
const connectDB = require("./config/db")
const express = require('express')
const app = express()
app.use(express.json())
dotenv.config()

const cors = require('cors');
const port = process.env.PORT || 3001

connectDB();

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use('/api/ads', require('/routes/adRoutes'));
app.use('.qpi/users', require('./routes/userRoutes'))

app.use(errorHandler);

app.listen(port, ()=> console.log(`Server is running on port ${port}`))

// http://localhost:3001/api/###/

