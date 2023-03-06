import { ICargo } from 'src/app.service';

// Определяем какие грузы взять по массе. Не жадный алгоритм
export function getCargoesMass(cargoes: ICargo[], capacity: number): ICargo[] {
  // создаем двумерный массив, где в каждой ячейке будет максимальная масса грузов, которые можно уложить в кузов с данной вместимостью
  const maxMasses: number[][] = Array.from({ length: cargoes.length + 1 }, () =>
    Array(capacity + 1).fill(0),
  );

  for (let i = 1; i <= cargoes.length; i++) {
    const cargo = cargoes[i - 1];
    for (let j = 1; j <= capacity; j++) {
      if (cargo.m <= j) {
        // если текущий груз можно уложить в кузов, то сравниваем его массу с массой грузов, которые можно уложить в кузов без него
        // и выбираем максимальное значение
        maxMasses[i][j] = Math.max(maxMasses[i - 1][j], cargo.m + maxMasses[i - 1][j - cargo.m]);
      } else {
        // если текущий груз не помещается в кузов, то берем максимальную массу грузов, которые можно уложить в кузов без него
        maxMasses[i][j] = maxMasses[i - 1][j];
      }
    }
  }

  // находим, какие грузы были уложены в кузов, проходя по массиву с конца
  let i = cargoes.length;
  let j = capacity;
  const maxLoad: ICargo[] = [];
  while (i > 0 && j > 0) {
    if (maxMasses[i][j] !== maxMasses[i - 1][j]) {
      maxLoad.push(cargoes[i - 1]);
      j -= cargoes[i - 1].m;
    }
    i--;
  }
  maxLoad.reverse();
  return maxLoad;
}
