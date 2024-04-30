const express = require('express');
const router = express.Router();
const multer = require('multer');
const { studentModel } = require('../models/student.model');
const xlsx = require('xlsx');
const moment = require('moment');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



router.post('/upload', upload.single('excelfile'), async (req, res) => {
    try {
        // Check if a file was provided
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Get mapping data from the request body
        const mapping = JSON.parse(req.body.mapping);

        // Parse the uploaded file based on its type
        let workbook;
        if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        } else {
            return res.status(400).json({ message: 'Unsupported file format' });
        }

        // Assuming the first sheet is the one to be processed
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convert the worksheet to an array of objects
        const data = xlsx.utils.sheet_to_json(worksheet);

        // Map headers based on the provided mapping
        const mappedData = data.map(row => {
            const mappedRow = {};
            Object.keys(mapping).forEach(field => {
                const header = mapping[field];
                // Check if the header exists in the row
                if (row.hasOwnProperty(header)) {
                    // If the header exists, assign its value to the corresponding field
                    mappedRow[field] = row[header];
                } else {
                    // If the header doesn't exist, assign null or default value
                    if (field === 'assigneduserid' || field === 'dateofpayment' || field === 'coursestartdate' || field === 'courseenddate') {
                        mappedRow[field] = null;
                    } else if (field === 'courseduration') {
                        mappedRow[field] = 0;
                    } else {
                        mappedRow[field] = null; // You might handle other fields differently based on your requirements
                    }
                }
            });
            return mappedRow;
        });

        mappedData.forEach(row => {
            console.log('Before formatting:', row); // Log the row before formatting
            if (row.dateofpayment) {
                row.dateofpayment = moment(xlsx.SSF.parse_date_code(row.dateofpayment), 'MM/DD/YY').toISOString();
            }
            if (row.coursestartdate) {
                row.coursestartdate = moment(xlsx.SSF.parse_date_code(row.coursestartdate), 'MM/DD/YY').toISOString();
            }
            if (row.courseenddate) {
                row.courseenddate = moment(xlsx.SSF.parse_date_code(row.courseenddate), 'MM/DD/YY').toISOString();
            }
            console.log('After formatting:', row); // Log the row after formatting
        });
        

        // Save the mapped data to the database
        await studentModel.insertMany(mappedData);

        // Send success response
        res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




module.exports = router;
