const Fraction = require('fraction.js');

export default function getRan() {
  return new Fraction(getRandomInt(999)).div(1000).toString();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
