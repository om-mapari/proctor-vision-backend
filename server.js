const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const uniqueId = require("uniqid");

var interval = 5000;



/*  route to set new value interval  */
app.get("/set_interval", (req, res) => {
    interval = req.query.interval;
    console.log('interval setted to ' + interval*1000);
    res.send({ success: "Interval set" }).status(200).end();
});



app.listen(3000, () => {
    console.log("Server listening on port 3000");
});