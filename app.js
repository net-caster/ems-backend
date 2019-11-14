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
const moment = require('moment');

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

app.use(
	cors({
		origin: process.env.URL,
		credentials: true
	})
);

Employee.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Employee);
WorkDay.belongsTo(Employee, { constraints: true, onDelete: 'CASCADE' });
Employee.hasMany(WorkDay);
WorkDay.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(WorkDay);

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', process.env.URL);
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
		return res.status(200).json({});
	}
	next();
});

app.use(userRoutes);

(async () => {
	try {
		// await sequelize.sync({ force: true });

		await sequelize.sync();

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
		path: '/'
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
