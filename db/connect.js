const mongoose = require("mongoose");


const connectDB = () => {
    //#----MongoDB Local Connection----//
    return mongoose.connect("mongodb://127.0.0.1:27017/laundryDB", { useNewUrlParser: true}, mongoose.set('strictQuery', false))
    .then(() => {
        console.log("Local Database Connected");
    })
    .catch((error) => {
        console.log(error);
    })

    //! One needs to be commented when another one is active.

    //#----MongoDB ATLAS Connection----//
    // return mongoose.connect(process.env.ATLAS_URL, { useNewUrlParser: true}, {useUnifiedTopology: true}, mongoose.set('strictQuery', false))
    // .then(() => {
    //     console.log("Atlas Database Connected");
    // })
    // .catch((error) => {
    //     console.log(error);
    // })
}

module.exports = connectDB;