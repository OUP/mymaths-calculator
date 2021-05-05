# mymaths-calculator

Scientific calculator built in React, to go in the MyMaths player.

To build locally, `yarn install` then `yarn start`. Open a browser at `http://localhost:3000` if one doesn't open automatically.

# Structure

Three layers:

View/UI is React. On pressing buttons objects representing the buttons pressed are pushed to an array in the calculator's internal state. This data is used by the two other layers.

To render the maths correctly the calculator uses a LaTeX for HTML library made by Khan Academy, called KaTeX: https://katex.org/ Custom functions map the input array to a TeX string. These may need further testing and bugfixing.

An evaluation layer evaluates the input array. There are 5 data types: integers, fractions, decimals, surds and symbols (algebra). Surds are just symbols with some extra methods for simplifying, so anything that works with surds should also work with symbols. Symbols and surds are custom built classes, decimals and fractions use standard libraries:
https://mikemcl.github.io/decimal.js/ 
https://github.com/infusion/Fraction.js

Errors occur generally when mixing data types. For example a function is expecting a fraction but it's given a decimal.

# Necessary updates

Remove these buttons, they don't need to be used for MVP:
ENG
ẋ
mixed
round
Pol
FACT

Don't show decimal answers to more than 10 d.p.

Display fractions with denominator larger than 100 as decimals.

Bugfixes (see testing and error tracking)

# Player integration

To integrate the calculator into the MyMaths player, either the React component needs to be exported from an NPM module, or the code needs to be copied into the MyMaths Player.

If it's made into an NPM module, the dependencies in package.json will need to be updated. Dependencies that are only needed in the dev environment will need to be moved to devdependencies. Otherwise integrating the calculator will slow the player down. Be aware that doing this will break the current heroku configuration.

The React component will need a wrapper to make it draggable, and the UI will need a button to show and hide the calculator.

The calculator component has internal state, it does not need to send or receive data with the player, except to decide whether it is visible or not.

# Testing & error tracking

Error tracking from editors is here: https://docs.google.com/spreadsheets/d/1Y2cohFDlHtGwgL-ytH7y7tea2Y-NF6R5XTvumGoqHno/edit?ts=60924e28#gid=1655464118

Each tab on the spreadsheet corresponds to one of the functions, with the possible data type combinations listed.

Public version for testing currently at https://mymaths-calculator-heroku-20.herokuapp.com/

To update public version `git push heroku-20 master`

Currently the heroku app is attached to Ryan's heroku account, therefore you may want to host it somewhere else.

