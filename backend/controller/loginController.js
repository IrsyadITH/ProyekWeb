import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET; 

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ msg: 'Password salah' });

    // Buat token
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, status: user.status },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      msg: 'Login berhasil',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
