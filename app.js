const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const bodyParser = require("body-parser");

dotenv.config()
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* MONGODB WITH MONGOOSE  */
const DataBase_url = process.env.DATABASE_URL
const DataBase_name = process.env.DATABASE_NAME

try {
    mongoose.connect(DataBase_url, {
        useNewUrlParser: true,
    });
    console.log(`DataBase Connected : Collection ${DataBase_name}`);
} catch (error) {
    console.log(`DataBase Connection Error \n ${error}`);
}

/* MONGOOSE DATABASE SCHEMA */
const moiveSchema = {
    name: String,
    img: String,
    summary: String,
};

/* CREATING A MODEL OBJECT */
const Movie = mongoose.model("Movie", moiveSchema);

// CRUD
// create
app.post("/create", function (req, res) {
    const movie = new Movie({
        name: req.body.name,
        img: req.body.img,
        summary: req.body.summary,
    });
    movie.save(function (err) {
        if (!err) {
            res.json({
                message: "insert successful"
            })
        } else {
            res.json(err)
        }
    });
});

// read
app.get("/", function (req, res) {
    // find all movies to display on home page
    Movie.find({}, function (err, movies) {
      res.json(movies)
    });
});

app.get("/read", function (req, res) {
    // find all movies specified by the name to display on home page
    const moviename = req.body.name;
    Movie.find({ name: moviename }, function (err, movies) {
        res.json(movies)
    });
});

// update movie specified by the name
app.post("/update", function (req, res) {
    const moviename = req.body.name;
    const movieimg = req.body.img;
    const moviesummary = req.body.summary;
    const filter = { name: moviename };
    const update = {
        img: movieimg,
        summary: moviesummary
    };
    const updateDocument = async () => {
        let doc = await Movie.findOneAndUpdate(filter, update);
        if(doc==null){
            res.json({
                message: "update unsuccessful",
                reason: "document does not exists"
            })
        }else{
            res.json({
                message: "update successful"
            })
        }
    }
    updateDocument()

})

// delete movie specified by the name
app.post("/delete", function (req, res) {
    const name = req.body.name
    const filter = { name: name };
    Movie.findOneAndDelete(filter, function (err, docs) {
        if (err) {
            res.json(err)
        }
        else {
            if(docs==null){
                res.json({
                    message: "delete unsuccessful",
                    reason: "document does not exists"
                })
            }else{
                res.json({
                    message: "delete successful"
                })
            }
        }
    })
})

/* SERVER INIT */
const portnumber = process.env.PORT
app.listen(portnumber, function () {
    console.log(`server started at port ${portnumber}`);
});