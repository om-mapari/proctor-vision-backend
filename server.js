const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const uniqueId = require("uniqid");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();
var interval = 5000;


app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(express.static("./public"));


/*  Configuring cloudinary */
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
    secure: true,
});
// console.log(cloudinary.config());


/*  route to set new value for interval  */
app.get("/set_interval", (req, res) => {
    interval = req.query.interval*1000;
    console.log('interval setted to ' + interval);
    res.send({ success: true }).status(200).end();
});

/*  route for new user post  */
app.post("/data", async (req, res) => {
    try {
        const id = uniqueId.time();

        const { firstName, lastName, email, testInvitation } = req.body;
        console.log(req.body);
        // updating data
        let data = await fs.readFileSync("./db/data.json", "utf-8"); // readFile
        console.log(data);

        data = JSON.parse(data);
        data.push({
            firstName,
            lastName,
            email,
            testInvitation,
            id,
            images: [],
        });
        await fs.writeFileSync("./db/data.json", JSON.stringify(data)); // writeFile
        // send userid to the extension
        res.send({ userid: id }).status(200).end();
    } catch {
        // if error is occured
        res.send({ error: "Something went wrong" }).status(500).end();
    }
});

/* route for storing images */
// app.post("/upload-image", (req, res) => {

//     const imageData = req.body.image;
//     const userid = req.body.userid;

    
//     const imageBuffer = Buffer.from(imageData.split(",")[1], "base64");
//     const timestamp = new Date().getTime(); // timestamp
//     const fileName = `public/imageCollection/image-${timestamp}.png`;


//     fs.writeFile(fileName, imageBuffer, (err) => {
//         if (err) {
//             console.error(err);
//             res.status(500).send("Failed to save image");
//         } else {
//             console.log(`Image saved as ${fileName}`);

            

//             // multiface recog
//             res.json({interval}).status(200).end();
//         }
//     });
//     // res.json({interval}).status(200).end();
// });



app.post("/upload-image", (req, res) => {

    const imageData = req.body.image;
    const userid = req.body.userid;

    
    const imageBuffer = Buffer.from(imageData.split(",")[1], "base64");
    const timestamp = new Date().getTime(); // timestamp
    const fileName = `public/imageCollection/image-${timestamp}.png`;


    fs.writeFile(fileName, imageBuffer, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Failed to save image");
        } else {
            console.log(`Image saved as ${fileName}`);

            
            // multiface recog
            res.json({interval}).status(200).end();
        }
    });
    // res.json({interval}).status(200).end();
});




/*  route to get all users data */
app.get("/retrieve-data", async (_req, res) => {
    let data = await fs.readFileSync("./db/data.json", "utf-8"); // readFile
    data = JSON.parse(data);

    res.json(data).status(200).end();
});

/*  route to get all images in local storage */
app.get("/get-images", (req, res) => {
    fs.readdir("./public/imageCollection", (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send("Failed to list images");
        } else {
            const images = files.filter((file) => file.startsWith("image-"));
            res.send(images);
        }
    });
});


/*  route to get single image */
// app.get("/get-image/:image", (req, res) => { // image-1678347645756.png
//     const image = req.params.image;
//     res.sendFile(
//         image,
//         { root: __dirname + "/public/imageCollection" },
//         (err) => {
//             if (err) {
//                 console.error(err);
//                 res.status(404).send("Image not found");
//             }
//         }
//     );
// });

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});