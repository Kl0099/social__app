const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    caption:String,
    image: {
        url: {
            type : String,
            default : "https://images.unsplash.com/photo-1695718948137-1f4d1d5ba889?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        },
        public_id:String,
       
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    
     createdAt:{
            type:Date,
            default:Date.now()
        },
    likes: [
            
                {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : "User",
                },
            
        ],
    comments:[
            {
                user:{
                    type : mongoose.Schema.Types.ObjectId,
                    ref : "User",
                },
                comment:{
                    type : String,
                    required: true,
                },
                createdAt:{
                    type:Date,
                    default:Date.now()
                },
            },
        ]
    
})

module.exports = mongoose.model("Post", postSchema);