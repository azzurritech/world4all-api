const dateToUTC = (date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000);

module.exports = { dateToUTC };
