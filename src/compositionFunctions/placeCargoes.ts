import { config } from 'src/config/config';
import { CargoesPacker, CargoesPackerRect } from './cargoesPacker/cargoesPacker';

const SIZEMINDISTANCE = config.sizemindisrance;
interface IcarSize {
  l: number;
  w: number;
}

export function placeCargoes(cargoes, car: IcarSize) {
  // первый параметр ограничивает распростанение грузов
  const packer = new CargoesPacker(car.l - SIZEMINDISTANCE * 2, car.w - SIZEMINDISTANCE * 2);
  // добавляем грузы для расположения в кузове
  const cargoesPicker = cargoes.map((cargo) => {
    // меняем местами стороны кузова, для ограничения снизу, а не справа
    const rect = new (CargoesPackerRect as any)(cargo.id, 0, 0, cargo.l, cargo.w);
    return rect;
  });
  // вычисялем
  packer.fit(cargoesPicker);
  // выводим массив грузов с координатами
  const cargoesResult = packer.pack.map((cargo) => {
    return {
      x: cargo.x + SIZEMINDISTANCE,
      y: cargo.y + SIZEMINDISTANCE,
      w: cargo.h,
      l: cargo.w,
      id: cargo.id,
    };
  });
  return cargoesResult;
}
