export default function handleError({ name }) {
  let error;
  switch (name) {
    case 'DivisionByZero':
      error = 'Maths error';
      break;
    default:
      error = 'Syntax error';
      break;
  }
  return error;
}
