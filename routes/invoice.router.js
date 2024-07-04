const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const { authenticateUser } = require("../middlewares/auth.middleware");
const nodemailer = require("nodemailer");
require("dotenv").config();
const easyinvoice = require("easyinvoice");
const studentModel = require("../models/student.model"); // assuming the student model is in this path

router.post("/student", authenticateUser, async (req, res) => {
  try {
    const { id: studentId, email } = req.body;
    const student = await studentModel.findById(studentId);

    if (!student) {
      return res
        .status(404)
        .json({ status: "false", message: "user not found" });
    }

    const result = await generateInvoice(student);
    if (result) {
      const emailSendStatus = await sendEmailWithInvoice(email);
      if (emailSendStatus) {
        return res
          .status(200)
          .json({
            status: "success",
            message: "Invoice Generated and Sent Successfully",
          });
      } else {
        return res
          .status(206)
          .json({
            status: "Partial success",
            message: "Invoice Generated but got error while sending",
          });
      }
    }
  } catch (err) {
    return res
      .status(500)
      .json({
        status: "error",
        message: "An error occurred",
        error: err.message,
      });
  }
});

async function generateInvoice(student) {
  const { name, contact, state } = student;
  const taxNotation =
    state === "Delhi"
      ? { key: "IGST+CGST", value: 18 }
      : { key: "SGST", value: 18 };
  const productsArr = [
    {
      quantity: 2,
      description: "Product 1",
      taxRate: taxNotation.value,
      price: 33.87,
    },
  ];

  const data = {
    apiKey: "free",
    mode: "development",
    images: {
      logo: "https://public.budgetinvoice.com/img/logo_en_original.png",
    },
    sender: {
      company: "SensationZ Media & Arts Pvt.Ltd",
      address: "B-305, 3rd Floor, North Ex Mall, Sector-9, Rohini",
      zip: "110086",
      city: "Delhi",
      country: "India",
      email: "sensationzmediaandarts@gmail.com",
    },
    client: {
      buyer_name: name,
      state: state,
      contact: contact,
    },
    information: {
      Invoice_Number: `INV-${Date.now()}`,
      Date: new Date().toLocaleDateString(),
    },
    products: productsArr,
    bottomNotice: "This is a Computer Generated Invoice",
    settings: {
      currency: "INR",
    },
    translate: {
      taxNotation: taxNotation.key,
    },
  };

  const result = await easyinvoice.createInvoice(data);
  await fs.writeFile("../invoice/invoice.pdf", result.pdf, "base64");
  return true;
}

async function sendEmailWithInvoice(studentEmail) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: studentEmail,
    subject: "Invoice",
    html: "<h1>Here is your Invoice</h1>",
    attachments: [
      {
        filename: "invoice.pdf",
        path: "../invoice/invoice.pdf",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

module.exports = router;
