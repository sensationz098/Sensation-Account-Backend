const express = require('express')
const router = express.Router()
const {teacherModel} = require('../models/teacher.model')
const {authenticateUser} = require('../middlewares/auth.middleware')

router.post('/add',authenticateUser, async (req, res) => {
    try {
        const newTeacher = await teacherModel.create(req.body);
        res.status(201).json(newTeacher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all teachers
router.get('/', authenticateUser, async (req, res) => {
    try {
        const teachers = await teacherModel.find().sort({TeacherName: 1});
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single teacher
router.get('/:id', authenticateUser, async (req, res) => {
    try {
        const teacher = await teacherModel.findById(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json(teacher);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a teacher
router.put('/update/:id', authenticateUser, async (req, res) => {
    try {
        const updatedTeacher = await teacherModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTeacher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a teacher
router.delete('/delete/:id', authenticateUser, async (req, res) => {
    try {
        await teacherModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Teacher deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router