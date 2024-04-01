const express = require('express')
const exceljs = require('exceljs')
const moment = require('moment')

const router = express.Router()
const bcrypt = require('bcrypt');
const {userModel} = require('../models/user.model')
const {studentModel} = require('../models/student.model')
const { authenticateUser } = require('../middlewares/auth.middleware')



router.get('/', (req,res) => {        
    res.json("This is the user Route")
})                                    



// GET /users/profile
router.get("/profile", authenticateUser, async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.status(200).json({
            username: user.username,
            email: user.email,
            contact: user.contact,
            role: user.role,
            // Add other profile details as needed
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});



// UPDATE USER PROFILE
router.put('/profile/update/:id', authenticateUser, async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const { username, email, contact} = req.body;

        // Update profile information
        user.username = username || user.username;
        user.email = email || user.email;
        user.contact = contact || user.contact;


        await user.save();

        res.status(200).json({
            message: 'User profile updated successfully',
            updatedProfile: {
                username: user.username,
                email: user.email,
                contact: user.contact,
                role: user.role,
                // Add other profile details as needed
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



router.put('/changePassword/:id', authenticateUser, async (req, res) => {
    try {
        const userId = req.params.id;
        const { password, confirmPassword } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).send("Passwords do not match");
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Example: Get user from the database using Mongoose (replace with your actual function)
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).send("User not found");
        }

        // Update the user's password
        user.password = hashedPassword;

        // Save the updated user to the database
        await user.save();

        res.status(200).json({ message: 'Password changed successfully!' });
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});



// GET ALL USERS 
router.get('/allusers', authenticateUser, async (req, res) => {
    try {
        const { id } = req.query;

        if (id) {
            const userIds = id.split(',');
            const users = await userModel.find({ _id: { $in: userIds } });
            return res.status(200).json(users);
        } else {
            const users = await userModel.find();
            return res.status(200).json(users);
        }
    } catch (err) {
        return res.status(400).json(err);
    }
});



router.post('/student/add', async (req, res) => {
    try {
        // Extract user ID from the authenticated user
        const userId = req.user.userId;
        const user = await userModel.findById(userId);

        const { name, email, contact, assignedUserId, isLifetime, course, batch, timing, date_of_payment, state, courseStartDate, courseEndDate, fee, CourseDuration, previousCourses } = req.body;

        // Check if a student with the same contact and course already exists
        const existingStudent = await studentModel.findOne({ contact, course });

        if (existingStudent) {
            return res.status(400).json({ message: 'Student already exists with the same course you are adding.' });
        }

        // Create a new student instance
        const student = new studentModel({
            name,
            email,
            contact,
            userId,
            assignedUserId,
            isLifetime,
            course,
            batch,
            timing,
            date_of_payment,
            state,
            courseStartDate,
            courseEndDate,
            fee,
            CourseDuration,
            previousCourses,
        });

        // Save the new student to the database
        await student.save();

        // Respond with a success message or the newly created student details
        res.status(201).json({
            message: 'Student added successfully',
            newStudent: {
                name: student.name,
                age: student.age,
                email: student.email,
                contact: student.contact,
                assignedUserId: student.assignedUserId,
                isLifetime: student.isLifetime,
                previousCourses: student.previousCourses,
            },
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



router.delete('/student/delete/:id', authenticateUser, async (req, res) => {
    try {
        // Extract user ID from the authenticated user
        const userId = req.user.userId;
        const user = await userModel.findById(userId);

        // Extract student ID from the request parameters
        const studentId = req.params.id;

        const student = await studentModel.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if the authenticated user is authorized to delete this student (Optional step, based on your application logic)

        // Delete the student from the database
        await studentModel.findByIdAndDelete(studentId);

        // Respond with a success message
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



// GET /users/students get all students 
router.get('/students', authenticateUser, async (req, res) => {
    try {
        // Extract user ID from the authenticated user
        const userId = req.user.userId;

        // Retrieve user details to check for role (optional, depending on your requirements)
        const user = await userModel.findById(userId);

        // Check if the authenticated user has the necessary permissions (optional, depending on your requirements)
        if (!user) {
            return res.status(403).json({ message: 'Unauthorized. User not found.' });
        }

        // Fetch all students associated with the user
        const students = await studentModel.find({ userId });

        // Respond with the list of students
        res.status(200).json({user: user.username, students });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



router.get('/student/:id', authenticateUser,async(req,res) => {
    try{
    const studentId = req.params.id;

    const student = await studentModel.findById({_id: studentId})

    res.send(student)
    }
    catch(err){

    }
})



router.put('/student/edit/:studentId', authenticateUser, async (req, res) => {
    const { studentId } = req.params;
    const { name, email, contact, course, batch, timing, date_of_payment, state, courseStartDate, courseEndDate, fee, CourseDuration, previousCourses } = req.body;
  
    try {
      const existingStudent = await studentModel.findById(studentId);
  
      if (!existingStudent) {
        return res.status(404).json({ msg: 'Student Not found' });
      }
  
      if (name) existingStudent.name = name;
      if (email) existingStudent.email = email;
      if (contact) existingStudent.contact = contact;
    //   if (assignedUserId) existingStudent.assignedUserId = assignedUserId; // Fix here
    //   if (isLifetime) existingStudent.isLifetime = isLifetime;
      if (course) existingStudent.course = course;
      if (batch) existingStudent.batch = batch;
      if (timing) existingStudent.timing = timing;
      if (date_of_payment) existingStudent.date_of_payment = date_of_payment;
      if (state) existingStudent.state = state;
      if (courseStartDate) existingStudent.courseStartDate = courseStartDate;
      if (courseEndDate) existingStudent.courseEndDate = courseEndDate;
      if (fee) existingStudent.fee = fee;
      if (CourseDuration) existingStudent.CourseDuration = CourseDuration;

    
      
      if (previousCourses && previousCourses.length > 0) {
        existingStudent.previousCourses = previousCourses; // Fix here
      }
  
      // Save the updated student details
      const updatedStudent = await existingStudent.save();
  
      return res.status(200).json(updatedStudent);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Internal Server Error' });
    }
  });



router.put('/student/extend-course/:studentId', authenticateUser, async (req, res) => {
    try {
        // Extract user ID from the authenticated user
        const userId = req.user.userId;

        // Retrieve user details to check for role (optional, depending on your requirements)
        const user = await userModel.findById(userId);

        // Extract student ID from the request parameters
        const studentId = req.params.studentId;

        // Find the student by ID
        const student = await studentModel.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Capture the current course details before making any changes
        const currentCourse = {
            start: new Date(student.courseStartDate),
            end: new Date(student.courseEndDate),
        };

        // Assign the userId to the student
        student.userId = userId;
        student.extended = true;

        // Validate and parse additional course duration, amount, and date_of_payment from the request body
        const { additionalMonths, amount, date_of_payment } = req.body;

        if (!additionalMonths || isNaN(additionalMonths) || additionalMonths <= 0) {
            return res.status(400).json({ message: 'Invalid or missing additional course duration' });
        }

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Invalid or missing amount' });
        }

        if (!date_of_payment || isNaN(Date.parse(date_of_payment))) {
            return res.status(400).json({ message: 'Invalid or missing date_of_payment' });
        }

        // Calculate the new end date based on the additional months
        const newEndDate = new Date(student.courseEndDate);
        newEndDate.setFullYear(newEndDate.getFullYear(), newEndDate.getMonth() + additionalMonths);

        // Update course details
        student.CourseDuration += additionalMonths;
        student.courseEndDate = newEndDate;

        // Log information for debugging
        console.log('Current course end date:', student.courseEndDate);
        console.log('Additional months:', additionalMonths);
        console.log('New end date:', newEndDate);

        // Record the previous course details
        student.previousCourses.push({
            start: currentCourse.start,
            end: currentCourse.end,
            amount: amount,
            extendedBy: additionalMonths,
            date_of_payment: new Date(date_of_payment),
        });

        // Save the changes to the database
        await student.save();

        // Respond with a success message or the updated student details
        res.status(200).json({
            message: 'Course extended successfully',
            updatedStudent: student,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



router.get('/download-excel',authenticateUser, async (req, res) => {
    try {
        // Default filter criteria for current year and month
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        const defaultFilterCriteria = {
            'enrolledCourses.courseEndDate': {
                $gte: new Date(`${currentYear}-${currentMonth}-01`),
                $lt: new Date(`${currentYear}-${currentMonth + 1}-01`),
            },
            userId: req.user.userId,
        };

        // Override default criteria if query parameters provided
        const { name, contact, course, startDate, endDate } = req.query;
        const filterCriteria = {
            ...defaultFilterCriteria,
        };

        if (name) {
            filterCriteria['name'] = { $regex: new RegExp(name, 'i') };
        }

        if (contact) {
            filterCriteria['contact'] = contact;
        }

        if (course) {
            filterCriteria['enrolledCourses.course'] = course;
        }

        if (startDate && endDate) {
            filterCriteria['enrolledCourses.courseEndDate'] = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        // Fetch data based on filter criteria
        const students = await studentModel.find(filterCriteria).lean();

        // Create Excel file and download
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Students');

        // ... (rest of the code for Excel creation, similar to the previous example)

        const columns = [
            // ... (existing columns)
        ];

        // Add dynamic columns for PreviousCourses only if there are previous courses
        students.forEach(student => {
            if (student.previousCourses && student.previousCourses.length > 0) {
                student.previousCourses.forEach((previousCourse, index) => {
                    const columnKey = `prevCourseEndDate${index + 1}`;

                    // Check if the column is already added
                    const isColumnExists = columns.some(column => column.key === columnKey);

                    if (!isColumnExists) {
                        columns.push({
                            header: `Prev Course ${index + 1} End Date`,
                            key: columnKey,
                            width: 15,
                        });
                    }
                });
            }
        });

        // Set columns in the worksheet
        worksheet.columns = columns;

        // Add data to the worksheet
        students.forEach(student => {
            student.enrolledCourses.forEach(course => {
                const isCourseExtended = student.previousCourses && student.previousCourses.length >= 1;
                const data = {
                    name: student.name,
                    contact: student.contact,
                    email: student.email,
                    course: course.course,
                    courseStartDate: course.courseStartDate,
                    courseEndDate: course.courseEndDate,
                    fee: course.fee,
                    CourseDuration: course.CourseDuration,
                    courseExtended: isCourseExtended ? 'Yes' : 'No',
                    username: req.user.name,
                };

                // Add data for PreviousCourses only if there are previous courses
                if (student.previousCourses && student.previousCourses.length > 0) {
                    student.previousCourses.forEach((previousCourse, index) => {
                        data[`prevCourseEndDate${index + 1}`] = previousCourse.end;
                    });
                }

                worksheet.addRow(data);
            });
        });


        // Set up response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');

        // Send the workbook as the response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error downloading Excel:', error);
        res.status(500).send('Internal Server Error');
    }
});



router.get('/students/filter', authenticateUser, async (req, res) => {
    try {
        const { name, contact, course, courseStartDate, courseEndDate, startDate, endDate, month, previousCourse } = req.query;

        const filterCriteria = {};

        if (name) {
            filterCriteria['name'] = { $regex: new RegExp(name, 'i') };
        }

        if (contact) {
            filterCriteria['contact'] = contact;
        }

        if (course) {
            filterCriteria['enrolledCourses.course'] = course || '';
        }

        if (courseStartDate) {
            filterCriteria['enrolledCourses.courseStartDate'] = new Date(courseStartDate);
        }

        if (courseEndDate) {
            filterCriteria['enrolledCourses.courseEndDate'] = new Date(courseEndDate);
        }

        if (startDate && endDate) {
            filterCriteria['createdAt'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        if (month) {
            const startOfMonth = new Date(new Date().getFullYear(), month - 1, 1);
            const endOfMonth = new Date(new Date().getFullYear(), month, 0, 23, 59, 59, 999);
            filterCriteria['enrolledCourses.courseEndDate'] = { $gte: startOfMonth, $lte: endOfMonth };
        }


        const students = await studentModel.find(filterCriteria).populate('userId', 'username email contact');
        res.status(200).json({ students });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



// ADDING STUDENT BY ADMIN SIDE
router.post('/admin/addStudent', authenticateUser, async(req,res) => {
    try{
       const {name, email, contact, enrolledCourses, assignedUsername} = req.body;
      const assignedUser = await userModel.findOne({username: assignedUsername})

      if(!assignedUser){
        return res.status(404).json({msg: 'User not found'})
      }

      const student = new studentModel({
        name, 
        email, 
        contact, 
        enrolledCourses, 
        userId: assignedUser._id,
        })
        await student.save();

        res.status(200).json({
            msg: 'Student added successfully',
            newStudent: {
               name: student.name,
               email: student.email,
               contact: student.contact,
               enrolledCourses: student.enrolledCourses
            }
        })
    }
    catch(err){
        console.error(err)
        res.status(500).json({msg: 'Internal Server Error'})
    }
})



// To ASSIGNED A USER TO THE STUDENT FROM ADMIN SIDE
router.post('/admin/student/assignUser', authenticateUser, async (req, res) => {
    try {
        const { studentId, assignUserId } = req.body;

        // Validate if the user has admin role (you can customize this validation as needed)
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Permission denied' });
        }

        // Find the student by ID and update assignUserId
        const student = await studentModel.findByIdAndUpdate(
            studentId,
            { assignUserId },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({
            message: 'Student assigned to user successfully',
            assignedStudent: {
                name: student.name,
                age: student.age,
                email: student.email,
                contact: student.contact,
                enrolledCourses: student.enrolledCourses,
                previousCourses: student.previousCourses,
                assignUserId: student.assignUserId,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



router.get('/allstudents', authenticateUser, async (req, res) => {
    try {

        const students = await studentModel.find();
        res.status(200).json({students });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



router.get('/display-and-download', authenticateUser,  async (req, res) => {
    try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth(); // JavaScript months are 0-indexed

        const nextMonthDate = new Date(currentYear, currentMonth + 1, 1);

        let filterCriteria = {
            'courseEndDate': {
                $gte: new Date(`${currentYear}-${currentMonth + 1}-01`),
                $lt: nextMonthDate,
            },
        };

        console.log(filterCriteria);

        // Check if date range is provided in the request
        if (req.query.startDate && req.query.endDate) {
            filterCriteria = {
                'courseEndDate': {
                    $gte: new Date(req.query.startDate),
                    $lt: new Date(req.query.endDate),
                },
            };
        }else if(req.query.startDate===null && req.query.endDate===null){
            filterCriteria = {
                'courseEndDate': {
                    $gte: new Date(`${currentYear}-${currentMonth + 1}-01`),
                    $lt: nextMonthDate,
                },
            };
        }

        console.log(filterCriteria);

        // Fetch data based on filter criteria
        const students = await studentModel.find(filterCriteria).lean();
        console.log(students);


        const validStudents = students.filter(student => {
            return student.courseEndDate instanceof Date && !isNaN(student.courseEndDate.valueOf());
        });

if (req.query.download === 'true') {
    try {
        // Create Excel file and download
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Students');

                const formatDate = (date) => {
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    return date.toLocaleDateString('en-US', options).replace(/ /g, '/');
                };


                const columns = [
                    { header: 'Name', key: 'name', width: 15 },
                    { header: 'Contact', key: 'contact', width: 15 },
                    { header: 'Email', key: 'email', width: 15 },
                    { header: 'Course', key: 'course', width: 15 },
                    { header: 'Course Start Date', key: 'courseStartDate', width: 15 },
                    { header: 'Course End Date', key: 'courseEndDate', width: 15 },
                    { header: 'Fee', key: 'fee', width: 10 },
                    { header: 'isLifetime', key: 'isLifetime', width: 10},
                    { header: 'AssignedUser', key: 'AssignedUserId', width: 100},
                    { header: 'UserId', key: 'UserId', width: 100},
                    { header: 'Course Duration', key: 'CourseDuration', width: 15 },
                    { header: 'Course Extended', key: 'courseExtended', width: 15 },
                ];

                // Add dynamic columns for PreviousCourses only if there are previous courses
                students.forEach(student => {
                    console.log(student.courseEndDate);
                    if (isNaN(new Date(student.courseEndDate).valueOf())) {
                        console.log('Invalid Date:', student);
                    }
                    if (student.previousCourses && student.previousCourses.length > 0) {
                        student.previousCourses.forEach((previousCourse, index) => {
                            const columnKey = `prevCourseEndDate${index + 1}`;

                            // Check if the column is already added
                            const isColumnExists = columns.some(column => column.key === columnKey);

                            if (!isColumnExists) {
                                columns.push({
                                    header: `Prev Course ${index + 1} End Date`,
                                    key: columnKey,
                                    width: 15,
                                });
                            }
                        });
                    }
                });

                // Set columns in the worksheet
                worksheet.columns = columns;

                // Add data to the worksheet
                students.forEach(student => {
                    student.previousCourses.forEach(previousCourse => {
                        const isCourseExtended = student.previousCourses && student.previousCourses.length >= 1;
                        const data = {
                            name: student.name,
                            contact: student.contact,
                            email: student.email,
                            course: previousCourse.course,
                            courseStartDate: formatDate(previousCourse.courseStartDate),
                            courseEndDate: formatDate(previousCourse.courseEndDate),
                            fee: previousCourse.fee,
                            CourseDuration: previousCourse.CourseDuration,
                            courseExtended: isCourseExtended ? 'Yes' : 'No',
                        };

                        // Add data for PreviousCourses only if there are previous courses
                        if (student.previousCourses && student.previousCourses.length > 0) {
                            student.previousCourses.forEach((prevCourse, index) => {
                                data[`prevCourseEndDate${index + 1}`] = formatDate(new Date(prevCourse.end));
                            });
                        }

                        worksheet.addRow(data);
                    });
                });

                // Set up response headers
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');

                // Send the workbook as the response
                await workbook.xlsx.write(res);
                res.end();
               } catch (error) {
                console.error('Error downloading Excel:', error);
                res.status(500).send('Internal Server Error');
            }
        } else {
            // Send JSON response to frontend
            res.json({ length: validStudents.length, students: validStudents });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.delete('/students/delete-all', authenticateUser, async (req, res) => {
    try {
        // Delete all students
        await studentModel.deleteMany({});

        // Respond with a success message
        res.status(200).json({ message: 'All students deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



const setFilterCriteria = (req) => {
    let filterCriteria = {};

    const isEmpty = (value) => {
        return value === undefined || value === null || value === '';
    };

    if (!isEmpty(req.query.startDate) && !isEmpty(req.query.endDate)) {
        const parsedStartDate = new Date(req.query.startDate);
        const parsedEndDate = new Date(req.query.endDate);
        if (!isNaN(parsedStartDate.valueOf()) && !isNaN(parsedEndDate.valueOf())) {
            filterCriteria['courseEndDate'] = {
                $gte: parsedStartDate,
                $lt: parsedEndDate,
            };
        }
    }

    if (!isEmpty(req.query.usernames)) {
        filterCriteria['assignedUserId'] = { $in: req.query.usernames.split(',') };
    }

    if (!isEmpty(req.query.courseStart)) {
        if (req.query.courseStart.toLowerCase() === 'null') {
            filterCriteria['courseStartDate'] = null; // Set courseStartDate to null
        } else {
            const parsedDate = new Date(req.query.courseStart);
            if (!isNaN(parsedDate.valueOf())) {
                filterCriteria['courseStartDate'] = { $eq: parsedDate };
            }
        }
    }

    if (!isEmpty(req.query.courseEnd)) {
        if (req.query.courseEnd.toLowerCase() === 'null') {
            filterCriteria['courseEndDate'] = null; // Set courseStartDate to null
        } else {
            const parsedDate = new Date(req.query.courseEnd);
            if (!isNaN(parsedDate.valueOf())) {
                filterCriteria['courseEndDate'] = { $eq: parsedDate };
            }
        }
    }
    
    if (!isEmpty(req.query.coursename)) {
        if (req.query.coursename.toLowerCase() === 'null') {
            filterCriteria['course'] = null; // Set course to null
        } else {
            filterCriteria['course'] = { $regex: new RegExp(req.query.coursename, 'i') };
        }
    }
    

    if (!isEmpty(req.query.creationDate)) {
        const parsedDate = new Date(req.query.creationDate);
        if (!isNaN(parsedDate.valueOf())) {
            filterCriteria['createdAt'] = { $eq: parsedDate };
        }
    }

    if (!isNaN(req.query.fees) && req.query.fees !== null && req.query.fees !== '') {
        filterCriteria['fee'] = { $eq: parseInt(req.query.fees) };
    }

    // Remove properties with empty values
    Object.keys(filterCriteria).forEach(key => isEmpty(filterCriteria[key]) && delete filterCriteria[key]);

    console.log('filter', filterCriteria);

    return filterCriteria;
};



router.get("/displaydownload", authenticateUser, async (req, res) => {
    try {
        const filterCriteria = setFilterCriteria(req);
        const students = await studentModel.find(filterCriteria).lean();

        if (req.query.download === 'true') {
            try {
                // Create Excel file and download
                const workbook = new exceljs.Workbook();
                const worksheet = workbook.addWorksheet('Students');

                const formatDate = (date) => {
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    return date.toLocaleDateString('en-US', options).replace(/ /g, '/'); // Replace spaces with '/'
                };

                const columns = [
                    // ... (existing columns)
                ];

                students.forEach(student => {
                    if (student.previousCourses && student.previousCourses.length > 0) {
                        student.previousCourses.forEach((previousCourse, index) => {
                            const columnKey = `prevCourseEndDate${index + 1}`;

                            const isColumnExists = columns.some(column => column.key === columnKey);

                            if (!isColumnExists) {
                                columns.push({
                                    header: `Prev Course ${index + 1} End Date`,
                                    key: columnKey,
                                    width: 15,
                                });
                            }
                        });
                    }
                });

                worksheet.columns = columns;

                students.forEach(student => {
                    student.enrolledCourses.forEach(course => {
                        const isCourseExtended = student.previousCourses && student.previousCourses.length >= 1;
                        const data = {
                            name: student.name,
                            contact: student.contact,
                            email: student.email,
                            course: course.course,
                            courseStartDate: formatDate(course.courseStartDate),
                            courseEndDate: formatDate(course.courseEndDate),
                            fee: course.fee,
                            CourseDuration: course.CourseDuration,
                            courseExtended: isCourseExtended ? 'Yes' : 'No',
                        };

                        if (student.previousCourses && student.previousCourses.length > 0) {
                            student.previousCourses.forEach((previousCourse, index) => {
                                data[`prevCourseEndDate${index + 1}`] = formatDate(new Date(previousCourse.end));
                            });
                        }

                        worksheet.addRow(data);
                    });
                });

                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');

                await workbook.xlsx.write(res);
                res.end();
            } catch (error) {
                console.error('Error downloading Excel:', error);
                res.status(500).send('Internal Server Error');
            }
        } else {
            res.json({ length: students.length, students });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;
