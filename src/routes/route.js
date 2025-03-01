import express from 'express';
const router = express.Router();
import {signup,login,addProfile} from '../controllers/controller.js'
import upload from '../middleware/fileUpload.js'

router.post('/signup', signup);
router.post('/login', login);
router.post('/addProfile', upload.single('image'), addProfile);





export default router;