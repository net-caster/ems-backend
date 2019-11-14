const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Op = require('sequelize').Op;

const User = require('../models/User');
const Employee = require('../models/Employee');
const DateDim = require('../models/DateDim');
const WorkDay = require('../models/WorkDay');

const loginValidation = require('../middleware/loginValidator');
const signupValidation = require('../middleware/signupValidator');
const addEmployeeValidation = require('../middleware/addEmployeeValidator');
const editUserValidation = require('../middleware/editUserValidator');
const shiftValidator = require('../middleware/shiftValidator');
const currDate = require('../utils/currDate');

exports.fetchEmployees = async (req, res, next) => {
	const userId = req.userId;

	try {
		const user = await User.findByPk(userId);
		const employees = await user.getEmployees();

		res.status(200).json({
			employees: employees
		});
	} catch (err) {
		console.log(err);
	}
};

exports.fetchEmployee = async (req, res, next) => {
	const userId = req.userId;
	const employeeId = req.params.employeeId;

	try {
		const employee = await Employee.findOne({where: {userId: userId, id: employeeId}});
		if (!employee) {
			return res.status(404).json({
				notFound: true
			});
		}
		const workWeek = await WorkDay.findAll({where: {employeeId: employeeId, week: currDate.week}});

		res.status(200).json({
			employee: employee,
			workWeek: workWeek
		});
	} catch (err) {
		console.log(err);
	}
};

exports.addEmployee = async (req, res, next) => {
	const userId = req.userId;
	const { name, email, payRate } = req.body;

	const user = await User.findByPk(userId);

	if (addEmployeeValidation(name, payRate)) {
		try {
			const employee = await user.createEmployee({
				name: name,
				payRate: payRate,
				email: email
			});
			console.log(employee);
			res.status(201).json({
				msg: 'Employee added successfully',
				redirect: true
			});
		} catch (err) {
			console.log(err);
		}
	}
};

exports.updateEmployee = async (req, res, next) => {
	const employeeId = req.params.employeeId;
	const { name, email, payRate } = req.body;

	if (addEmployeeValidation(name, payRate)) {
		try {
			const employee = await Employee.findByPk(employeeId);

			employee.name = name;
			employee.email = email;
			employee.payRate = payRate;

			await employee.save();

			console.log(employee);

			res.status(200).json({
				msg: 'Employee updated successfully!',
				redirect: true
			});
		} catch (err) {
			console.log(err);
		}
	}
};

exports.deleteEmployee = async (req, res, next) => {
	const employeeId = req.params.employeeId;
	try {
		const employee = await Employee.findByPk(employeeId);
		await employee.destroy({ force: true });
		res.status(200).json({
			msg: 'Employee deleted successfully!',
			redirect: true
		});
	} catch (err) {
		console.log(err);
	}
};

exports.fetchAllShifts = async (req, res, next) => {
	const userId = req.userId;

	try {
		const user = await User.findByPk(userId);
		const shifts = await user.getWorkDays();
		res.status(200).json({
			shifts: shifts
		});

	} catch (err) {
		console.log(err);
	}
};

exports.fetchShift = async (req, res, next) => {
	const userId = req.userId;
	const shiftId = req.params.shiftId;

	console.log(shiftId);

	try {
		const workShift = await WorkDay.findOne({where: {userId: userId, id: shiftId}});

		res.status(200).json({
			workShift: workShift
		});
	} catch (err) {
		console.log(err);
	}
};

exports.fetchDayShifts = async (req, res, next) => {
	const year = req.headers.year;
	const month = req.headers.month;
	const day = req.headers.day;
	const userId = req.userId;

	console.log(req.headers);

	try {
		const shifts = await WorkDay.findAll({where: {userId: userId, year: year, month: month, day: day}});
		res.status(200).json({
			calendarShifts: shifts
		});
	} catch (err) {
		console.log(err);
	}
};

exports.addShift = async (req, res, next) => {
	const { employeeId, payRate, userId, name, date, dateId, weekNum, hourStart, minutesStart, hourEnd, minutesEnd, deduct, shiftHours, shiftWage, year, month, day, weekDay } = req.body;

	console.log(req.body);

	if (shiftValidator(req.body)) {
		try {
			const employee = await Employee.findByPk(employeeId);
			if (!employee) {
				return res.status(404).json({
					errMsg: "No such employee found!"
				});
			}
			const selectedDate = await WorkDay.findByPk(`${year}${month + 1 < 10 ? '0' + (month + 1) : month + 1}${day < 10 ? '0' + day : day}${employeeId}`);
			console.log(selectedDate);
			if (selectedDate) {
				return res.status(409).json({
					errMsg: `A shift for ${employee.name} already exists on this date!`
				})
			}
			const workDay = await employee.createWorkDay({
				id: `${dateId}${employeeId}`,
				name: name,
				payRate: payRate,
				userId: userId,
				shift_start: `${hourStart}:${minutesStart}`,
				shift_end: `${hourEnd}:${minutesEnd}`,
				break_length: deduct,
				shift_hours: shiftHours,
				shift_wage: shiftWage,
				date: date,
				week: weekNum,
				year: year,
				month: month,
				day: day,
				week_day: weekDay
			});
			console.log(workDay);
			res.status(200).json({
				msg: `A shift for ${employee.name} has been added on ${date}.`,
				redirect: true
			});
		} catch (err) {
			console.log(err);
		}
	}
};

