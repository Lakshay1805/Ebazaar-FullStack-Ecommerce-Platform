const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: true, message: "Internal Server Error" });
};
module.exports = errorHandler ;