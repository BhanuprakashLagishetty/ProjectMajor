const router=require("express").Router();
const AdminQuestions=require('../models/Admin');


// send the dabase name question and answer to the database
router.post("/",async(req,res)=>{
    try{
        const newAdmin=new AdminQuestions(req.body);
        const savedAdmin=await newAdmin.save();
        return res.status(200).json(savedAdmin);
    }
    catch(err)
    {
        return res.status(400).json("un able to send data");
    }
})

// getting the all the question and answer form the database;

router.get("/",async (req,res) =>{
    try{
        let posts;
        posts =await AdminQuestions.find();
        return res.status(200).json(posts);
    }
    catch(err){
        return res.status(400).json("data not found");
    }
})



module.exports=router;