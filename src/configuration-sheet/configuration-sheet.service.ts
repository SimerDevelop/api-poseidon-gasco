import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigurationSheet } from './entities/configuration-sheet.entity';
import { ResponseUtil } from 'src/utils/response.util';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ConfigurationSheetService {

  constructor(
    @InjectRepository(ConfigurationSheet) private configurationSheetRepository: Repository<ConfigurationSheet>,
  ) { }

  async create(configurationSheetData: any): Promise<any> {
    try {
      if (configurationSheetData) {
        const existingConfigurationSheet = await this.configurationSheetRepository.findOne({
          where: { company: configurationSheetData.company },
        });

        if (existingConfigurationSheet) {
          return ResponseUtil.error(400, 'La Hoja de configuración ya existe');
        }

        // Procesar la imagen
        const file = configurationSheetData.image;
        if (!file) {
          throw new Error('Imagen no proporcionada');
        }

        const allowedMimeTypes = ['image/png', 'image/jpeg'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          throw new Error('Formato de imagen no soportado');
        }

        // Crear la Hoja de configuración
        const newConfigurationSheet = this.configurationSheetRepository.create({
          ...configurationSheetData,
          id: uuidv4(), // Generar un nuevo UUID
          state: 'ACTIVO',
          image: file.buffer, // Almacenar el buffer de la imagen en la base de datos
        });

        const createdConfigurationSheet = await this.configurationSheetRepository.save(newConfigurationSheet);

        if (createdConfigurationSheet) {
          return ResponseUtil.success(
            200,
            'Hoja de configuración creada exitosamente',
            createdConfigurationSheet,
          );
        } else {
          return ResponseUtil.error(400, 'Ha ocurrido un problema al crear la Hoja de configuración');
        }
      }
    } catch (error) {
      console.log(error);

      return ResponseUtil.error(500, 'Error al crear la Hoja de configuración', error.message);
    }
  }


  async findAll(): Promise<any> {
    try {
      const ConfigurationSheets = await this.configurationSheetRepository.find({

      });

      if (ConfigurationSheets.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Hojas de configuración'
        );
      }

      return ResponseUtil.success(
        200,
        'Hojas de configuración encontradas',
        ConfigurationSheets
      );

    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener las Hojas de configuración'
      );
    }
  }

  async findOne(id: string) {
    try {
      const ConfigurationSheet = await this.configurationSheetRepository.findOne({
        where: { id },
      });

      if (ConfigurationSheet) {
        return ResponseUtil.success(
          200,
          'Hoja de configuración encontrada',
          ConfigurationSheet
        );
      } else {
        return ResponseUtil.error(
          404,
          'Hoja de configuración no encontrada'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener la Hoja de configuración'
      );
    }
  }

  async update(id, configurationSheetData) {
    try {
      const existingConfigurationSheet = await this.configurationSheetRepository.findOne({
        where: { id },
      });

      if (!existingConfigurationSheet) {
        return ResponseUtil.error(
          400,
          'Hoja de configuración no encontrada'
        );
      }

      const updatedConfigurationSheet = await this.configurationSheetRepository.save({
        ...existingConfigurationSheet,
        ...configurationSheetData,
      });

      if (updatedConfigurationSheet) {
        return ResponseUtil.success(
          200,
          'Hoja de configuración actualizada exitosamente',
          updatedConfigurationSheet
        );
      }

    } catch (error) {
      return ResponseUtil.error(
        404,
        'Hoja de configuración no encontrada'
      );
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const existingConfigurationSheet = await this.configurationSheetRepository.findOne({
        where: { id },
      });

      if (!existingConfigurationSheet) {
        return ResponseUtil.error(404, 'Hoja de configuración no encontrada');
      }

      existingConfigurationSheet.state = 'INACTIVO';
      const updatedConfigurationSheet = await this.configurationSheetRepository.save(existingConfigurationSheet);

      if (updatedConfigurationSheet) {
        return ResponseUtil.success(
          200,
          'Hoja de configuración eliminada exitosamente',
          updatedConfigurationSheet
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar la Hoja de configuración'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar la Hoja de configuración'
      );
    }
  }

  async activate(id: string): Promise<any> {
    try {
      const existingConfigurationSheet = await this.configurationSheetRepository.findOne({
        where: { id },
      });

      if (!existingConfigurationSheet) {
        return ResponseUtil.error(404, 'Hoja de configuración no encontrada');
      }

      existingConfigurationSheet.state = 'ACTIVO';
      const updatedConfigurationSheet = await this.configurationSheetRepository.save(existingConfigurationSheet);

      if (updatedConfigurationSheet) {
        return ResponseUtil.success(
          200,
          'Hoja de configuración eliminada exitosamente',
          updatedConfigurationSheet
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar la Hoja de configuración'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar la Hoja de configuración'
      );
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Procesar la imagen en formato Base64 a Buffer
   * @param imageData string | Buffer
   * @returns Buffer
  */
  private processImage(imageData: any): Buffer {
    if (typeof imageData === 'string') {
      // Si la imagen llega en formato Base64
      const base64String = imageData.split(',')[1]; // Extraer el contenido Base64
      return Buffer.from(base64String, 'base64');
    } else if (imageData instanceof Buffer) {
      // Si ya es un Buffer, retornarlo directamente
      return imageData;
    } else {
      throw new Error('Formato de imagen no soportado.');
    }
  }
}
