import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BranchOffices } from './entities/branch-office.entity';
import { City } from 'src/city/entities/city.entity';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { v4 as uuidv4 } from 'uuid';
import { Zone } from 'src/zone/entities/zone.entity';
import { Factor } from 'src/factor/entities/factor.entity';
import { Client } from 'src/clients/entities/client.entity';
import { BillService } from 'src/bill/bill.service';
import { StationaryTank } from 'src/stationary-tank/entities/stationary-tank.entity';
import { StationaryTankService } from 'src/stationary-tank/stationary-tank.service';

@Injectable()
export class BranchOfficesService {

  constructor(
    @InjectRepository(BranchOffices) private branchOfficeRepository: Repository<BranchOffices>,
    @InjectRepository(City) private cityRepository: Repository<City>,
    @InjectRepository(Zone) private zoneRepository: Repository<Zone>,
    @InjectRepository(Factor) private factorRepository: Repository<Factor>,
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    @InjectRepository(StationaryTank) private stationaryTankRepository: Repository<StationaryTank>,
    private billService: BillService,
    private StationaryTankService: StationaryTankService,
  ) { }

  async create(branchOfficeData: BranchOffices): Promise<any> {
    try {
      if (branchOfficeData) {
        var branch_office_code = await this.generateUniqueBranch_office_code();

        var existingbranch_office_code = await this.branchOfficeRepository.findOne({
          where: {
            branch_office_code: branch_office_code
          },
        });

        while (existingbranch_office_code) {
          // Generar un nuevo código único
          const newbranch_office_code = await this.generateUniqueBranch_office_code();
          // Verificar si ya existe un permiso con el nuevo nombre
          existingbranch_office_code = await this.branchOfficeRepository.findOne({
            where: {
              branch_office_code: newbranch_office_code
            },
          });

          // Asignar el nuevo código único a la variable branch_office_code
          branch_office_code = newbranch_office_code;
        }
        
        const existingBranchOffice = await this.branchOfficeRepository.findOne({
          where: {
            nit: branchOfficeData.nit
          },
        });
        
        console.log(existingBranchOffice);

        if (existingBranchOffice) {
          return ResponseUtil.error(400, 'La sucursal ya existe');
        }

        const city = await this.cityRepository.findByIds(
          branchOfficeData.city
        );

        const zone = await this.zoneRepository.findByIds(
          branchOfficeData.zone
        );

        const factor = await this.factorRepository.findByIds(
          branchOfficeData.factor
        );

        const client = await this.clientRepository.findByIds(
          branchOfficeData.client
        );

        const stationary_tanks = await this.stationaryTankRepository.findByIds(
          branchOfficeData.stationary_tanks
        );


        const newBranchOffice = this.branchOfficeRepository.create({
          ...branchOfficeData,
          id: uuidv4(), // Generar un nuevo UUID
          state: 'ACTIVO',
          status: 'EFECTIVO',
          city: city,
          zone: zone,
          factor: factor,
          branch_office_code: branch_office_code,
          client: client,
          stationary_tanks: stationary_tanks
        });

        const createdBranchOffice = await this.branchOfficeRepository.save(newBranchOffice);

        if (createdBranchOffice) {
          const data: any = {
            status: "ASIGNADO"
          }

          const promises = branchOfficeData.stationary_tanks.map((stationary_tank, i) =>
            this.StationaryTankService.update(stationary_tank, data).then((response) => {
            })
          );
        }

        if (createdBranchOffice) {
          return ResponseUtil.success(
            200,
            'Sucursal creado exitosamente',
            createdBranchOffice
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear la sucursal'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear la sucursal',
        error
      );
    }
  }

  async createMultiple(data: any): Promise<any> {
    const createdIds = []; // Array para almacenar los IDs de las sucursales creadas

    for (let i = 0; i < data.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Espera 1 segundo
      const response = await this.create(data[i]);
      if (response.statusCode === 200) {
        createdIds.push(response.data.id);
      }
    }

    return ResponseUtil.success(
      200,
      'Establecimientos creados exitosamente',
      createdIds
    );
  }

  async createBranchOfficeForOperator(branchOfficeData: BranchOffices): Promise<any> {
    try {
      if (branchOfficeData) {
        var branch_office_code = await this.generateUniqueBranch_office_code();

        var existingbranch_office_code = await this.branchOfficeRepository.findOne({
          where: {
            branch_office_code: branch_office_code
          },
        });

        while (existingbranch_office_code) {
          // Generar un nuevo código único
          const newbranch_office_code = await this.generateUniqueBranch_office_code();
          // Verificar si ya existe un permiso con el nuevo nombre
          existingbranch_office_code = await this.branchOfficeRepository.findOne({
            where: {
              branch_office_code: newbranch_office_code
            },
          });

          // Asignar el nuevo código único a la variable branch_office_code
          branch_office_code = newbranch_office_code;
        }

        const existingBranchOffice = await this.branchOfficeRepository.findOne({
          where: {
            nit: branchOfficeData.nit
          },
        });

        if (existingBranchOffice) {
          return ResponseUtil.error(400, 'La sucursal ya existe');
        }

        const city = await this.cityRepository.findByIds(
          branchOfficeData.city
        );

        const zone = await this.zoneRepository.findByIds(
          branchOfficeData.zone
        );

        const factor = await this.factorRepository.findByIds(
          branchOfficeData.factor
        );

        const client = await this.clientRepository.findByIds(
          branchOfficeData.client
        );

        const newBranchOffice = this.branchOfficeRepository.create({
          ...branchOfficeData,
          id: uuidv4(), // Generar un nuevo UUID
          state: 'PENDIENTE',
          status: 'PENDIENTE',
          city: city,
          zone: zone,
          factor: factor,
          branch_office_code: branch_office_code,
          client: client
        });

        const createdBranchOffice = await this.branchOfficeRepository.save(newBranchOffice);

        if (createdBranchOffice) {
          return ResponseUtil.success(
            200,
            'Sucursal creado exitosamente',
            createdBranchOffice
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear la sucursal'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear la sucursal'
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const branchOffices = await this.branchOfficeRepository.find({
        where: { state: 'ACTIVO' },
        relations: [
          'city',
          'city.department',

          'client',
          'client.occupation',

          'zone',
          'factor',

          'stationary_tanks'
        ]
      });

      if (branchOffices.length < 1) {
        return ResponseUtil.error(400, 'No se han encontrado sucursales');
      }

      return ResponseUtil.success(200, 'Sucursales encontradas', branchOffices);
    } catch (error) {
      return ResponseUtil.error(500, 'Error al obtener las Sucursales');
    }
  }

  async findAllPending(): Promise<any> {
    try {
      const branchOffices = await this.branchOfficeRepository.find({
        where: { state: 'PENDIENTE' },
        relations: [
          'city',
          'city.department',

          'client',
          'client.occupation',

          'zone',
          'factor',

          'stationary_tanks'
        ]
      });

      if (branchOffices.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado sucursales'
        );
      }

      return ResponseUtil.success(
        200,
        'Sucursales encontradas',
        branchOffices
      );

    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener las Sucursales'
      );
    }
  }

  async findOne(id: any) {
    try {
      const branchOffice = await this.branchOfficeRepository.findOne({
        where: [
          { id: id },
          { branch_office_code: id }
        ],
        relations: [
          'city',
          'city.department',

          'client',
          'client.occupation',

          'zone',
          'factor',

          'stationary_tanks'
        ]
      });

      if (branchOffice) {
        return ResponseUtil.success(
          200,
          'Sucursal encontrado',
          branchOffice
        );

      } else {
        return ResponseUtil.error(
          404,
          'Sucursal no encontrado'
        );

      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener el Sucursal'
      );
    }
  }

  async update(id, branchOfficeData) {
    console.log('branchOfficeData', branchOfficeData);
    try {
      const existingBranchOffice = await this.branchOfficeRepository.findOne({
        where: { id },
        relations: [
          'city',
          'city.department',

          'client',
          'client.occupation',

          'zone',
          'factor'
        ]
      });

      if (!existingBranchOffice) {
        return ResponseUtil.error(
          400,
          'No se ha encontrado la sucursal'
        )
      }

      const city = await this.cityRepository.findByIds(
        branchOfficeData.city
      );

      const zone = await this.zoneRepository.findByIds(
        branchOfficeData.zone
      );

      const factor = await this.factorRepository.findByIds(
        branchOfficeData.factor
      );

      const client = await this.clientRepository.findByIds(
        branchOfficeData.client
      );

      const stationary_tanks = await this.stationaryTankRepository.findByIds(
        branchOfficeData.stationary_tanks
      );

      const updatedBranchOffice = await this.branchOfficeRepository.save({
        ...existingBranchOffice,
        ...branchOfficeData,
        state: 'ACTIVO',
        city: city,
        zone: zone,
        factor: factor,
        client: client,
        stationary_tanks: stationary_tanks
      });

      if (updatedBranchOffice) {
        const data: any = {
          status: "ASIGNADO"
        }

        const promises = branchOfficeData.stationary_tanks.map((stationary_tank, i) =>
          this.StationaryTankService.update(stationary_tank, data).then((response) => {
          })
        );
      }

      return ResponseUtil.success(
        200,
        'Sucursal actualizada exitosamente',
        updatedBranchOffice
      );

    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Sucursal no encontrada'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar la Sucursal'
      );
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const existingBranchOffice = await this.branchOfficeRepository.findOne({
        where: { id },
      });

      if (!existingBranchOffice) {
        return ResponseUtil.error(404, 'Sucursal no encontrada');
      }

      if (existingBranchOffice.status == 'EN CURSO' || existingBranchOffice.status == 'CARGADO') {
        return ResponseUtil.error(
          400,
          'No se puede eliminar una sucursal con estado EN CURSO o CARGADO'
        );
      }

      existingBranchOffice.state = 'INACTIVO';
      const updatedBranchOffice = await this.branchOfficeRepository.save(existingBranchOffice);

      if (updatedBranchOffice) {
        return ResponseUtil.success(
          200,
          'Sucursal eliminada exitosamente',
          updatedBranchOffice
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar la Sucursal'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar la Sucursal'
      );
    }
  }

  //////////////////////////////////////////////////////////////////////

  async approveBranchOffice(id: string): Promise<any> {
    try {
      const existingBranchOffice = await this.branchOfficeRepository.findOne({
        where: { id },
      });

      if (!existingBranchOffice) {
        return ResponseUtil.error(404, 'Sucursal no encontrada');
      }

      existingBranchOffice.state = 'ACTIVO';
      const updatedBranchOffice = await this.branchOfficeRepository.save(existingBranchOffice);

      if (updatedBranchOffice) {
        return ResponseUtil.success(
          200,
          'Sucursal aprobada exitosamente',
          updatedBranchOffice
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al aprobar la Sucursal'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al aprobar la Sucursal'
      );
    }
  }

  async findBranchOfficesWithBills(): Promise<any> {
    try {
      const branchOffices = await this.branchOfficeRepository.find({
        where: { state: 'ACTIVO' },
        relations: [
          'city',
          'city.department',
          'client',
          'client.occupation',
          'zone',
          'factor',
          'stationary_tanks'
        ]
      });

      if (branchOffices.length < 1) {
        return ResponseUtil.error(400, 'No se han encontrado sucursales');
      }

      const branchOfficesWithBills = [];

      const promises = branchOffices.map((branchOffice, i) =>
        this.billService.findBillsByBranchOffice(branchOffice.branch_office_code).then((response) => {
          const bills = response.data;

          if (response.statusCode == 200 && bills.length > 0) {
            branchOfficesWithBills.push(branchOffice);
          }
        })
      );

      await Promise.all(promises);

      if (branchOfficesWithBills.length < 1) {
        return ResponseUtil.error(400, 'No se han encontrado sucursales con facturas');
      }

      return ResponseUtil.success(200, 'Sucursales con facturas encontradas', branchOfficesWithBills);
    } catch (error) {
      return ResponseUtil.error(500, 'Error al obtener las Sucursales', error.message);
    }
  }

  private async generateUniqueBranch_office_code(): Promise<number> {
    let uniquebranch_office_codeGenerated = false;
    let newbranch_office_code: number;
    while (!uniquebranch_office_codeGenerated) {
      newbranch_office_code = Math.floor(Math.random() * 99999) + 1;
      const existingBranchOffice = await this.branchOfficeRepository.findOne({
        where: { branch_office_code: newbranch_office_code },
      });
      if (!existingBranchOffice) {
        uniquebranch_office_codeGenerated = true;
      }
    }
    return newbranch_office_code;
  }

  async getAvailableBranchOffices(): Promise<any> {
    try {
      const branchOffices = await this.branchOfficeRepository.find({
        where: { status: 'EFECTIVO', state: 'ACTIVO' },
        relations: [
          'city',
          'city.department',

          'client',
          'client.occupation',

          'zone',
          'factor',

          'stationary_tanks'
        ]
      });

      if (branchOffices.length < 1) {
        return ResponseUtil.error(400, 'No se han encontrado sucursales');
      }

      return ResponseUtil.success(200, 'Sucursales encontradas', branchOffices);
    } catch (error) {
      return ResponseUtil.error(500, 'Error al obtener las Sucursales');
    }
  }

  async updateStatus(id, branchOfficeData) {
    console.log('branchOfficeData', branchOfficeData);
    try {
      const existingBranchOffice = await this.branchOfficeRepository.findOne({
        where: [
          { id: id },
          { branch_office_code: id }
        ]
      });

      const updatedBranchOffice = await this.branchOfficeRepository.save({
        ...existingBranchOffice,
        ...branchOfficeData,
      });

      return ResponseUtil.success(
        200,
        'Sucursal actualizada exitosamente',
        updatedBranchOffice
      );

    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Sucursal no encontrada'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar la Sucursal'
      );
    }
  }

}


