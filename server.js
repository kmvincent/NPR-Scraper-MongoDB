var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Requiring all models
var db = require("./models");

// Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;

// Morgan Logger logging requests
app.use(logger("dev"));


// Body-parser to handle form submissions
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connecting Mongo DB
mongoose.connect("mongodb://localhost/week18Populater");

// Routes

app.get("/scrape", function(req, res) {
  axios.get("https://www.npr.org/sections/news/").then(function(response) {
    var $ = cheerio.load(response.data);
    $("article.item").each(function(i, element) {
    var result = {};
        result.subCategory = $(this)
            .find("div.item-info")
            .find("h3.slug")
            .children("a")
            .text();
        result.title = $(this)
            .find("div.item-info")
            .find("h2.title")
            .children("a")
            .text();        
        result.link = $(this)
            .find("div.item-info")
            .find("h2.title")
            .children("a")
            .attr("href");       
        result.summary = $(this)
            .find("div.item-info")
            .find("p.teaser")
            .children("a")
            .text();    
        result.img = $(this)
            .find("div.item-image")
            .find("div.imagewrap")
            .children("a")
            .attr("href");
     
    //Creating Database using Mongo and saving the results from the scraping into the database. 
    // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
    console.log("Scrape Complete");
    res.redirect("/");
  });
});

// Route to get all articles 
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route to get specific article by id
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// //Route to get all saved articles
// app.get("/saved", function (req, res) {
//     db.Article.find(
//         { saved: true },
//         { sort: { created: -1 } }, 
//         function (err, data) {
//         if (data.length === 0) {
//             res.render("placeholder",
//                 { message: "Uh Oh. Looks like we don't have any saved articles." });
//         }
//         else {
//             res.render("saved", { saved: data });
//         }
//     });
// });

// //Route for saving an article by id
// app.post("/saved/:id", function (req, res) {
//     db.Article.findById(req.params.id, function (err, data) {
//         if (data.saved) {
//             Article.findByIdAndUpdate(req.params.id, { $set: { saved: false, status: "Save Article" } }, { new: true }, function (err, data) {
//                 res.redirect("/");
//             });
//         }
//         else {
//             Article.findByIdAndUpdate(req.params.id, { $set: { saved: true, status: "Saved" } }, { new: true }, function (err, data) {
//                 res.redirect("/saved");
//             });
//         }
//     });
// });


// // Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id },{ new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// // Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
