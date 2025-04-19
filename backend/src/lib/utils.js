import jwt from "jsonwebtoken"

export const generateToken = (userId,res)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d" // expiration of login or sign up 7 days
    })

    res.cookie("jwt",token,{
        maxAge: 7*24*60*60*1000, //MS
        httpOnly:true, // prevent XSS attacks cross-site scripting attacks
        sameSite:"strict", //CSRF attacks cross-site request forgeory attacks
        secure:process.env.NODE_ENV !== "development",

    })

    return token
}