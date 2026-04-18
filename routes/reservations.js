const express = require('express');

const { 
  getReservations, 
  getReservation, 
  addReservation, 
  updateReservation, 
  deleteReservation,
  checkAvailability,
  deleteAllReservations,
  getDashboardStats // 🟢 1. เพิ่มการ Import ฟังก์ชันใหม่เข้ามาตรงนี้
} = require('../controllers/reservations');

const router = express.Router({mergeParams:true});

const {protect,authorize} = require('../middleware/auth');

router.route('/')
    .get(protect, authorize('admin','user') , getReservations)
    .post(protect, authorize('admin', 'user'), addReservation);

router.delete(
  '/deleteAll',
  protect,
  authorize('admin'),
  deleteAllReservations
);

// 🟢 2. เพิ่ม Route สำหรับ Dashboard ไว้ตรงนี้
// ⚠️ ต้องวางไว้เหนือ Route /:id เสมอ เพื่อไม่ให้ express มองว่าคำว่า 'dashboard' เป็น ID
router.route('/dashboard/stats')
    .get(protect, authorize('admin','Admin'), getDashboardStats);

router.route('/:id')
    .get(protect, authorize('admin','user') , getReservation)
    .put(protect, authorize('admin', 'user'), updateReservation)
    .delete(protect, authorize('admin', 'user'), deleteReservation);

router.post(
  '/check/:coworkingId',
  protect,
  checkAvailability
);

module.exports=router;