require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const File = require('./src/models/fileModel'); //import schema
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/filesDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err))

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const cloudinary = require('cloudinary').v2;
const path = require('path');



// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dkpbuytaz',
    api_key: '196245946785398',
    api_secret: 'cte8emHk5Po3RT7kEHx0FxUNC_o',
});

// Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', // Cloudinary folder to store files
        allowed_formats: ['jpg', 'png', 'pdf'], // Allowed file formats
    },
});

const upload = multer({ storage });

// POST /upload

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // Save Cloudinary URL and original filename in MongoDB
        const newFile = new File({
            filename: req.file.originalname,
            path: req.file.path, // Cloudinary URL
            cloudinary_id: req.file.filename, // Cloudinary public ID
        });
        await newFile.save();
        res.status(201).send(newFile);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// GET /files
app.get('/files', async (req, res) => {
    try {
        const files = await File.find();
        res.status(200).send(files);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/', (req, res) => {
    res.send("Server is running");
})

app.listen(5000, () => console.log(`Server running on http://localhost:5000`));