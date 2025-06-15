import express from "express";
import { getUsers, 
    getUsersById,
    createUser,
    updateUser,
    deleteUser
} from "../controller/userController.js";
import { loginUser } from "../controller/loginController.js";
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Rute login & autentikasi
router.post('/login', loginUser);
router.get('/me', verifyToken, (req, res) => {
  res.json({ msg: "Ini data pribadi user", user: req.user });
});

// Rute user lainnya
router.get('/users', getUsers)
router.get('/users/:id', getUsersById)
router.post('/users' , createUser)
router.patch('/users/:id' , updateUser)
router.delete('/users/:id' , deleteUser)

export default router;
