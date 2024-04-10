const express=require('express')
const User=require("../Models/userSchema")
const bcrypt=require("bcryptjs")
const jwt =require("jsonwebtoken")
const router=express.Router()
router.use(express.json());
const middleware=require("../Middleware/UserAuthenticate")
 router.post("/adduser",async(req,res)=>{
const{name,email,password}=req.body;
if(!name)
{
   return res.json({message:"Please Enter Name"})
}
if(!email){
    return res.json({message:"Please Enter Email"})
}
if(!password){
    return res.json({message:"Please Enter Password"})
}

try{
const findifUserisAlreadyPresent=await User.findOne({email:email})
if(findifUserisAlreadyPresent){
    return res.json("User Email Already Exists!")
}

bcrypt.hash(req.body.password,10,async(err,hash)=>{
    if(err){
        return res.json({err:err})
    }
    else{
        const userss=new User({
            name:req.body.name,
            email:req.body.email,
            password:hash
        })
        const saveuser= await userss.save()
        if(saveuser){
            return res.json({message:"User Registered Successfully Please Login!"})
        }
    }
})

}
catch(err){
    return res.json({message:err})
}
 })
 router.post("/loginUser",async(req,res)=>{
const{email,password}=req.body
console.log(email)
console.log(password)
try{
    if(email==''){
return res.json({message:"Email is Empty!"})
    }
    if(password==''){
        return res.json({message:'Password is Empty!'})
    }
    const getEmail=await User.findOne({email:email})
    if(!getEmail){
        return res.json({message:"User is Not Registered!"})
    }
    const passwordMatch=bcrypt.compare(req.body.password,getEmail.password)
    if(!passwordMatch){
        return res.json({message:"Passwords Doesn't Match"})
    }
    const AccessToken=jwt.sign({username:getEmail.name,email:getEmail.email},process.env.SECRETKEY,{
        expiresIn:"1m"
    })
    const RefreshToken=jwt.sign({username:getEmail.name,email:getEmail.email},process.env.SECRETKEY,{
        expiresIn:"7d"
    })
    return res.json({
        message:"User Logged In SuccessFully",
        accessToken:AccessToken,
        refreshToken:RefreshToken
    })
}
catch(e){
    console.log(e)
}
 })

 router.post("/getaccesstoken",async(req,res)=>{
     const token=req.body.refreshToken
     try{
        if(!token){
            return res.json({message:"Token is Required!"})
        }
        const verifytoken=jwt.verify(token,process.env.SECRETKEY)
        const findEmailonDb= await User.findOne({email:verifytoken.email})
        if(!findEmailonDb)
        {
            return res.json({message:"Invalid Token!"})
        }
        const AccessToken=jwt.sign({username:findEmailonDb.name,email:findEmailonDb.email},process.env.SECRETKEY,{
            expiresIn:"1h"
        })
        return res.json({
            message:"User Logged In SuccessFully",
            accessToken:AccessToken,
        })
     }
     catch(e){
         return res.json({message:e})
     }
   
 })

 router.get("/getalluser", middleware,async(req,res)=>{
try{
const userDetails=await User.find()
return res.json({message:userDetails})
}
catch(e){
    return res.json({message:e})
}
 })
 module.exports=router;