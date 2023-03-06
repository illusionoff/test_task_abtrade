import { Injectable } from '@nestjs/common';
import * as Jimp from 'jimp';
import { getCargoesMass } from './compositionFunctions/getCargoesMass';
import { getRandomize } from './compositionFunctions/testing/getRandomize';
import { repeatedPlacedCargoes } from './compositionFunctions/repeatedPlacedCargoes';
import { cargoesHeight } from './compositionFunctions/cargoesHeight';
import { cargoesWidthLength } from './compositionFunctions/cargoesWidthLength';
import { verticalAlign } from './compositionFunctions/verticalAlign';

export interface ICargo {
  x: number;
  y: number;
  l: number;
  w: number;
  h: number;
  m: number;
  id: number;
}

export interface ICarSize {
  l: number;
  w: number;
}

async function drawRectangles(cargoes: ICargo[], carSize, scaleImage): Promise<Jimp> {
  const SCALE = scaleImage;
  const imageWidth = carSize.l * SCALE;
  const imageHeight = carSize.w * SCALE;
  const image = await Jimp.create(imageWidth, imageHeight, 0xadd8e6);
  for (const cargo of cargoes) {
    const { x, y, l, w } = cargo;
    const color = 0x0000ff;
    const strokeColor = 0x009900;
    const strokeWidth = 10000;
    const scaledX = x * SCALE;
    const scaledY = y * SCALE;
    const scaledL = l * SCALE;
    const scaledW = w * SCALE;
    // Draw rectangle
    image.scan(scaledX, scaledY, scaledL, scaledW, function (x, y, idx) {
      if (
        x < strokeWidth ||
        x > scaledL - strokeWidth ||
        y < strokeWidth ||
        y > scaledW - strokeWidth
      ) {
        // Draw stroke
        this.bitmap.data[idx + 0] = (strokeColor >> 16) & 0xff; // R
        this.bitmap.data[idx + 1] = (strokeColor >> 8) & 0xff; // G
        this.bitmap.data[idx + 2] = strokeColor & 0xff; // B
        this.bitmap.data[idx + 3] = 0xff; // A
      } else {
        // Draw fill
        this.bitmap.data[idx + 0] = (color >> 16) & 0xff; // R
        this.bitmap.data[idx + 1] = (color >> 8) & 0xff; // G
        this.bitmap.data[idx + 2] = color & 0xff; // B
        this.bitmap.data[idx + 3] = 0xff; // A
      }
    });

    // Draw text
    const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    // const alignX = Math.trunc(scaledX + scaledL / 2);
    // const alignY = Math.trunc(scaledY + scaledW / 2);
    // const textX = alignX-5;
    // const textY = alignY-5;
    const textX = scaledX + 5;
    const textY = scaledY + 5;
    // font.chars['Ё'.charCodeAt(0)] = { x: 0, y: 0, w: 32, h: 32 };
    // font.chars['ё'.charCodeAt(0)] = { x: 0, y: 0, w: 32, h: 32 };
    image.print(font, textX, textY, `Gr${cargo.id.toString()}`);
  }
  return image;
}

@Injectable()
export class AppService {
  async generateImageData(res, composition): Promise<any> {
    // необходимо в composition получать как спимок для отрисовки так и список пустой или полный о невошедших id грузов
    const { cargoes, cargoesExit, carSize, comments, scaleImage } = composition;
    const image = await drawRectangles(cargoes, carSize, scaleImage);
    const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
    // создайте объект для передачи данных и изображения
    const response = {
      data: { cargoesExit: cargoesExit, comments },
      image: buffer.toString('base64'),
    };
    // отправьте данные и изображение вместе
    res.send(response);
  }

  async composition(dataCarAndCargos): Promise<any> {
    const { randomize } = dataCarAndCargos;
    if (randomize) {
      const cargoes = getRandomize(30, 5, 30, 5, 50, 1, 30);
      const dataRandom = {
        car: {
          l: 250,
          w: 100,
          h: 100,
          m: 1000,
        },
        cargoes: cargoes,
        scaleImage: 5,
      };
      return await this.compositionCheck(dataRandom);
    }
    return await this.compositionCheck(dataCarAndCargos);
  }
  // функции основного алгоритма расстановки грузов по кузову
  async compositionCheck(dataCarAndCargos): Promise<any> {
    const { car, cargoes, scaleImage } = dataCarAndCargos;
    // отсекам грузы превышающие высоту кузова учитывая допуск высоты снизу и сверху
    const cargoesHeightResult = cargoesHeight(cargoes, car.h);
    // отсекам грузы размеры которых превышают вместимость кузова
    const cargoesWidthLengthResult = cargoesWidthLength(cargoesHeightResult, car);
    const capacity = car.m;
    // Определяем какие грузы взять по массе. Не жадный алгоритм
    const cargoesMass = getCargoesMass(cargoesWidthLengthResult, capacity);
    console.log('cargoesMass', cargoesMass);
    const { placedCargoes, comments } = repeatedPlacedCargoes(cargoesMass, car);
    // Если у уже рзмещенного груза не имеется соседей по вертикали, то расположить по центру кузова по вертикали
    verticalAlign(placedCargoes, car.w);
    // Находим массив объектов грузов, которые не вошли в кузов
    const cargoesExit = cargoes.filter((cargo) => !placedCargoes.some((c) => c.id === cargo.id));
    const carSize = { l: car.l, w: car.w };
    const composition = { cargoes: placedCargoes, cargoesExit, carSize, comments, scaleImage };
    return composition;
  }
}
