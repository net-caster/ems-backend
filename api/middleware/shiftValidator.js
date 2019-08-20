module.exports = (values) => {

  if (values.employeeId && values.date && values.shiftHours > 0 && values.shiftWage) {
    return true;
  }
}
