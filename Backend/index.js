const express = require ("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require('./routes/authRoutes');

const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json()); //parse the json req
app.use("/api/auth", authRoutes);




mongoose.connect(process.env.MONGO_URL)
.then(() => {
    app.listen(5000, () => {
        console.log("Server is running on port 5000");
    });
}).catch((err) =>console.error('MongoDB connection error:', err));











