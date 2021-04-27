export default function nameToLabelMap(name) {
  switch (name) {
    case 'x²':
      return '{x^2}';

    case 'x³':
      return '{x^3}';

    case '|x|':
      return '{\\text{Abs}}';

    case 'xⁿ':
      return '{x^{\\Box}}';

    case 'x⁻¹':
      return '{x^{-1}}';

    case 'log(x)':
      return '{\\text{log}}';

    case 'logₐ(x)':
      return '{\\text{log}_\\Box \\Box}';

    case 'ln(x)':
      return '{\\text{ln}}';

    case 'eⁿ':
      return 'e^{\\Box}';

    case 'x!':
      return '{x!}';

    case 'frac':
      return '{\\frac {\\Box} {\\Box}}';

    case '√(x)':
      return '{\\sqrt {\\Box}}';

    case 'ⁿ√(x)':
      return '{{}^\\Box \\sqrt {\\Box}}';

    case 'sin(x)':
      return '{\\text{sin}}';

    case 'sin⁻¹':
      return '{\\text{sin}^{-1}}';

    case 'cos(x)':
      return '{\\text{cos}}';

    case 'cos⁻¹':
      return '{\\text{cos}^{-1}}';

    case 'tan(x)':
      return '{\\text{tan}}';

    case 'tan⁻¹':
      return '{\\text{tan}^{-1}}';

    case '%':
      return '{\\%}';

    case '-':
      return '{(\\text{-})}';

    case '(':
      return '{(}';

    case ')':
      return '{)}';

    case 'π':
      return '{π}';

    // case '⬅':
    //   return '{\\leftarrow}';

    // case '➡':
    //   return '{\\rightarrow}';

    // case '⬆':
    //   return '{\\uparrow}';

    // case '⬇':
    //   return '{\\downarrow}';

    default:
      return name;
  }
}
