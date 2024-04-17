import { Injectable, NotFoundException } from '@nestjs/common';
import { Client } from './entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { v4 as uuidv4 } from 'uuid';
import { BranchOffices } from 'src/branch-offices/entities/branch-office.entity';
import { Occupation } from 'src/occupation/entities/occupation.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    @InjectRepository(Occupation) private occupationRepository: Repository<Occupation>,
  ) { }

  async create(clientData: Client): Promise<any> {
    try {

      const existingClient = await this.clientRepository.findOne({
        where: { cc: clientData.cc },
      });

      if (existingClient) {
        return ResponseUtil.error(
          400, 'El cliente ya existe'
        );
      }

      const occupation = await this.occupationRepository.findByIds(
        clientData.occupation
      );

      if (clientData) {
        const newClient = this.clientRepository.create({
          ...clientData,
          id: uuidv4(), // Generar un nuevo UUID
          state: 'ACTIVO',
          occupation: occupation
        });

        const createdClient = await this.clientRepository.save(newClient);

        if (createdClient) {
          return ResponseUtil.success(
            200,
            'Cliente creado exitosamente',
            createdClient
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear el Cliente'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear el Cliente'
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const clients = await this.clientRepository.find({
        where: { state: 'ACTIVO' },
        relations: ['occupation']
      });

      if (clients.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Clientes'
        );
      }

      return ResponseUtil.success(
        200,
        'Clientes encontrados',
        clients
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los Clientes'
      );
    }
  }

  async findOne(id: string) {
    try {
      const client = await this.clientRepository.findOne({
        where: { id },
        relations: ['occupation']
      });

      if (client) {
        return ResponseUtil.success(
          200,
          'Cliente encontrado',
          client
        );
      } else {
        return ResponseUtil.error(
          404,
          'Cliente no encontrado'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener el Cliente'
      );
    }
  }

  async update(id, clientData) {
    try {
      const existingClient = await this.clientRepository.findOne({
        where: { id },
      });

      if (!existingClient) {
        throw new NotFoundException('Cliente no encontrado');
      }

      const occupation = await this.occupationRepository.findByIds(
        clientData.occupation
      );

      const updatedClient = await this.clientRepository.save({
        ...existingClient,
        ...clientData,
        occupation: occupation
      });

      return ResponseUtil.success(
        200,
        'Cliente actualizado exitosamente',
        updatedClient
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Cliente no encontrado'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar el Cliente'
      );
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const existingClient = await this.clientRepository.findOne({
        where: { id },
      });

      if (!existingClient) {
        return ResponseUtil.error(404, 'Cliente no encontrado');
      }

      existingClient.state = 'INACTIVO';
      const updatedClient = await this.clientRepository.save(existingClient);

      if (updatedClient) {
        return ResponseUtil.success(
          200,
          'Cliente eliminado exitosamente',
          updatedClient
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar el Cliente'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar el Cliente'
      );
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////


  async getByBranchOfficeId(branchOfficeId: string): Promise<any> {
    try {

      console.log(branchOfficeId);
      
      const client = await this.clientRepository
        .createQueryBuilder('clients')
        .innerJoinAndSelect('clients.branch_office', 'branchOffice')
        .leftJoinAndSelect('clients.occupation', 'occupation')
        .where('branchOffice.id = :branchOfficeId', { branchOfficeId })
        .getMany();

      if (client.length < 1) {
        return ResponseUtil.error(
          400,
          'No se ha encontrado el Cliente'
        );
      }

      return ResponseUtil.success(
        200,
        'Cliente encontrado',
        client
      );

    } catch (error) {
      return ResponseUtil.error(
        500,
        'Ha ocurrido un error al obtener el Cliente'
      );
    }

  }

}
