// После основного расположения грузов опттмизация. Центрирование груза, если сверху или снизу нет других грузов
export function verticalAlign(placedCargoes, carW: number): void {
  if (placedCargoes.length == 1) {
    console.log('verticalAlign placedCargoes.length == 1');
    const oneCargo = placedCargoes[0];
    oneCargo.y = Math.round((carW - (oneCargo.y + oneCargo.w)) / 2);
    return;
  }
  for (let i = 0; i < placedCargoes.length; i++) {
    const cargo = placedCargoes[i];
    let overlaps = false;
    for (let j = 0; j < placedCargoes.length; j++) {
      if (i === j) continue; // пропускаем сравнение с самим собой
      const cargoOther = placedCargoes[j];
      if (checkOverlap(cargo, cargoOther)) {
        overlaps = true;
        break;
      }
    }
    if (!overlaps) {
      cargo.y = Math.round((carW - (cargo.y + cargo.w)) / 2);
    }
  }
}

// Если у уже рзмещенного груза не имеется соседей по вертикали, то расположить по центру кузова по вертикали
function checkOverlap(rect1, rect2) {
  const x1Right = rect1.x + rect1.l;
  const x2Right = rect2.x + rect2.l;
  return (
    (rect2.x >= rect1.x && rect2.x <= x1Right) ||
    (x2Right <= x1Right && x2Right >= rect1.x) ||
    (rect1.x >= rect2.x && rect1.x <= x2Right) ||
    (x1Right <= rect2.x && x1Right >= x2Right)
  );
}
