import mongoose, {Schema } from "mongoose";

const userSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            minLength:2,
            maxLength:30
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },

        githubId:{
            type:String,
            required:true,
            unique:true
        },

        coins:{
            type:Number,
            default:0
        },
        level:{
            type:Number,
            default:0
        }
    }, 
    {
        timestamps:true,
    }
);

export const User = mongoose.model("User",userSchema);