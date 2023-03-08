module.exports = {
  successWithData(data, res) {
    return res.json({
      status: true,
      data,
    });
  },
  customError(message, res) {
    return res.status(422).json({
      status: false,
      msg: message,
    });
  },
};
