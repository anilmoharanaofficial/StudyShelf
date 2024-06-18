// const sendResponse = (res, message, data = {}) => {
//   res.status(200).json({
//     success: true,
//     message,
//     data,
//   });

//   if (redirectUrl) {
//     response.redirectUrl = redirectUrl;
//   }
// };

const sendResponse = (res, message, data = {}, redirectUrl = null) => {
  const response = {
    success: true,
    message,
    data,
  };

  if (redirectUrl) {
    response.redirectUrl = redirectUrl;
  }

  res.status(200).json(response);
};

export default sendResponse;
