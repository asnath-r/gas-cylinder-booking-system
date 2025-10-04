const express = require('express');
const { addCylinder, getCylinders, getCylinderById, updateCylinder, deleteCylinder, getCylindersByFilters } = require('../controllers/cylinderController');
const { protect } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');
const upload = require('../middlewares/uploadMiddleware');


const router = express.Router();


// Routes
router.post('/', protect('admin'), upload.single('image'), addCylinder);
router.get('/', getCylinders);
router.get('/:id', getCylinderById);
router.patch('/:id', protect('admin'), upload.single('image'), updateCylinder);

router.put('/:id', protect('admin'), upload.single('image'), updateCylinder);
router.delete('/:id', protect('admin'), deleteCylinder);

//filter
router.get('/filter/by', getCylindersByFilters);

module.exports = router;
