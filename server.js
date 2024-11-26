const express = require('express');
const cors = require('cors');
const File = require('./src/models/fileModel'); //import schema
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/filesDB', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err))

const app = express();
app.use(cors({ origin: '*'}));
app.use(express.json());

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => cb(null, `${Date.now()} - ${file.originalname}`)
});

const upload = multer({ storage });



// POST /upload

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const newFile = new File({ filename: req.file.originalname, path: req.file.path });
        await newFile.save();
        res.status(201).send(newFile);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

// GET /files
app.get('/files', async ( req, res) => {
    try {
        const files = await File.find();
        res.status(200).send(files);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(5000, () => console.log(`Server running on http://localhost:5000`));