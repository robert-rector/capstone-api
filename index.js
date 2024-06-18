import express from "express";
import bodyParser from "body-Parser";
import axios from "axios";

const app = express();
const port = 3000;

const apiURL =  "https://api.nasa.gov/neo/rest/v1/feed";
const apiKey = "XQxcISf5fEUVLyVT83RewBepiEHcwCEby1Ull3OY";

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/", async (req, res) => {
   
try {
    const response = await axios.get(apiURL + "?" + "start_date=" + req.body.startDate + "&end_date=" + req.body.startDate + "&api_key=" + apiKey);
    const result = response.data;

    const dateParts = req.body.startDate.split('-');
    const year = parseInt(dateParts[0], 10);
    const monthIndex = parseInt(dateParts[1], 10) - 1; // Month is zero-indexed in JavaScript
    const day = parseInt(dateParts[2], 10);
    const date = new Date(year, monthIndex, day);

    console.log(date);

    const options = {year: "numeric", month: "long", day: "numeric" };
    
    const formattedDate = date.toLocaleDateString("en-US", options);

    const today = new Date();

    console.log(today);
    const formattedToday = today.toLocaleDateString("en-US", options);

    let verb = "";

    // if (date.getTime() > today.getTime()) {
    //     verb = "will be";
    // } else if (date.getTime() < today.getTime()) {
    //     verb = "were";
    // } else {
    //     verb = "are"
    // }


    if (formattedDate > formattedToday) {
        verb = "will be";
    } else if (formattedDate < formattedToday) {
        verb = "were";
    } else {
        verb = "are"
    }

    // console.log(formattedDate < formattedToday);
    console.log("Formatted Date: " + formattedDate);
    console.log("Formatted Today: " + formattedToday);


    res.render("index.ejs", { 
        result: result,
        date: formattedDate,
        verb: verb
    });

} catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs");
    
}

   
});

app.listen(3000, () => {
    console.log("Server running on port " + port);
});