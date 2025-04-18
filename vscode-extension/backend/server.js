const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db/db.js');
dotenv.config();
const cors = require('cors');
const authRoutes = require('./routers/authRouter.js');
const app = express();
app.use(express.json());
app.use(cors());
connectDB();
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Redirect URL : " + `http://localhost:${PORT}/`)
});