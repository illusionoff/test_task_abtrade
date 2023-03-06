import { config } from 'src/config/config';

const SIZEMINDISTANCE = config.sizemindisrance;

export class CargoesPacker {
  width: number;
  height: number;
  pack: CargoesPackerRect[];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.pack = [];
  }

  private findPlace(rc: CargoesPackerRect): CargoesPackerRect {
    if (this.pack.length) {
      let i = 0;
      while (i < this.pack.length) {
        if (rc.intersect(this.pack[i])) {
          if (SIZEMINDISTANCE + rc.h + this.pack[i].y1() < this.height) {
            rc.y = this.pack[i].y1() + SIZEMINDISTANCE;
            i = -1;
          } else if (SIZEMINDISTANCE + rc.w + this.pack[i].x1() < this.width) {
            rc.x = this.pack[i].x1() + SIZEMINDISTANCE;
            rc.y = 0;
            i = -1;
          } else {
            rc.x += 1;
            rc.y = 0;
            i = -1;
          }
        }
        i++;
      }
    } else {
      rc.x = 0;
      rc.y = 0;
    }
    return rc;
  }
  fit(rcs: CargoesPackerRect[]): void {
    this.pack = [];
    for (let i = 0; i < rcs.length; i++) {
      this.pack.push(this.findPlace(rcs[i]));
    }
  }
}
// добавляем грузы для расположения в кузове
export class CargoesPackerRect {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(id: number, x: number, y: number, w: number, h: number) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  x1(): number {
    return this.x + this.w;
  }

  y1(): number {
    return this.y + this.h;
  }
  // Определение пересечения
  intersect(rc: CargoesPackerRect): boolean {
    return (
      (((rc.x >= this.x && rc.x <= this.x1()) || (rc.x1() >= this.x && rc.x1() <= this.x1())) &&
        ((rc.y >= this.y && rc.y <= this.y1()) || (rc.y1() >= this.y && rc.y1() <= this.y1()))) ||
      (((this.x >= rc.x && this.x <= rc.x1()) || (this.x1() >= rc.x && this.x1() <= rc.x1())) &&
        ((this.y >= rc.y && this.y <= rc.y1()) || (this.y1() >= rc.y && this.y1() <= rc.y1()))) ||
      (((rc.x >= this.x && rc.x <= this.x1()) || (rc.x1() >= this.x && rc.x1() <= this.x1())) &&
        ((this.y >= rc.y && this.y <= rc.y1()) || (this.y1() >= rc.y && this.y1() <= rc.y1()))) ||
      (((this.x >= rc.x && this.x <= rc.x1()) || (this.x1() >= rc.x && this.x1() <= rc.x1())) &&
        ((rc.y >= this.y && rc.y <= this.y1()) || (rc.y1() >= this.y && rc.y1() <= this.y1())))
    );
  }
}
