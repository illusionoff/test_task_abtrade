import { Controller, Post, Body, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { DataCarAndCargosDto } from './dto/dataCarAndCargos.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('cargolayout')
  // Должен получать данные в JSON о машине и грузах
  async generateImage(@Body() body: DataCarAndCargosDto, @Res() res) {
    // Получаю входные данные о машине и грузах
    const dataCarAndCargos = body;
    // Определяем композицию грузов в кузове
    const composition = await this.appService.composition(dataCarAndCargos);
    // Русуем рисунок и передаем данные, если какие-то грузы не поместились
    return this.appService.generateImageData(res, composition);
  }
}