exports.updateShift = async (req, res, next) => {
	const shiftId = req.params.shiftId;
	const { hourStart, minutesStart, hourEnd, minutesEnd, shiftHours, shiftWage, deduct } = req.body;

	if (shiftHours !== 0) {
		try {
				const workDay = await WorkDay.findByPk(shiftId);
				if (!workDay) {
					res.status(404).json({
						errMsg: "No such shift found!"
					});
				}

				workDay.shift_start = `${hourStart}:${minutesStart}`;
				workDay.shift_end = `${hourEnd}:${minutesEnd}`;
				workDay.shift_hours = shiftHours;
				workDay.shift_wage = shiftWage;
				workDay.break_length = deduct;

				workDay.save();

				res.status(200).json({
					msg: "Shift updated successfully!",
					redirect: true
				});

		} catch (err) {
			console.log(err);
		}
	}
};

exports.deleteShift = async (req, res, next) => {
	const shiftId = req.params.shiftId;

	try {
		const selectedShift = await WorkDay.findByPk(shiftId);
		await selectedShift.destroy({ force: true });
		res.status(200).json({
			delMsg: "Shift deleted successfully!",
			redirect: true
		});
	} catch (err) {
		console.log(err);
	}
};

exports.login = async (req, res, next) => {
	const { email, password } = req.body;

	if (loginValidation(email, password)) {
		try {
			const user = await User.findOne({ where: { email: email } });
			if (!user) {
				return res.status(401).json({
					errorEmail: 'No user with that e-mail found!'
				});
			}
			bcrypt.compare(password, user.password, (err, result) => {
				if (err) {
					console.log(err);
					return res.status(422).json({
						errorMsg: err
					});
				}
				if (result) {
					const token = jwt.sign(
						{
							email: user.email,
							userId: user.id
						},
						process.env.JWT_KEY,
						{
							expiresIn: "2h"
						}
					);
					res.cookie("access_token", `Bearer ${token}`, {httpOnly: true, maxAge: 2 * 60 * 60 * 1000});
					return res.status(200).json({
						user: {
							id: user.id,
							name: user.name,
							email: user.email
						},
						redirect: true,
						isAuth: true,
						expiryDate: jwt.decode(token).exp
					});
				}
				return res.status(422).json({
					errorPassword: 'Wrong password! Please try again.'
				});
			});
		} catch (err) {
			console.log(err);
			res.status(500).json({
				errorMsg: err
			});
		}
	}
};

exports.signUp = async (req, res, next) => {
	const { name, email, password, confirmPassword } = req.body;

	const user = await User.findOne({ where: { email: email } });

	if (user) {
		return res.status(409).json({
			errorEmail: 'User with that email already exists!'
		});
	} else {
		if (signupValidation(req.body)) {
				bcrypt.hash(password, 12, async (err, hash) => {
					try {
						if (err) {
							return res.status(500).json({
								errorMsg: err
							});
						} else {
							const user = await User.create({
								email: email,
								name: name,
								password: hash
							});

							console.log(user);
							res.status(201).json({
								message: 'User created successfully!',
								user: {
									id: user.id,
									name: user.name,
									email: user.email
								},
								redirect: true,
								isAuth: true
							});
						}
					} catch (err) {
						console.log(err);
						res.status(500).json({
							errorMsg: err
						});
					}
				});
		}
	}
};

exports.fetchUser = async (req, res, next) => {
	const userId = req.userId;

	try {
		const user = await User.findByPk(userId);
		const employees = await user.getEmployees();

		res.status(200).json({
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				company: user.company
			},
			numOfEmployees: employees.length
		});
	} catch (err) {
		console.log(err);
	}
};

exports.updateUser = async (req, res, next) => {
	const userId = req.userId;
	const { name, company, email, password, newPassword, confirmNewPassword } = req.body;

	if (editUserValidation(name, email, password)) {
		try {
			const user = await User.findByPk(userId);
			if (!user) {
				return res.status(401).json({
					errorEmail: 'No user with that e-mail found!'
				});
			}
			bcrypt.compare(password, user.password, async (err, result) => {
				if (err) {
					console.log(err);
					return res.status(422).json({
						errorMsg: err
					});
				}
				if (result) {
					if (newPassword && newPassword.length >= 8 && newPassword === confirmNewPassword) {
						bcrypt.hash(newPassword, 12, async (err, hash) => {
							try {
								if (err) {
									return res.status(500).json({
										errorMsg: err
									});
								} else {
									user.password = hash;

									await user.save();

									console.log(user);
									res.status(201).json({
										message: 'User updated successfully!',
										redirect: true,
									});
								}
							} catch (err) {
								console.log(err);
								res.status(500).json({
									errorMsg: err
								});
							}
						});
					}

					user.name = name;
					user.email = email;
					user.company = company;

					await user.save();

					console.log(user);

					return res.status(200).json({
						msg: 'User updated successfully!',
						redirect: true
					});
				}
				return res.status(422).json({
					errorPassword: 'Wrong password! Please try again.'
				});
			});
		} catch (err) {
			console.log(err);
		}
	}
};

exports.deleteUser = async (req, res, nxt) => {
	const userId = req.userId;
	try {
		const user = await User.findByPk(userId);
		await user.destroy({ force: true });
		res.status(200).json({
			msg: 'Account deleted!',
			redirect: true
		});
	} catch (err) {
		console.log(err);
	}
};
