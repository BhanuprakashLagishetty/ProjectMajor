const router =require("express").Router();
const res = require("express/lib/response");
const problemSolved=require("../models/problemSolved")
const Post=require("../models/Post")

router.post("/saveSolvedProblems",async (req,res)=>{
    try{
      const {userId, problemId} = req.body;
  
      if(!userId || !problemId) {
        return res.status(400).json('All fields are required');
      }
      const problem=new problemSolved (
      {
          username:username,
          problemId:problemId,
          
      }
      )
      
      const problemSolved=await problem.save();
      res.status(200).json(user)
    }
    catch(err)
    {
      console.log(err);
    }
  })

module.exports=router