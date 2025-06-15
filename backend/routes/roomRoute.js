import express from "express";
import { getRoom, 
    getRoomById,
    addRoom,
    updateRoom,
    deleteRoom,
    getUniqueRoomCodes
} from "../controller/roomController.js"


const router = express.Router();

router.get('/ruangan', getRoom)
router.get('/ruangan/:id', getRoomById)
router.post('/ruangan' , addRoom)
router.patch('/ruangan/:id' , updateRoom)
router.delete('/ruangan/:id' , deleteRoom)

router.get('/rooms/codes', getUniqueRoomCodes);

export default router;