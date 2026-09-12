const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "studyai_default_secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, studyFocus } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide full name, email, and password.",
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists. Please sign in instead.",
      });
    }

    // Create user
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password,
      studyFocus: studyFocus || "Computer Science",
      provider: "local",
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Account registered successfully!",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        studyFocus: user.studyFocus,
        provider: user.provider,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error during registration.",
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. No account found with that email.",
      });
    }

    // If registered with Google only without password
    if (user.provider === "google" && !user.password) {
      return res.status(400).json({
        success: false,
        message: "This account was registered using Google. Please click 'Continue with Google'.",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        studyFocus: user.studyFocus,
        provider: user.provider,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error during login.",
    });
  }
};

// @desc    Google OAuth Sign-In / Sign-Up
// @route   POST /api/auth/google
// @access  Public
exports.googleAuth = async (req, res) => {
  try {
    const { token: idToken, email, name, picture, googleId } = req.body;

    let userEmail = email;
    let userName = name;
    let userAvatar = picture || "";
    let userGoogleId = googleId;

    // If an ID token was passed from Google OAuth SDK and GOOGLE_CLIENT_ID is configured
    if (idToken && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== "your_google_client_id_here") {
      try {
        const ticket = await client.verifyIdToken({
          idToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        userEmail = payload.email;
        userName = payload.name;
        userAvatar = payload.picture;
        userGoogleId = payload.sub;
      } catch (verifyError) {
        console.warn("Google token verification warning:", verifyError.message);
      }
    }

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "Google authentication failed: Email is required.",
      });
    }

    // Find or create user
    let user = await User.findOne({ email: userEmail.toLowerCase() });

    if (!user) {
      user = await User.create({
        fullName: userName || userEmail.split("@")[0],
        email: userEmail.toLowerCase(),
        googleId: userGoogleId,
        avatar: userAvatar,
        provider: "google",
        studyFocus: "Computer Science",
      });
    } else {
      // Update Google metadata if missing
      if (!user.googleId && userGoogleId) {
        user.googleId = userGoogleId;
        if (!user.avatar && userAvatar) user.avatar = userAvatar;
        await user.save();
      }
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Google authentication successful!",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        studyFocus: user.studyFocus,
        provider: user.provider,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error during Google authentication.",
    });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
