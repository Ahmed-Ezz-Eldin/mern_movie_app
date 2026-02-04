import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400);
      throw new Error('Email already exists');
    }

    const user = await User.create({
      username,
      email,
      password, // Hashing happens in the Model pre-save now!
      imgProfile: req.file ? req.file.path.replace(/\\/g, '/') : '',
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      imgProfile: user.imgProfile,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    next(error); // Passes to global error handler
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Use .select('+password') if you decide to hide it by default in schema
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        imgProfile: user.imgProfile,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};
