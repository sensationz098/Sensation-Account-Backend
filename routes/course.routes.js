const expres = require('express')
const router = expres.Router()
const {courseModel} = require('../models/courses.model');
const {authenticateUser} = require('../middlewares/auth.middleware')



// Route to create a new course
router.post('/add', authenticateUser, async(req,res) => {
    try{
     const {coursename} = req.body;
     const courseExist = await courseModel.findOne({coursename});

     if(courseExist){
        return res.status(400).json({msg: 'Course Already Exist!!'})
     }

     const newCourse = await courseModel.create({coursename})

     res.status(200).json({msg: 'New Course Added', newCourse})
    }
    catch(err){
     res.status(500).json({msg: err.message})
    }
})



router.get('/', authenticateUser, async(req,res) => {
    try{
       const courses = await courseModel.find()
       res.status(200).json(courses)
    }
    catch(err){
       res.status(500).json({msg: err.message})
    }
})



router.get('/:id', authenticateUser,  async(req,res) => {
    try{
        const id = req.params.id
      const course = await courseModel.findById(id)
      if(course){
        res.status(200).json(course);
      }else{
        res.status(400).json({msg: 'Course Not Found'})
      }
    }
    catch(err){
        res.status(500).json({msg: err.message})
    }
})



// Route to delete a course by ID
router.delete('/delete/:id', authenticateUser, async (req, res) => {
    try {
        await courseModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Course deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router








