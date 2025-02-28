import express from 'express';
import 'dotenv/config'
import routes from './src/routes/route.js'
import connectDB from './dbConnection.js';
import cors from 'cors'
import path from 'path';

const app = express();
app.use(cors())
const PORT = process.env.PORT || 3000;

const uploadPath = path.join(process.cwd(), 'src', 'uploads');
app.use('/uploads', express.static(uploadPath));

app.use(express.json());
app.use('/', routes);


connectDB()

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});