const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const uniqueId = require("uniqid");
var interval = 5000;


app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(express.static("./public"));


/*  route to set new value for interval  */
app.get("/set_interval", (req, res) => {
    interval = req.query.interval;
    console.log('interval setted to ' + interval*1000);
    res.send({ success: true }).status(200).end();
});

/*  route for new user request  */
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