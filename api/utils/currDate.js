Date.prototype.getWeekNumber = (year, month, day) => {
	let d = new Date(Date.UTC(year, month, day));
	let dayNum = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - dayNum);
	let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

const Dates = {
	day: new Date().getDate(),
	month: new Date().getMonth(),
	year: new Date().getFullYear(),
	week: new Date().getWeekNumber(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
};

module.exports = Dates;
