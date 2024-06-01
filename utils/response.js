const sendResponse = (res, message, data = {}) => {
  res.status(200).json({
    success: true,
    message,
    data,
  });
};

export default sendResponse;
