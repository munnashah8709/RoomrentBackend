const mongose=require("mongoose")

const signupdata=new mongose.Schema({
        username: String,
        email: String,
        contact: String,
        password: String,
});


const userregistration= new mongose.model("userregistration",signupdata);
module.exports=userregistration;