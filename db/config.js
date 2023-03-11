// const mongoose = require("mongoose");

// exports.connect = () => {
//     mongoose
//         .connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         })
//         .then(() => {
//             console.log("Connected to MongoDB");
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// };

const mongoose = require("mongoose");

const connectDB = (url) => {
    // returns promise
    return mongoose.connect(url, {
        //No More Deprecation Warning Options in Mongoose 6
        //- these are no longer supported options in Mongoose 6 - only use it with old versions
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

module.exports = connectDB;
