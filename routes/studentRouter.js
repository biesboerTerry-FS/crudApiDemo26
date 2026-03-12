const express = require('express');
const router = express.Router(); 

const Student = require('../models/studentModel');
// RESTful endpoints
// GET POST PUT/PATCH DELETE

// ^ mideleware function to get student by id
const getStudent = async (request, response, next) => {
    let student;
    try {
        student = await Student.findById(request.params.id);
        if (student == null) {
            return response.status(404).json({ 
                message: 'Student not found.' 
            });
        }
    } catch (error) {
        return response.status(500).json({ 
            message: error.message 
        });
    }
    response.student = student;
    next();
};  

// ^ get all
router.get('/', async (request, response) => {
    try {
        const students = await Student.find();
        response.json(students);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }   
});

// ^ get one
router.get('/:id', getStudent, async (request, response) => {
    response.send(response.student);    
});

// ^ create
router.post("/", async (request, response) => {
    const student = new Student({
        name: request.body.name,
        grade: request.body.grade
}) 
    try {
        const newStudent = await student.save();
        response.status(201).json(newStudent);
    } catch (error) {
        response.status(400).json({ 
            message: error.message 
        });
    }
});  

// ^ put one - update entire document
router.put('/:id', getStudent, async (request, response) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            request.params.id,
            request.body,
            { new: true }
        );
        response.json(updatedStudent);
    } catch (error) {
        response.status(400).json({ message: error.message });
    }
});

// ^ patch one - allows parts of the document to be updated
router.patch('/:id', getStudent, async (request, response) => {
    if (request.body.name != null) {
        response.student.name = request.body.name;
    }
    if (request.body.grade != null) {
        response.student.grade = request.body.grade;
    }
    try {
        const updatedStudent = await response.student.save();
        response.json(updatedStudent);
    } catch (error) {
        response.status(400).json({ 
            message: error.message 
        });
    }
});

// ^ delete
router.delete('/:id', getStudent, async (request, response) => {
    try {
        await Student.findByIdAndDelete(request.params.id);
        response.json({ message: 'Student removed.' });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

module.exports = router;