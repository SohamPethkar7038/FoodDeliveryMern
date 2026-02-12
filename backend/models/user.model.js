import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    },
    verifyOtp:{
        type:String,
        default:"",
        select:false,
    },
    verifyOtpExpiredAt:{
        type:Date,
        default:0,
        // required:true,
        select:false,
    },
    isAccountVerified:{
        type:Boolean,
        default:false,

    },
    resetOtp:{
        type:String,
        default: "",
        select:false
    },
    resetOtpExpiredAt:{
        type:Date,
        default:0,
        select:false
    },
    passwordResetRequestAt:{
        type:Number,
        select:false
    },
    refreshToken:{
        type:String,
        select:false
    },
    cartData : {
        type : Map,
        of : Number,
        default : {} 
    }
},
{
    timestamps:true,
});

userSchema.pre("save",async function(){
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password,10);
});


userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
        },

        process.env.ACCESS_TOKEN_SECRET,

        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
};



userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id,
        },

        process.env.REFRESH_TOKEN_SECRET,

        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const userModel = mongoose.models.user || mongoose.model("User",userSchema);
export default userModel;
