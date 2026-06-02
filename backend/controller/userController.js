const User = require("../models/user.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sendEmail = require("../utils/sendEmail.js")


module.exports.registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({ name, email, password: hashedPassword })
        const otp = Math.floor(100000 + Math.random() * 900000)
        newUser.otp = otp;
        newUser.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min
        const message = `
          Hello ${name},
              
          Welcome to Ebazaar 🛍️
              
          Thank you for creating your account with us. We're excited to have you in our shopping community.
              
          To complete your registration, please verify your email using the OTP below:
              
          Your OTP: ${otp}
              
          This OTP is valid for a limited time.
              
          If you did not request this registration, please ignore this email.
              
          Regards,
          Team Ebazaar
          `;
        await sendEmail(email, "Welcome to Ebazaar - Your OTP for Registration", message)
        
        await newUser.save();
        return res.json({
            error: false,
            message: "User registered successfully",
            user: { id: newUser._id, name: newUser.name, email: newUser.email }
        })
    } catch (err) {
        next(err)
    }
}
module.exports.verifyUser = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found"
            });
        }

        if (user.verified) {
            return res.status(400).json({
                error: true,
                message: "User already verified"
            });
        }

        if (!user.otp || user.otp.toString() !== otp.toString()) {
            return res.status(400).json({
                error: true,
                message: "Invalid OTP"
            });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({
                error: true,
                message: "OTP expired"
            });
        }

        user.verified = true;
        user.otp = undefined;
        user.otpExpires = undefined;

        const accessToken = jwt.sign({ id: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
        const refreshToken = jwt.sign({ id: user._id, email: user.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })

        user.refreshToken = refreshToken;
        await user.save();
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })

        return res.status(200).json({
            error: false,
            message: "User verified successfully",
            accessToken
        });

    } catch (err) {
        next(err);
    }
};

module.exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" })
        }
        if (!user.verified) {
            return res.status(403).json({
                error: true,
                message: "Please verify your email before logging in"
            });
        }
        const accessToken = jwt.sign({ id: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
        const refreshToken = jwt.sign({ id: user._id, email: user.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })
        user.refreshToken = refreshToken
        await user.save()
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })
        return res.json({
            error: false,
            message: "User Logged in successfully",
            accessToken,
            user: { id: user._id, name: user.name, email: user.email }
        })
    } catch (err) {
        next(err)
    }
}

module.exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select("-password -refreshToken")
        if (!users) {
            return res.status(400).json({ message: "User not found" })
        }
        return res.json({
            error: false,
            users
        })
    } catch (err) {
        next(err);
    }
}

module.exports.refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ error: true, message: "Refresh token missing" });

        const user = await User.findOne({ refreshToken });
        if (!user) return res.status(403).json({ error: true, message: "Invalid refresh token" });

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ error: true, message: "Invalid or expired refresh token" });

            const newAccessToken = jwt.sign({ id: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
            return res.json({ error: false, accessToken: newAccessToken });
        });
    } catch (err) { next(err); }
}

module.exports.logoutUser = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const user = await User.findOne({ refreshToken: refreshToken })
            user.refreshToken = "";
            await user.save()
        }
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        })
        return res.json({
            error: false,
            message: "Logged out successfully"
        })
    } catch (err) {
        next(err)
    }
}

module.exports.forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found."
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min

        await user.save();
        await sendEmail(
            user.email,
            "Password Reset OTP",
            `<h3>Your OTP is: ${otp}</h3><p>Valid for 10 minutes</p>`
        );

        return res.status(200).json({
            error: false,
            message: "OTP sent to email"
        });

    } catch (err) {
        next(err);
    }
};

module.exports.verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        return res.status(200).json({
            message: "OTP verified successfully"
        });

    } catch (err) {
        next(err);
    }
};


module.exports.resetPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;
        console.log(email , newPassword)
        const user = await User.findOne({ email });
        console.log(user)

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save();

        return res.status(200).json({
            errro:false,
            message: "Password reset successful"
        });

    } catch (err) {
        next(err);
    }
};

module.exports.getMyInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password -refreshToken -otp -otpExpires");

    res.status(200).json({
      error: false,
      user:{name:user.name , email:user.email , role:user.role}
    });
  } catch (err) {
    next(err);
  }
};

module.exports.resendVerificationOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found"
      });
    }

    if (user.verified) {
      return res.status(400).json({
        error: true,
        message: "User already verified"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail(
      user.email,
      "Verification OTP",
      `Your OTP is ${otp}`
    );

    res.status(200).json({
      error: false,
      message: "OTP resent successfully"
    });

  } catch (err) {
    next(err);
  }
};