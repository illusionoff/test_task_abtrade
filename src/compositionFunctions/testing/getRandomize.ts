export function getRandomize(count, minL, manL, minW, manW, minH, maxH) {
  const coordinates = [];
  const minMass = 5;
  const maxMass = 50;
  for (let i = 1; i <= count; i++) {
    const l = getRandomInt(minL, manL);
    const w = getRandomInt(minW, manW);
    const m = getRandomInt(minMass, maxMass);
    const h = getRandomInt(minH, maxH);
    coordinates.push({ l, w, m, h, id: i });
  }
  return coordinates;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
