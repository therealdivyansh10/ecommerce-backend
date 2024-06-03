const mongoose = require('mongoose')
const mailSender = require('../utils/nodemailer')
const resetPasswordOtp = require('../templates/resetPasswordToken')
const verificationOTP = require('../templates/emailVerification') // Import the verificationOTP function

const otpSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['reset', 'signIn'],
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 300, // 5 minutes (in seconds)
    default: Date.now,
  },
})

// async function sendOTP(email, otp, type) {
//   try {
//     let emailTitle, emailContent
//     if (type === 'reset') {
//       emailTitle = 'Password Reset OTP'
//       emailContent = resetPasswordOtp(otp)
//     } else if (type === 'signIn') {
//       emailTitle = 'Sign In OTP'
//       emailContent = verificationOTP(otp)
//     }

//     await mailSender(email, emailTitle, emailContent)
//     console.log('Email sent successfully to:', email)
//   } catch (error) {
//     console.error('Error occurred while sending OTP email:', error)
//   }
// }

// otpSchema.post('save', async function() {
//   console.log('New OTP document saved to database')

//   await sendOTP(this.email, this.otp, this.type)
// })

otpSchema.post("save", async function () {
  console.log("New OTP document saved to database");

  // Send verification email after OTP document is saved
  try {
    const emailTitle = "Sign up OTP";
    await mailSender(this.email, emailTitle, verificationOTP(this.otp));
    console.log("Email sent successfully to:", this.email);
  } catch (error) {
    console.error("Error occurred while sending verification email:", error);
  }
});

module.exports = mongoose.model('OTP', otpSchema)
