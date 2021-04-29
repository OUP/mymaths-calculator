import degInverseTrig from './degInverseTrig';
import radInverseTrig from './radInverseTrig';

export default function inverseTrig(trigFunc, angleMode, arg) {
  switch (angleMode) {
    case 'deg':
      return degInverseTrig(trigFunc, arg);

    case 'rad':
      return radInverseTrig(trigFunc, arg);
  }
}
