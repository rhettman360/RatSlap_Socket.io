let deck = [];
let hand1 = [];
let hand2 = [];
let stack = [];

function createDeck() {
  for(let i = 14; i < 18; i++){
    for (let j = 1; j < 14; j++) {
      deck.push([i, j])
      }
  }
  return deck;
}

function shuffleDeck() {
  var currentIndex = deck.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = deck[currentIndex];
    deck[currentIndex] = deck[randomIndex];
    deck[randomIndex] = temporaryValue;
  }
  // console.log(this.deck.length);
  return deck;
}
function dealDeck() {
  for(let i = 0; i < 26; i++){
    hand1.push(deck.pop());
  }
  for(let i = 0; i < 26; i++){
    hand2.push(deck.pop());
  }
  console.log(hand1);
  console.log(hand2);
  console.log(deck);
}

function playCard(player) {

}



createDeck();
shuffleDeck();
// console.log(deck);
dealDeck();
