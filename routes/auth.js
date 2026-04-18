const express = require('express');
// 1. เพิ่ม getUsers เข้ามาตรงนี้
const { register, login, getMe, logout, getUsers } = require('../controllers/auth');

const router = express.Router();

// 2. เพิ่ม authorize เข้ามาตรงนี้
const { protect, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', logout);

// 3. เพิ่ม Route สำหรับดึง User ทั้งหมด (ให้ Admin ใช้)
router.get('/users', protect, authorize('admin', 'Admin'), getUsers);

module.exports = router;