//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); //used to see the static pages in ur case the custom css and impages, that we created in public folder



app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});


// Mian page
app.post("/", function(req, res){
    let first = req.body.fName;
    let last = req.body.lName;
    let email = req.body.email;
    let data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: first,
                    LNAME: last
                }
            }
        ]
    };

    let jsonData = JSON.stringify(data);
    const url = "https://us2.api.mailchimp.com/3.0/lists/8184f6f4c";

    const options ={
        method: "POST",
        auth: "baisal:5b2b25d16f02d22ecd70c2fb1e0789d-us2"
    };

    

    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
    

});

// For the failure html page
app.post("/failure", function(req, res) {
    res.redirect("/"); 
});





app.listen(process.env.PORT || 3000, function() {  //process.env.PORT is a dynamic port instead of 3000
    console.log("Server is running");
});


