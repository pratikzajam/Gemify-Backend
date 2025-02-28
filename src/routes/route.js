import express from 'express';
const router = express.Router();
import {signup,login,addProperty,getProperties,getStats,deleteProperty} from '../controllers/controller.js'
import upload from '../middleware/fileUpload.js'

router.post('/signup', signup);
router.post('/login', login);
router.post('/addProperty', upload.single('image'), addProperty);
router.get('/getProperties', getProperties);
router.get('/getstats', getStats);
router.delete("/deleteProperty/:id", deleteProperty);


export default router;