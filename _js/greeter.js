// var _ = require("lodash"),
// const Bounce = require("bounce.js")
var Cookies = require("js-cookie"),
  Typewriter = require("typewriter")

const phrases = {
  0: [
    "Welcome to a really great food blog!",
    "You're going to love this food blog!",
    "Hello new Internet friend"
  ],
  1: [
    "Welcome back!",
    "Glad to see that you like this blog!",
    "You should consider sharing this blog"
  ],
  10: [
    "Glad to see you again! You seem to like the blog a lot! :D",
    "Hello again",
    "You look really nice today. It's also nice seeing you :)",
    "How many more times are you going to visit? :D I should making games for us to play"
  ],
  100: [
    "Glad to see you again! You seem to like the blog a lot! :D",
    "Hello again",
    "You look really nice today. It's also nice seeing you :)",
    "How many more times are you going to visit? :D I should start making games for us to play",
    "I want you to meet "
  ]
}

function writeTypewriterGreeter() {
  var el = document.getElementById("greet"),
    count = Cookies.get("times visited") || 0,
    typewriter = Typewriter(el)
      .withAccuracy(99)
      .withMinimumSpeed(15)
      .withMaximumSpeed(30)
      .build()

  if (!count) Cookies.set("times visited", 1, {expires: 7, path: ""})
  else {
    Cookies.set("times visited", parseInt(count) + 1, {expires: 7, path: ""})
  }

  typewriter.type(randomPhrase(count))
}

function randomPhrase(visits) {
  visits = parseInt(visits)

  let phrase = undefined
  switch (true) {
    case visits > 100:
      phrase = phrases[100]
      break

    case visits > 10:
      phrase = phrases[10]
      break

    case 10 >= visits && visits > 1:
      phrase = phrases[1]
      break

    default:
      phrase = phrases[0]
      break
  }
  return phrase[Math.floor(Math.random() * phrase.length)]
}

window.onload = () => writeTypewriterGreeter()
