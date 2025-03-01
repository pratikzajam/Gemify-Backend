import express from 'express';
const router = express.Router();
import {signup,login,addProfile,getProfile,getYogaPostById,updateProfile} from '../controllers/controller.js'
import upload from '../middleware/fileUpload.js'

router.post('/signup', signup);
router.post('/login', login);
router.get('/getprofile', getProfile);
router.put('/updateprofile', upload.single('image'), updateProfile);
router.get('/getyogapose', getYogaPostById);
router.post('/addProfile', upload.single('image'), addProfile);





export default router;