const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bodyParser = require('body-parser');
const env=require("dotenv")
const port=8080;
const app=express()
app.use(express.urlencoded({
    extended:true,
  }))
env.config()
const user=require("./Routes/User")
const Db='mongodb+srv://Shivam:0XybYaY4YsmjvMaL@cluster0.oysfx.mongodb.net/test';
app.use(cors({
    origin:['http://localhost:3000'],
    credentials:true
}))

app.use("/user",user)
app.use(express.json())
mongoose.connect(Db).then(res=>{
console.log("Connected TO DB Successfully!")
}).catch(err=>{
    console.log("Error Occured")
})
app.listen(port,()=>{
    console.log(`App is Running on Port : ${port}`)
})