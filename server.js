const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
const uniqueId = require("uniqid");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
require("./db/config.js").connect();
const UserDataSchema = require("./models/userdata.js");
const port = process.env.PORT || 3000;

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

/*  route to set new value to interval  */
app.get("/set_interval", (req, res) => {
    interval = req.query.interval * 1000;
    console.log("interval setted to " + interval);
    res.send({ success: true }).status(200).end();
});

/*  route for createting new User */
app.post("/createUser", async (req, res) => {
    try {
        const id = uniqueId.time();

        const { firstName, lastName, email, testInvitation } = req.body;
        console.log(req.body);

        const UserDataSchemaObj = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            testInvitation: testInvitation,
            id: id,
            images: [],
        };

        const data = new UserDataSchema(UserDataSchemaObj);
        await data.save(); // async

        res.send({ userid: id }).status(200).end();
    } catch {
        // if error is occured
        res.send({ error: "Something went wrong" }).status(500).end();
    }
});

/*  route for uploading user images to cloudinary and then storing url to mongoDB */
app.post("/upload-image", (req, res) => {
    const imageData = req.body.image;
    const userid = req.body.userid;

    const timestamp = new Date().getTime(); // timestamp
    const fileName = `image-${timestamp}`;

    cloudinary.uploader.upload(
        imageData,
        {
            overwrite: true,
            invalidate: true,
            folder: "proctor-vision/" + userid,
            public_id: fileName,
        },
        async (error, result) => {
            if (error) res.status(500).send("Failed to save image");
            else {
                try {
                    const user = await UserDataSchema.findOne({ id: userid });
                    const images = user.images;
                    images.push({
                        id: fileName,
                        url: result.secure_url,
                    });
                    await UserDataSchema.findOneAndUpdate(
                        { id: userid },
                        { images: images }
                    );
                } catch (e) {
                    console.log("can not store image in MongoDB", e);
                }

                res.json({ interval }).status(200).end();
            }
        }
    );
});

/*  route to get all users data */
app.get("/retrieve-data", async (_req, res) => {
    const data = await UserDataSchema.find({});

    res.json({ data: data }).status(200).end();
});

app.listen(port, () =>
    console.log(`API is setup on✅... http://localhost:${port}/api/v1/tasks`)
);
