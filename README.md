# mymaths-calculator

This is an early prototype for a scientific calculator built in React, to go in the new MyMaths player.

https://mymaths-calculator.herokuapp.com

To build locally, `yarn install` then `yarn start`. Open a browser at `http://localhost:3000` if one doesn't open automatically.
Click buttons to make things happen. Caveats below.

# Known errors

The following buttons are still idle:
`shift`
`frac`
`%`
`ENG`
`S⇔D`
`π`

Nested brackets `(())` are buggy.

Cursor skips.

Using multiple decimal points in a number will give weird outputs.

Output values can be imprecise due to solvable errors with floating point arithmetic.

-+3 gives an infinite loop.

# Compulsory improvements

Set rad, degrees, grad modes for trig functions.

Handle fractions correctly.

Handle surds correctly.

Handle recurring decimals correctly.

Add in the shift mode buttons (inverse trig functions etc.)

Add in functionality to store variables.

Add hotkeys.

Better cursor.

Improve design.

# Optional improvements

MathJax/LaTeX rendering of fractions and surds.

Stats and table modes.

Add in some of the functionality for an A Level graphical calculator, e.g. graphs (once grapher is done!) and algebra.
