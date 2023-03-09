/* ------------------------- Import required modules ------------------------ */
const express = require("express");
const fs = require("fs");
const multer = require("multer");
const uniqueId = require("uniqid");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

/* ---------------------------- Initial interval ---------------------------- */
var interval = 3;

/* ------------------------- Configuring cloudinary ------------------------- */
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
    secure: true,
});
// console.log(cloudinary.config());

/* ------------------------- Configuring multer ------------------------- */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + "/images/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = req.body.userid + "-" + Date.now() + ".png";
        req.fileName = uniqueSuffix;
        cb(null, uniqueSuffix);
    },
});
const upload = multer({ storage: storage });

/* ------------------------ When new user starts test ----------------------- */
app.post("/new_user", async (req, res) => {
    try {
        const id = uniqueId.time();
        const { name, email, invite } = req.body;
        console.log(req.body);
        // updating data
        let data = await fs.readFileSync("./data.json", "utf-8");
        data = JSON.parse(data);
        data.push({
            name,
            email,
            invite,
            id,
            images: [],
        });
        await fs.writeFileSync("./data.json", JSON.stringify(data));

        // send userid to the extension
        res.send({ userid: id }).status(200).end();
    } catch {
        // if error is occured
        res.send({ error: "Something went wrong" }).status(500).end();
    }
});

/* ------------------------ To upload image after interval ------------------------ */
app.post("/post_image", upload.single("image"), async (req, res) => {
    try {
        // uploading image to cloudinary
        const result = await cloudinary.uploader.upload(
            __dirname + `/images/${req.fileName}`,
            {
                public_id: req.fileName,
                use_filename: true,
                folder: "eLitmus-extension",
            }
        );

        // updating data - adding url of the image to the user's data
        let data = await fs.readFileSync("./data.json", "utf-8");
        data = JSON.parse(data);

        const index = data.findIndex((user) => user.id === req.body.userid);
        data[index].images.push({
            id: result.original_filename.split("-")[1],
            url: result.secure_url,
        });

        await fs.writeFileSync("./data.json", JSON.stringify(data));

        // Delete the image from the server, once uploaded to cloudinary.
        await fs.unlink(__dirname + `/images/${req.fileName}`, (err) =>
            console.log(err)
        );

        // success. sending interval to the extension, in case it is changed now.
        res.send({ success: "Image uploaded", interval }).status(200).end();
    } catch (err) {
        // if error occurs...
        res.send({ error: "Something went wrong" }).status(500).end();
    }
});

/* ----------------------- api to get all users' data ----------------------- */
app.get("/get_data", async (_req, res) => {
    // reading data from the file.
    const data = await fs.readFileSync("./data.json", "utf-8");
    res.json(data).status(200).end();
});

/* --------------------------- api to set new value interval -------------------------- */
app.get("/set_interval", (req, res) => {
    interval = req.query.interval;
    res.send({ success: "Interval set" }).status(200).end();
});

/* ------------------------- listening for requests / starting server ------------------------- */
app.listen(3000, () => {
    console.log("Server started on port 3000");
});
