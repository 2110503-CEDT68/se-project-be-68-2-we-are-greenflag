const { 
    getCoworkings, 
    getCoworking, 
    createCoworking, 
    updateCoworking, 
    deleteCoworking 
} = require('../coworkings'); // ปรับ path ให้ตรงกับไฟล์ controller ของคุณ
const Coworking = require('../../models/Coworking');
const Reservation = require('../../models/Reservation');

// จำลอง (Mock) Mongoose Models
jest.mock('../../models/Coworking');
jest.mock('../../models/Reservation');

describe('Coworking Controllers', () => {
    let req, res, next;

    // รีเซ็ตตัวแปร req, res ก่อนเริ่มรันแต่ละ Test Case
    beforeEach(() => {
        req = { params: {}, body: {} };
        res = {
            status: jest.fn().mockReturnThis(), // ให้ status() สามารถ chain ต่อด้วย json() ได้
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks(); // ล้างข้อมูลการจำลองเก่าทิ้ง
    });

    describe('getCoworkings', () => {
        it('ควรดึงข้อมูลได้สำเร็จ (Branch: Try -> Success)', async () => {
            const mockData = [{ name: 'Space A' }, { name: 'Space B' }];
            Coworking.find.mockResolvedValue(mockData); // จำลองว่า DB ส่งข้อมูลกลับมา

            await getCoworkings(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                count: 2,
                data: mockData
            });
        });

        it('ควรคืนค่า Error 400 ถ้า Database มีปัญหา (Branch: Catch)', async () => {
            Coworking.find.mockRejectedValue(new Error('DB Error')); // บังคับให้พังเพื่อเข้า catch

            await getCoworkings(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false });
        });
    });

    describe('getCoworking', () => {
        let mockPopulateQuery;

        beforeEach(() => {
            // จำลองการ chain .populate() ของ Mongoose
            mockPopulateQuery = { populate: jest.fn() };
            Coworking.findById.mockReturnValue(mockPopulateQuery);
        });

        it('ควรดึงข้อมูล 1 รายการได้สำเร็จ (Branch: Try -> Found)', async () => {
            req.params.id = '123';
            const mockData = { _id: '123', name: 'Space A' };
            mockPopulateQuery.populate.mockResolvedValue(mockData);

            await getCoworking(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockData });
        });

        it('ควรคืนค่า Error 400 ถ้าหาไอดีนี้ไม่เจอ (Branch: Try -> !coworking)', async () => {
            req.params.id = '999';
            mockPopulateQuery.populate.mockResolvedValue(null); // บังคับให้หาไม่เจอเพื่อเข้า if

            await getCoworking(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Coworking space not found' });
        });

        it('ควรคืนค่า Error 400 ถ้าเกิดข้อผิดพลาด (Branch: Catch)', async () => {
            req.params.id = '123';
            mockPopulateQuery.populate.mockRejectedValue(new Error('Invalid ID')); // บังคับเข้า catch

            await getCoworking(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('createCoworking', () => {
        it('ควรสร้างข้อมูลใหม่ได้สำเร็จ (Branch: Try -> Success)', async () => {
            req.body = { name: 'New Space' };
            const mockCreated = { _id: '1', name: 'New Space' };
            Coworking.create.mockResolvedValue(mockCreated);

            await createCoworking(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockCreated });
        });

        it('ควรคืนค่า Error 400 ถ้าข้อมูลไม่ครบหรือสร้างไม่สำเร็จ (Branch: Catch)', async () => {
            req.body = {};
            Coworking.create.mockRejectedValue(new Error('Validation Failed')); // บังคับเข้า catch

            await createCoworking(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
        });
    });

    describe('updateCoworking', () => {
        it('ควรอัปเดตข้อมูลได้สำเร็จ (Branch: Try -> Found)', async () => {
            req.params.id = '123';
            req.body = { name: 'Updated Space' };
            const mockUpdated = { _id: '123', name: 'Updated Space' };
            Coworking.findByIdAndUpdate.mockResolvedValue(mockUpdated);

            await updateCoworking(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockUpdated });
        });

        it('ควรคืนค่า Error 400 ถ้าหาไอดีที่จะอัปเดตไม่เจอ (Branch: Try -> !coworking)', async () => {
            req.params.id = '999';
            Coworking.findByIdAndUpdate.mockResolvedValue(null); // จำลองหาข้อมูลไม่เจอ

            await updateCoworking(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Coworking space not found' });
        });

        it('ควรคืนค่า Error 400 ถ้าเกิดข้อผิดพลาดตอนอัปเดต (Branch: Catch)', async () => {
            req.params.id = '123';
            Coworking.findByIdAndUpdate.mockRejectedValue(new Error('Update Failed'));

            await updateCoworking(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('deleteCoworking', () => {
        it('ควรลบข้อมูลและ Reservations ที่เกี่ยวข้องได้สำเร็จ (Branch: Try -> Found)', async () => {
            req.params.id = '123';
            const mockCoworking = {
                _id: '123',
                deleteOne: jest.fn().mockResolvedValue({}) // จำลองฟังก์ชันลบของ instance
            };
            Coworking.findById.mockResolvedValue(mockCoworking);
            Reservation.deleteMany.mockResolvedValue({});

            await deleteCoworking(req, res, next);

            // ตรวจสอบว่าสั่งลบ Reservation ของที่นี่ไปจริงๆ
            expect(Reservation.deleteMany).toHaveBeenCalledWith({ coworking: '123' });
            expect(mockCoworking.deleteOne).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: {} });
        });

        it('ควรคืนค่า Error 404 ถ้าหาไอดีที่จะลบไม่เจอ (Branch: Try -> !coworking)', async () => {
            req.params.id = '999';
            Coworking.findById.mockResolvedValue(null);

            await deleteCoworking(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Coworking space not found' });
        });

        it('ควรคืนค่า Error 400 ถ้าเกิดข้อผิดพลาดตอนลบ (Branch: Catch)', async () => {
            req.params.id = '123';
            Coworking.findById.mockRejectedValue(new Error('Delete Failed'));

            await deleteCoworking(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });
});