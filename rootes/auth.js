const router =require("express").Router();
const res = require("express/lib/response");
const User= require("../models/User");
//register
const bcrypt = require('bcrypt');
router.post("/register",async (req,res)=>{
  try{
    const salt = await bcrypt.genSalt(10);
    const {username, email,password} = req.body;

    if(!username || !email || !password) {
      return res.status(400).json('All fields are required');
    }

    const temp = await User.findOne({username: username});
    const tempemail=await User.findOne({email: email});
    // const temppass=await User.findOne({password: password});
    if(temp){
      return res.status(400).json('Username is taken!');
    }
    if(tempemail)
    {
      return res.status(400).json('email is taken!');
    }
   
    const hashedPass=await bcrypt.hash(req.body.password, salt);
    const newUser=new User(
    {
        username:username,
        email:email,
        password:hashedPass
    }
    )
    
    const user=await newUser.save();
    res.status(200).json(user)
  }
  catch(err)
  {
    console.log(err);
  }
})
//Login
router.post("/login",async (req,res)=>{
  try{
    const user= await User.findOne({username:req.body.username})
    if(user)
    {
      const validate=await bcrypt.compare(req.body.password, user.password); 
      console.log(req.body.username);
      console.log(req.body.password);
      console.log(validate);

      if(validate)
      {
    
        return res.status(200).json(user)

      }
      else
      {

        return res.status(400).json("Password incorrect credentials")
      }
      
    }
    else
    {

     return  res.status(400).json("Username is incorrect credentials")
    }
    
  }
  catch(err)
  {
    return res.status(200).json("err");
  }
})
module.exports=router