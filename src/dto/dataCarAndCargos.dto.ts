export class DataCarAndCargosDto {
  car: CarDto;
  cargoes: CargoesDto[];
  randomize: boolean;
  scaleImage: number;
}

class CarDto {
  l: number;
  w: number;
  h: number;
  m: number;
}

export class CargoesDto {
  l: number;
  w: number;
  h: number;
  m: number;
  id: number;
  x: number;
  y: number;
}
