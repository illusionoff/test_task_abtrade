import { notFit } from './notFit';
import { placeCargoes } from './placeCargoes';

export function repeatedPlacedCargoes(cargoesMass, car) {
  // Алгоритм повторного прохода заполнения грузов, если не все вошли
  let placedCargoes = [];
  let notFitResult = true;
  let count = 0;
  let comments = '';
  // необходима проверка на значенение не меньше 1
  if (cargoesMass.length !== 0) {
    // цикл поворной расстановки, если не помещается
    while (notFitResult) {
      // отсортируем грузы по ширине в порядке убывания для того, чтобы сначало улаживались самые широкие в кузов
      cargoesMass.sort((a, b) => b.w - a.w);
      // расставляем грузы
      placedCargoes = placeCargoes(cargoesMass, car);
      // узнаем поместились ли грузы
      notFitResult = notFit(placedCargoes, car.l);
      // если не поместились, то удаляем один груз самый легкий
      if (notFitResult) {
        cargoesMass.sort((a, b) => a.m - b.m);
        cargoesMass.shift();
      }
      count++;
      console.log('while count:', count);
    }
  } else {
    console.log('Нет грузов');
    notFitResult = false;
    comments += 'Нет грузов';
  }
  return { placedCargoes, comments };
}
