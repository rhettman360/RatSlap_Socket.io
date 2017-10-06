var express = require ("express")
var session = require('express-session')
var path = require("path")
var app = express()
var bodyParser = require('body-parser');
var PORT = 8000

app.use(session({secret: 'codingdojorocks'}));  // string for encryption
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({extended: true}));
app.use(express.static(path.join(__dirname, "./client")))
app.set("views", path.join(__dirname, "./client/views"))
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "./node_modules")))
const server = app.listen(PORT, () =>{
  console.log(`Listening on port ${PORT}`)
})
const io = require("socket.io").listen(server)

app.get("/", (req, res) =>{
  if (req.session && !req.session.name) {
    req.session.name = ""
  }
  console.log(req.session.name);
  res.render("index", req.session)
})

app.post("/startGame", (req, res)=>{
  req.session.name = req.body.name
  console.log("it worked!", req.session.name);
  res.render("game", req.session)
})

// io.sockets.on("connection", socket =>{
//   console.log("New Connection", socket.id)
//   socket.emit("counter", click)
//   socket.on("clickcounter", () => {
//     click++
//     io.emit("counter", click)
//   })
// })
