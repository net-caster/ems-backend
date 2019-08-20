module.exports = (name, payRate) => {
	const regexName = /^([a-z-'.]+\s?)+$/gi;
	const regexPay = /^([0-9]*|\d*\.\d{1}?\d{0,1})$/;

	if (name && regexName.test(name) && name.length >= 2 && payRate && payRate !== '0' && regexPay.test(payRate)) {
		return true;
	}
};
