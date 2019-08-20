module.exports = (values) => {

	const regexName = /^([a-z-'.]+\s?)+$/gi;
	const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

	if (values.name && regexName.test(values.name) && values.name.length >= 2 && values.email && regexEmail.test(values.email) && values.password && values.confirmPassword && values.password.length >= 8 && values.confirmPassword === values.password) {
		return true;
	}
};
