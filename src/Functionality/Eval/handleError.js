export default function handleError({ name }) {
  switch (name) {
    case 'DivisionByZero':
    case 'Maths error':
      return 'Maths error';

    default:
      return 'Syntax error';
  }
}
