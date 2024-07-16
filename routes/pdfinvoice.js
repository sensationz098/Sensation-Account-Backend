// const express = require('express');
// const { studentModel } = require('../models/student.model'); // Import the student model
// const PDFDocument = require('pdfkit');
// const fs = require('fs');
// const router = express.Router();

// // Generate invoice PDF
// router.get('/generate-invoice/:id', async (req, res) => {
//   try {
//     const studentId = req.params.id;
//     const student = await studentModel.findById(studentId);

//     if (!student) {
//       return res.status(404).send('Student not found');
//     }

//     // Create a new PDF document
//     const doc = new PDFDocument();
//     const filename = `invoice-${studentId}.pdf`;

//     // Pipe its output to a file
//     doc.pipe(fs.createWriteStream(filename));

//     // Add content to the PDF
//     doc.fontSize(20).text('Invoice', { align: 'center' });
//     doc.moveDown();
//     doc.fontSize(12).text(`Student Name: ${student.name}`);
//     doc.text(`Email: ${student.email}`);
//     doc.text(`Course: ${student.course}`);
//     doc.text(`Fee: ${student.fee}`);
//     doc.text(`Date of Payment: ${student.date_of_payment}`);
//     doc.text(`Course Duration: ${student.CourseDuration}`);
//     doc.text(`Teacher: ${student.Teacher}`);
//     // Add more fields as required

//     // Finalize the PDF and end the stream
//     doc.end();

//     // Send the PDF as a response
//     doc.on('finish', () => {
//       res.download(filename, err => {
//         if (err) {
//           res.status(500).send('Error generating PDF');
//         }

//         // Optionally delete the file after sending it
//         fs.unlinkSync(filename);
//       });
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;
