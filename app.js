const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');

const sequelize = require('./api/database/mysql-db');

const port = process.env.PORT || 3000;

const User = require('./api/models/User');
const Employee = require('./api/models/Employee');
const WorkDay = require('./api/models/WorkDay');
const DateDim = require('./api/models/DateDim');

const userRoutes = require('./api/routes/user');

app.use(cookieParser());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());

app.use(cors({
	origin: "https://ems-react-ui.netlify.com",
	credentials: true
}));

Employee.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Employee);
WorkDay.belongsTo(Employee, { constraints: true, onDelete: 'CASCADE' });
Employee.hasMany(WorkDay);
WorkDay.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(WorkDay);

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', "https://ems-react-ui.netlify.com");
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
		return res.status(200).json({});
	}
	next();
});

app.use(userRoutes);

// app.get('*', (req, res, next) => {
//   res.sendFile(path.join(__dirname + '/index.html'));
// 	// next();
// });

(async () => {
	let startDate = new Date("2019-01-01");
	let endDate = new Date("2021-01-01");
	let currDate = startDate;

	let months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
		let days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];

	Date.prototype.getWeekNumber = (year, month, day) => {
		let d = new Date(Date.UTC(year, month, day));
		let dayNum = d.getUTCDay() || 7;
		d.setUTCDate(d.getUTCDate() + 4 - dayNum);
		let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
		return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
	};

	try {
		// await sequelize.sync({ force: true });

		await sequelize.sync();

		// while (currDate < endDate) {
		// 	let id = `${currDate.getFullYear()}${currDate.getMonth() + 1 < 10 ? '0' + (currDate.getMonth() + 1) : currDate.getMonth() + 1}${currDate.getDate() < 10 ? '0' + currDate.getDate() : currDate.getDate()}`;
		// 	let date = `${currDate.getFullYear()}-${currDate.getMonth() + 1}-${currDate.getDate()}`;
		//   await DateDim.create({
		// 		id: parseInt(id),
		// 		date: date,
		// 		y: currDate.getFullYear(),
		// 		m: currDate.getMonth(),
		// 		d: currDate.getDate(),
		// 		w: currDate.getWeekNumber(currDate.getFullYear(), currDate.getMonth(), currDate.getDate()),
		// 		q: Math.floor(((new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate()).getMonth() + 11) / 3) % 4) + 1,
		// 		wd: currDate.getDay(),
		// 		wd_name: days[currDate.getDay()],
		// 		m_name: months[currDate.getMonth()]
		// 	});
		//   currDate.setDate(new Date(currDate).getDate() + 1);
		// }

		await app.listen(port);

		console.log('');
		console.log('Connection established...');
		console.log('Server is running on port: ' + port);
	} catch (err) {
		console.log(err);
	}
})();

app.use((req, res, next) => {
	res.status(200).json({
		pageTitle: 'Index',
		path: '/',
	});
});

app.use((req, res, next) => {
	res.status(404).json({
		pageTitle: 'Page Not Found!',
		path: '/404'
	});
});

app.use((error, req, res, next) => {
	res.status(error.status || 500).json({
		pageTitle: 'Server Error!',
		path: '/500'
	});
});
