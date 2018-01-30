//This is injected at UI/ButtonsColumn.js
export function generateButtons(position, column) {
  switch (position) {
    case 'top':
      switch (column) {
        case '0':
          return ['shift'];
        
        case '1':
          return ['⬅'];
    
        case '2':
          return ['⮕'];
    
        case '3':
          return ['⬆'];
        
        case '4':
          return ['⬇'];
    
        default:
          console.error('No column here.');
          break;
      }
      break;

    case 'middle':
      switch (column) {
        case '0':
          return ['|x|', 'frac', '(-)'];
        
        case '1':
          return ['x²', '√(x)', 'ENG'];
    
        case '2':
          return ['xⁿ', 'sin(x)', '('];
    
        case '3':
          return ['log(x)', 'cos(x)', ')'];
        
        case '4':
          return ['ln(x)', 'tan(x)', 'S⇔D'];

        case '5':
          return ['x!', '%', 'π'];
    
        default:
          console.error('No column here.');
          break;
      }
      break;

    case 'bottom':
      switch (column) {
        case '0':
          return [7, 4, 1, 0];

        case '1':
          return [8, 5, 2, '.'];
      
        case '2':
          return [9, 6, 3, '×10ⁿ'];
      
        case '3':
          return ['DEL', '×', '+', 'Ans'];

        case '4':
          return ['AC', '÷', '–', '='];
      
        default:
          console.error('No column here.');
          break;
      }
      break;

      default:
      console.error('Invalid position.')
      break;
  }
}
