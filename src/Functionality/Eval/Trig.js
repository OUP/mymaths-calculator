import degTrig from './degTrig';
import radTrig from './radTrig';

export default function trig(trigFunc, angleMode, arg) {
  switch (angleMode) {
    case 'deg':
      return degTrig(trigFunc, arg);

    case 'rad':
      return radTrig(trigFunc, arg);
  }
}
