import { config } from 'src/config/config';

// отсекам грузы превышающие высоту кузова учитывая допуск высоты снизу и сверху
export function cargoesHeight(cargoes, carH) {
  const SIZEMINDISTANCE = config.sizemindisrance;
  const cargoesHeight = cargoes.reduce((accumulator, cargo) => {
    if (cargo.h + SIZEMINDISTANCE * 2 < carH) accumulator.push(cargo);
    return accumulator;
  }, []);
  return cargoesHeight;
}
