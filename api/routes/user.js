const path = require('path');
const express = require('express');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const userController = require('../controllers/user');

router.post('/auth/login', userController.login);

router.post('/auth/signup', userController.signUp);

router.post('/auth/add-employee', checkAuth, userController.addEmployee);

router.get('/auth/get-employees', checkAuth, userController.fetchEmployees);

router.get('/auth/get-employee/:employeeId', checkAuth, userController.fetchEmployee);

router.put('/auth/edit-employee/:employeeId', checkAuth, userController.updateEmployee);

router.delete('/auth/delete-employee/:employeeId', checkAuth, userController.deleteEmployee);

router.get('/auth/get-shifts', checkAuth, userController.fetchShifts);

router.get('/auth/get-schedule', checkAuth, userController.fetchDates);

router.get('/auth/get-shift/:shiftId', checkAuth, userController.fetchShift);

router.post('/auth/add-shift', checkAuth, userController.addShift);

router.put('/auth/edit-shift/:shiftId', checkAuth, userController.updateShift);

router.delete('/auth/delete-shift/:shiftId', checkAuth, userController.deleteShift);

router.get('/auth/get-user', checkAuth, userController.fetchUser);

router.put('/auth/edit-user', checkAuth, userController.updateUser);

router.delete('/auth/delete-user', checkAuth, userController.deleteUser);

router.get('/auth/call', userController.testCall);

module.exports = router;
