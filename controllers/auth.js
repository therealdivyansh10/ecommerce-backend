const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const { ApiError } = require('../utils/ApiError')
const bcrypt = require('bcrypt')
const { ApiResponse } = require('../utils/ApiResponse')
require('dotenv').config()
const Address = require('../models/address.model')
const otpGenerator = require('otp-generator')
const OTP = require('../models/otp.model')

exports.signupController = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      role,
      city,
      state,
      street,
      country,
      postal,
      otp,
    } = req.body

    const address = await Address.create({
      street,
      state,
      country,
      city,
      postalCode: postal,
    })

    // check if these values are null or not
    if (
      [name, email, password, confirmPassword, otp].some(value => value === '')
    ) {
      return res.json(
        new ApiResponse(400, null, 'All fields except role are required'),
      )
    }

    // Check if user exists
    const user = await User.findOne({ email })
    if (user) {
      return res.json(new ApiResponse(400, null, 'User is already registered'))
    }

    // geting the corresponding otp from database
    const savedOtp = await OTP.findOne({ email: email }).sort({
      createdAt: -1
    })
    console.log(savedOtp)

    // if no otp send error
    if (!savedOtp) {
      return res.json(
        new ApiResponse(400, null, 'No OTP found for the provided email'),
      )
    }

    if (otp !== savedOtp.otp) {
      return res.json(new ApiResponse(400, null, 'OTP doesnt match.'))
    }

    if (password.length === 0) {
      return res.json(new ApiResponse(400, null, 'Password cannot be empty'))
    }

    if (confirmPassword !== password) {
      return res.json(
        new ApiResponse(
          400,
          null,
          'Your password and confirmed password do not match',
        ),
      )
    }

    // creating a sescure password
    const securePassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({
      name,
      email,
      role,
      password: securePassword,
      address: address._id,
    })
    return res.json(
      new ApiResponse(200, newUser, 'User registered successfully'),
    )
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message))
  }
}

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })

    const newOtp = await OTP.create({
      email,
      otp,
      type:"signIn"
    })

    return res.json(new ApiResponse(200, newOtp, 'successfully created'))
  } catch (error) {
    return res.json(new ApiResponse(500, null, error.message))
  }
}

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.json(
        new ApiResponse(400, null, 'Both the fields are required'),
      )
    }

    // if user isnt registered in throw error
    const user = await User.findOne({ email })
    if (!user) {
      return res.json(new ApiResponse(400, null, 'User not registered'))
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.json(
        new ApiResponse(400, null, 'Your login credentials were incorrect.'),
      )
    }

    console.log(user._id, user.role)

    const payload = {
      id: user._id,
      role: user.role,
    }

    // creating accesstoken and refreshToken
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })

    req.body.token = accessToken
    user.password = null
    const userWithAccessToken = { ...user, accessToken: accessToken }

    res.cookie('accessToken', accessToken, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    })

    return res.json(
      new ApiResponse(200, userWithAccessToken, 'Logged in successfully'),
    )
  } catch (error) {
    return res.json(new ApiResponse(400, null, error.message))
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    const { email, password, confirmNewPassword, newPassword } = req.body

    if (
      [email, password, confirmNewPassword, newPassword].some(value => {
        value === ''
      })
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      })
    }

    // check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "User  with this email does'nt exist",
      })
    }

    if (confirmNewPassword !== newPassword) {
      return res.json(
        new ApiResponse(400, null, 'both passwords does not match'),
      )
    }
    if (bcrypt.compare(password, user.password)) {
      const encryptedPassword = await bcrypt.hash(newPassword, 10)
      user.password = encryptedPassword
      user.save()
    }

    res.json(new ApiResponse(200, user, 'password reset successful'))
  } catch (error) {
    return res.json(new ApiResponse(500, null, error.message))
  }
}

exports.getResetPasswordToken = async (req, res) => {
  try {
    // get email  and genereate a new otp and insert it to otp model
    const { email } = req.body
    if (email === "") {
      return res.json(new ApiResponse(400, null, 'Email must be provided'))
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })

    const newOtp = await OTP.create({
      email,
      type: 'reset',
      otp,
    })
  } catch (error) {
    return res.json(new ApiResponse(400, null, error.message))
  }
}

exports.resetPasswordByToken = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmNewPassword } = req.body
    const savedOTP = await OTP.findOne({ email }).otp

    const user = await User.findOne({ email })
    if (!user) {
      return res.json(
        new ApiResponse(400, null, 'User with this email doesnt exist'),
      )
    }

    if (!savedOTP) {
      return res.json(new ApiResponse(400, null, 'Please get otp first.'))
    }

    // check if otp is correct
    if (savedOTP !== otp) {
      return res.json(new ApiResponse(500, null, 'your otp was incorrect'))
    }

    if (newPassword !== confirmNewPassword) {
      return res.json(new ApiResponse(500, null, 'passwords doesnt match'))
    }

    user.password = newPassword
    user.save()
    return res.json(new ApiResponse(200, null, 'Password succesfully updated'))
  } catch (error) {
    return res.json(new ApiResponse(500, null, error.message))
  }
}

exports.logoutController = async (req, res) => {
  try {
    // Clear the access token cookie
    res.clearCookie('accessToken')

    return res.json(new ApiResponse(200, null, 'User logged out successfully'))
  } catch (error) {
    console.error(error)
    return res.json(new ApiResponse(500, null, error.message))
  }
}

exports.testController = (req, res) => {
  // Assuming you want to send a simple message as a response
  res.json({ message: 'Welcome to the dashboard!' })
}

exports.adminTestController = (req, res) => {
  // Assuming you want to send a simple message as a response
  res.json({ message: 'Welcome to the admin dashboard!' })
}

exports.customerTestController = (req, res) => {
  // Assuming you want to send a simple message as a response
  res.json({ message: 'Welcome to the customer Dashboard!' })
}
