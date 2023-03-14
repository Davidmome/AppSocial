const format = require("date-fns/format");

module.exports = {
  dateFormat: (date) => {
    return format(date, "MMM do, yyyy 'at' hh:mm aaaa");
  },
};
