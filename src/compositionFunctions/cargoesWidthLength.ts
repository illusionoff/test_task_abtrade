import { config } from 'src/config/config';

const SIZEMINDISTANCE = config.sizemindisrance;

// отсекам грузы размеры которых превышают вместимость кузова
export function cargoesWidthLength(cargoesHeightResult, car) {
  const cargoesWidthLength = cargoesHeightResult.reduce((accumulator, cargo) => {
    const maxL = car.l - SIZEMINDISTANCE * 2;
    const maxW = car.w - SIZEMINDISTANCE * 2;
    if (cargo.l > maxL || cargo.w > maxW) {
    } else {
      accumulator.push(cargo);
    }
    return accumulator;
  }, []);
  return cargoesWidthLength;
}
