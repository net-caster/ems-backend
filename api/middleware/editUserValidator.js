module.exports = (name, email, password) => {
  const regexName = /^([a-z-'.]+\s?)+$/gi;
	const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

	if (name && regexName.test(name) && name.length >= 2 && email && regexEmail.test(email) && password) {
		return true;
	}
};
