const express = require('express');
const mongoose = require('mongoose');
const clc = require('cli-color');
const cors = require('cors');
const adminrouter = require('./routes/adminRoutes');
const employeeRouter = require('./routes/employeeRoutes');
const dotenv = require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 2863;
  
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI_MAIN)
.then(() => console.log(clc.green.underline('Connected to Atlas Database Successfully.')))
.catch(err => console.log(clc.red(` Error while connecting to Database: ${err.message}`)));


app.get('/',(req,res)=>{
  res.status(200).send("<b align='center'>ELMS BACKEND STARTED</b>")
})


app.use("/admin",adminrouter)

app.use("/employee",employeeRouter)

app.get('/*',(req,res)=>{
  res.status(404).send("<b align='center'>No API Found.</b>")
})


app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
