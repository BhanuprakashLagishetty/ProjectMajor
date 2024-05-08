const mongoose=require("mongoose")
const AdminSchema=new mongoose.Schema({
    database:{
        type:String,
        require:true,
    },
    question:{
        type:String,
        require:true
    },
    answer:{
        type:String,
        require:true
    },
    difficulty:{
        type:String
    }
},{timestamps:true});
module.exports=mongoose.model("AdminQuestions",AdminSchema)