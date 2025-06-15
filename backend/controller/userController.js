import User from "../models/userModel.js";
import bcrypt from 'bcrypt';
import { Op } from 'sequelize'; 

export const getUsers = async(req, res) =>{
    try{
        const response = await User.findAll();
        res.status(200).json(response);
    } catch(error) {
        console.log(error.message);
    }
}

export const getUsersById = async(req, res) =>{
    try{
        const response = await User.findOne({
            where:{
                id:req.params.id
            }
        });
        res.status(200).json(response);
    } catch(error) {
        console.log(error.message);
    }
}

export const createUser = async (req, res) => {
  const { email, username, password, status, prodi, jurusan } = req.body;

  try {
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ msg: "Email sudah terdaftar" });
    }

    const existingUsername = await User.findOne({
      where: {
        username,
        status
      }
    });

    if (existingUsername) {
      return res.status(400).json({ msg: "Username sudah digunakan untuk status yang sama" });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    await User.create({
      email,
      username,
      password: hashPassword,
      status,
      prodi,
      jurusan
    });

    res.status(201).json({ msg: "User Created" });

    console.log("Password sebelum hash:", password);
    console.log("Password setelah hash:", hashPassword);
    console.log("Password dari client (clean):", `"${password}"`);

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};



export const updateUser = async (req, res) => {
  const { email, username, status } = req.body;
  const userId = req.params.id;

  try {
    if (email) {
      const existingEmail = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: userId }
        }
      });

      if (existingEmail) {
        return res.status(400).json({ msg: "Email sudah digunakan oleh user lain" });
      }
    }

    if (username && status) {
      const existingUsername = await User.findOne({
        where: {
          username,
          status,
          id: { [Op.ne]: userId }
        }
      });

      if (existingUsername) {
        return res.status(400).json({ msg: "Username sudah digunakan untuk status yang sama oleh user lain" });
      }
    }

    await User.update(req.body, {
      where: {
        id: userId
      }
    });

    res.status(200).json({ msg: "User Updated" });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Terjadi kesalahan saat mengupdate user" });
  }
};


export const deleteUser = async(req, res) =>{
    try{
        await User.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "User Deleted"});
    } catch(error) {
        console.log(error.message);
    }
}