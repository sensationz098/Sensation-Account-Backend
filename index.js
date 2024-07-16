const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");
const app = express();
app.use(express.json());
mongoose.plugin(autopopulate);

const { connection } = require("./db/db.js");
const authRoute = require("./routes/auth.routes.js");

const cors = require("cors");

<<<<<<< HEAD
app.use(cors())
const UserProfile = require('./routes/user.routes.js')
const Courses = require('./routes/course.routes.js')
const Teachers = require('./routes/teachers.routes.js')
const Upload = require('./routes/fileUpload.routes.js')
const PDFinvoice = require('./routes/pdfinvoice.js')

=======
app.use(cors());
const UserProfile = require("./routes/user.routes.js");
const Courses = require("./routes/course.routes.js");
const Teachers = require("./routes/teachers.routes.js");
const Upload = require("./routes/fileUpload.routes.js");
const Invoice = require("./routes/invoice.router.js");
>>>>>>> 948f0aae250b78554388537dbd0cc43467b2bb22

app.use("/auth", authRoute);
app.use("/user", UserProfile);
app.use("/courses", Courses);
app.use("/teachers", Teachers);
app.use("/fileupload", Upload);
app.use("/invoice", Invoice);

<<<<<<< HEAD
app.use('/auth', authRoute)
app.use('/user', UserProfile)
app.use('/courses', Courses)
app.use('/teachers', Teachers)
app.use('/fileupload', Upload)
app.use('/invoice', PDFinvoice)


app.get('/', (_req,res) => {
    res.send("Hello World!!")
    console.log('Working')
})
=======
app.get("/", (_req, res) => {
  res.send("Hello World!!");
  console.log("Working");
});
>>>>>>> 948f0aae250b78554388537dbd0cc43467b2bb22

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log(`Connected to the DB successfully`);
  } catch (err) {
    console.log(err.message);
  }
  console.log(`Server is running on ${process.env.PORT}`);
});
