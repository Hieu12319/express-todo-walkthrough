//importing our Dependencies
require('dotenv').config();
const express = require('express');//
const mongoose = require('mongoose');//object Document Manager
const methodOverride = require("method-override") //override request method
const morgan = require("morgan"); //be used for logging



// setup Database connection

const DATABASE_URL = process.env.DATABASE_URL

// establish connection

mongoose.connect(DATABASE_URL)

//save the connection
const cxn = mongoose.connection;

//setup connection
cxn
.on("open", () => console.log("The Mongo Connection is Open"))
.on("close", () =>console.log("The Mongo Connection is Close"))
.on("error", (err) =>console.log(err))

//Schemas & Models

//schema the definition of our data type

const todoSchema = new mongoose.Schema({
    text: String,
    completed: Boolean
}, {timestamps: true})

//model the object for working with our data type
const Todo = mongoose.model("Todo", todoSchema)


// Create Express App
const app = express()


//middleware app.use(midwarefunc)
app.use(morgan("dev"))  // log every request
app.use(express.urlencoded({extended: true}))// parse html form bodies into req.body
app.use("/static", express.static("static")) // server files staticly
app.use(methodOverride("_method"))//over ride request methods for form submission


//routes
app.get("/", async (req, res) => {
    //go get todos
    const todos = await Todo.find({})
    //render index.ejs
    res.render("index.ejs", {todos})
})

app.get("/todo/seed", async (req, res) => {
    // delete all existing todos
    await Todo.remove({}).catch((err) => res.send(err))
    // add you sample todos
    const todos = await Todo.create([
        {text: "eat breakfast", completed: false},
        {text: "eat lunch", completed: false},
        {text: "eat dinner", completed: false}
    ]).catch((err) => res.send(err))
    // send the todos as json
    res.json(todos)
})
//listener
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`listening on port ${PORT}`))
