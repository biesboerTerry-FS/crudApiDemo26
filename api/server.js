const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8000;

const studentRouter = require('./routes/studentRouter');

const DATABASE_URL = process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL)
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());
app.use('/api/v1/students', studentRouter);

app.use(express.static(path.join(__dirname, '../reactjs/build')));

app.get(/^(?!\/api).+/, (request, response) => {
    response.sendFile(path.join(__dirname, '../reactjs/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
 