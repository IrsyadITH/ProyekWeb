import Ruangan from "../models/roomModel.js";
import path  from "path";
import fs from "fs";

export const getRoom = async(req, res) =>{
    try{
        const response = await Ruangan.findAll();
        res.status(200).json(response);
    } catch(error) {
        console.log(error.message);
    }
}

export const getRoomById = async(req, res) =>{
    try{
        const response = await Ruangan.findOne({
            where:{
                id:req.params.id 
            }
        });
        res.status(200).json(response);
    } catch(error) {
        console.log(error.message);
    }
}

export const addRoom = async (req, res) => {
    try {
        const { kodeRuangan } = req.body;

        const existingRoom = await Ruangan.findOne({ where: { kodeRuangan } });
        if (existingRoom) {
            return res.status(400).json({ msg: "Kode ruangan telah digunakan" });
        }

        console.log("req.files:", req.files);
        console.log("req.body:", req.body);

        if (!req.files || !req.files.file) {
            return res.status(400).json({ msg: "No file uploaded" });
        }
        // const name = req.body.title;
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = file.md5 + ext;
        const url = `${req.protocol}://${req.get("host")}/image/${fileName}`;
        const allowedType = ['.png','.jpg','.jpeg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "invalid image"});
        if(fileSize > 5000000) return res.status(422).json({msg: "maksimal 5 MB"});

        file.mv(`./public/image/${fileName}`, async(err)=>{
            if(err) return res.status(500).json({msg: err.message});
            try{
                await Ruangan.create({kodeRuangan: req.body.kodeRuangan,
                    kapasitas: req.body.kapasitas,
                    aksesInternet: req.body.aksesInternet,
                    fasilitas: req.body.fasilitas,
                    image: fileName,
                    url: url});
            } catch (error){
                 console.log(error.message); 
            }
        })

        res.status(201).json({ msg: "Room Added" });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Server error" });
    }
};


export const updateRoom = async (req, res) => {
  try {
    const ruangan = await Ruangan.findOne({
      where: { id: req.params.id }
    });

    if (!ruangan) return res.status(404).json({ msg: "NO data" });

    let fileName = "";
    if (!req.files || !req.files.file) {
      fileName = ruangan.image;
    } else {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      fileName = file.md5 + ext;
      const allowedType = ['.png', '.jpg', '.jpeg'];

      if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "invalid image" });
      if (fileSize > 5000000) return res.status(422).json({ msg: "maksimal 5 MB" });

      const filePath = `./public/image/${ruangan.image}`;
      fs.unlinkSync(filePath);

      file.mv(`./public/image/${fileName}`, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
    }

    const url = `${req.protocol}://${req.get("host")}/image/${fileName}`;

    await Ruangan.update({
      kodeRuangan: req.body.kodeRuangan,
      kapasitas: req.body.kapasitas,
      aksesInternet: req.body.aksesInternet,
      fasilitas: req.body.fasilitas,
      image: fileName,
      url: url
    }, {
      where: { id: req.params.id }
    });

    res.status(200).json({ msg: "Room Updated" });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error" });
  }
}


export const deleteRoom = async(req, res) =>{
    const ruangan = await Ruangan.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!ruangan) return res.status(404).json({msg: "NO data"})
    try{
        const filePath = `./public/image/${ruangan.image}`;
        fs.unlinkSync(filePath);
        await Ruangan.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Room Deleted"});
    } catch(error) {
        console.log(error.message);
    }

    
}

// Fungsi BARU untuk mengambil hanya kode ruangan unik
export const getUniqueRoomCodes = async (req, res) => {
  try {
    const rooms = await Ruangan.findAll({
      attributes: ['kodeRuangan'], // Hanya ambil kolom kodeRuangan
      group: ['kodeRuangan']      // Pastikan hasilnya unik
    });
    const roomCodes = rooms.map(room => room.kodeRuangan); // Ekstrak hanya string kode ruangan
    res.status(200).json(roomCodes);
  } catch (error) {
    console.error('Error fetching unique room codes:', error.message);
    res.status(500).json({ msg: "Gagal mengambil daftar kode ruangan unik." });
  }
}