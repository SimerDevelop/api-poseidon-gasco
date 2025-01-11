import { Controller, Post, UseInterceptors, UploadedFile, Body, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('api/files') // Ruta base del controlador
export class FileInterceptorController {
  @Post('upload') // Ruta específica para subir el formulario
  @UseInterceptors(FileInterceptor('image')) // Interceptor para manejar archivos
  async uploadFile(
    @UploadedFile() file: Express.Multer.File, // Archivo recibido
    @Body() body: { company: string; phone: string; email: string }, // Datos del formulario
  ) {
    console.log('Datos del formulario:', body);
    console.log('Archivo recibido:', file);

    // Validar que el archivo y los datos sean válidos
    if (!file) {
      throw new BadRequestException('El archivo es obligatorio.');
    }
    if (!body.company || !body.phone || !body.email) {
      throw new BadRequestException('Faltan datos obligatorios en el formulario.');
    }

    // Convertir el archivo a un formato compatible con MySQL (Buffer)
    const imageBuffer = file.buffer;

    // Aquí puedes agregar la lógica para almacenar en MySQL
    // Por ejemplo, usar un servicio para guardar en la base de datos
    // await this.fileService.saveFileToDatabase(body, imageBuffer);

    return {
      message: 'Formulario recibido exitosamente',
      imageSize: file.size,
      imageType: file.mimetype,
      company: body.company,
      phone: body.phone,
      email: body.email,
    };
  }
}
