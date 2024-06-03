const resetPasswordOtp = otp => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SNITCH - OTP</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          text-align: center;
          color: #007bff;
          margin-bottom: 20px;
        }
        p {
          margin-bottom: 20px;
        }
        .otp {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          padding: 10px;
          background-color: #f8f8f8;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to SNITCH!</h1>
        <p>Your reset password OTP is here</p>
        <p>Please use this OTP to complete your reset password process:</p>
        <div class="otp">${otp}</div>
        <p>Regards,<br>Team SNITCH</p>
      </div>
    </body>
    </html>
  `;
};

module.exports = resetPasswordOtp;
