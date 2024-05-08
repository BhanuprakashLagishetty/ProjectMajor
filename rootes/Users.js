const router =require("express").Router();
const res = require("express/lib/response");
const User=require("../models/User")
const Post=require("../models/Post")
//Update
const bcrypt = require('bcrypt');
router.put("/:id",async (req,res)=>{
    if(req.body.userId === req.params.id)
    {
        if(req.body.password)
        {
            const salt= await bcrypt.genSalt(10);
            req.body.password=await bcrypt.hash(req.body.password,salt);
        }
        try{
            const updateUser= await User.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            },{new:true})
            return res.status(200).json(updateUser);
        }
        catch (err){
            res.status(500).json(err);
        }
    }
    else
    {
        res.status(401).json("you can update only your account");
    }
  
})
 

//DELETE
router.delete("/:id",async (req,res)=>{
    if(req.body.userId === req.params.id)
    {
        try{
            const user=await User.findById(req.params.id);
            try{
                await Post.deleteMany({username:user.username})
                await User.findByIdAndDelete(req.params.id)
                 return res.status(200).json("deleted succesfully");
             }
             catch (err){
                 res.status(500).json(err);
             }
        }
        catch(err)
        {
            return res.status(404).json("USER is not found");
        }
        
      
    }
    else
    {
        res.status(401).json("you can Delete only your account");
    }
  
})
//Get userdata
router.get("/:id",async(req,res)=>{
    try{
        const user= await User.findById(req.params.id)
        const {password,...others } =user._doc;
        res.status(200).json(others);
    }
    catch(err)
    {
        return res.status(404).json("user is not found");
    }
})


module.exports=router