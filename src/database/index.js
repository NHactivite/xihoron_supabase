import mongoose from "mongoose";

export  const ConnectDB=()=>{
    mongoose.connect(process.env.MONGO_URL,{
        dbName:"xihoron_V1",
    }).then(c=>console.log(`database connected ${c.connection.host}`)).catch(e=>console.log(e));
   
};

export default ConnectDB;
