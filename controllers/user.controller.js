import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { Otp } from "../models/otp.model.js";
import nodemailer from "nodemailer";
const UserRegister = async (req, res) => {
  try {
    const { fullName, email, userName, password } = req.body;
    if (
      [fullName, email, userName, password].some(
        (item) => item?.trim() === "" || item === undefined || item === null
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ userName }, { email }],
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.email === email
            ? "Email Already Registered"
            : "Username Already Taken",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      userName,
      fullName,
      email,
      password: hashedPassword,
    });

    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Error while registering user",
      });
    }

    return res.status(201).json({
      success: false,
      message: "Registration Successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while registering user",
    });
  }
};

const SendOtpToUserForLogin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email",
      });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "No Such Email Found",
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    // const link = `http://localhost:3000/api/v1/user/enter-otp`;

    const otp = await Otp.updateOne(
      { email },
      { $set: { otp: OTP } },
      { upsert: true }
    );

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Data Not Found",
      });
    }

    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
            background-color: #f9f9f9;
        }
        .header {
            text-align: center;
            background-color: #007bff;
            color: #ffffff;
            padding: 10px;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
        }
        .otp {
            font-size: 20px;
            font-weight: bold;
            color: #007bff;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777777;
            padding: 10px;
            border-top: 1px solid #e0e0e0;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>OTP Verification</h2>
        </div>
        <div class="content">
            <p>Dear User,</p>
            <p>Thank you for using our service. Please use the following One-Time Password (OTP) to complete your verification process:</p>
            <div class="otp">${OTP}</div>
            <p>This OTP is valid for 10 minutes. Do not share this OTP with anyone.</p>
            <p>Best regards,</p>
            <p>Your Company</p>
        </div>
        <div class="footer">
            <p>If you did not request this OTP, please ignore this email or contact support.</p>
        </div>
    </div>
</body>
</html>
`;

    await transporter.sendMail(
      {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Your OTP Verification Code",
        html: htmlContent,
      },
      (error, info) => {
        if (error) {
          return console.log(error);
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: "Otp Sent Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.code === 11000
          ? "Please wait for 2 minutes to send another otp"
          : "Error in logging",
    });
  }
};

const verifyUserOTP = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while verifying otp",
    });
  }
};
export { UserRegister, SendOtpToUserForLogin };
