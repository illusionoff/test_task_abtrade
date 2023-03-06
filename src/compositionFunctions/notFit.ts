import { config } from 'src/config/config';

const SIZEMINDISTANCE = config.sizemindisrance;

// Если есть грузы, которые не помещаются, то return true
export function notFit(placedCargoes, carL) {
  const notFit = placedCargoes.reduce((accum, cargo) => {
    if (cargo.x + cargo.l + SIZEMINDISTANCE > carL) {
      accum.push(cargo.id);
    }
    return accum;
  }, []);
  console.log('notFit array ', notFit);
  if (notFit.length !== 0) return true;
  return false;
}
