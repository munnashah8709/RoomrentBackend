const mongose=require("mongoose")

const signupdata=new mongose.Schema({
        username: String,
        email: String,
        password: String,
        contact: String,
        DateOfBirth: Date,
        AlternetPhone: String,
        FatherName: String,
        MotherName: String,
        PanNumber: String,
        PanImage: String,
        VotercardImage: String,
        AadharNumber: String,
        AadharImage: String,
        profilePik: String
    
});




const userregistration= new mongose.model("userregistration",signupdata);
module.exports=userregistration;