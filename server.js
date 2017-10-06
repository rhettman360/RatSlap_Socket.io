var express = require ("express")
var session = require('express-session')
var path = require("path")
var app = express()
var bodyParser = require('body-parser');
var Game = require('game.js');
var Card = require('card.js');
var PORT = 8000

app.use(session({secret: 'codingdojorocks'}));  // string for encryption
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({extended: true}));
app.use(express.static(path.join(__dirname, "./client")))
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

var rooms = [];

io.on('connection', function(socket) {

	console.log('new connection ', socket.id);

	socket.on('join', function(data) {
		var game;

		if (rooms.length === 0 || !rooms[rooms.length - 1].isWaiting()) {
			game = new Game();
			rooms.push(game);
		} else {
			game = rooms[rooms.length - 1];
		}

		game.addPlayer(data.username, socket);

		// game.updateGame();

		game.emitPlayers('gameInfo', {'roomIndex': rooms.length - 1, 'players': game.getNumPlayers()});

		if (game.getNumPlayers() == 2) {
			game.startGame();
		}

	});

	socket.on('sendCard', function(payload) {
		console.log(payload);
		var game = rooms[payload.gameInfo.roomIndex];
		var player = game.findPlayer(socket.id);

		player.currentCard = new Card(payload.cardValue); // TODO: Improve lookup Card
		game.currentlyPlayed++;

		if (game.currentlyPlayed == game.getNumPlayers()) {
			game.endTurn();
		}

		game.updateGame();
		game.printPretty();

		// If somebody has no cards left, end game.
		if (game.hasGameEnded()) {
			console.log('Game ended');
			game.emitPlayers('gameEnded', {'winner': game.gameWinner.username});
		}

	});

	socket.on('disconnect', function(){
		console.log('disconnect');
	});

});



app.get('/rooms', function(req, res) {
	var content = '';
	content += '<h1>Latest Rooms</h1>';
	content += '<ul>';

	for (var i = rooms.length - 1; i >= 0; i--) {
		content += '<li>Num. players: ' + rooms[i].getNumPlayers() + '; Status: ' + rooms[i].status + '</li>';
	}
	content += '</ul>';

	res.send(content);
});


app.get('/rooms/:id', function(req, res) {
	if (typeof rooms[req.params.id] != 'undefined') {
		var game = rooms[req.params.id];

		res.send('Num. players: ' + game.getNumPlayers() + '; Status: ' + game.status);
	} else {
		res.send('The game doesn\'t exists');
	}

});

server.listen(PORT);
