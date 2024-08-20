import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Bill } from './entities/bill.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import { MailerService } from 'src/utils/mailer.service';
import { v4 as uuidv4 } from 'uuid';
import { BranchOffices } from 'src/branch-offices/entities/branch-office.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Client } from 'src/clients/entities/client.entity';
import { PDFGenerator } from 'src/utils/pdfgenerator.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Notification } from 'src/notifications/entities/notification.entity';
import { CommonService } from 'src/common-services/common.service';
import { RequestService } from 'src/request/request.service';
import { Request } from 'src/request/entities/request.entity';
import * as moment from 'moment-timezone';
import { LogReportService } from 'src/log-report/log-report.service';
import { LogReport } from 'src/log-report/entities/log-report.entity';

function transformDate(dateStr) {
  const [day, month, year] = dateStr.split('/');
  return `${'20' + year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

@Injectable()
export class BillService {

  constructor(
    @InjectRepository(Bill) private billRepository: Repository<Bill>,
    @InjectRepository(BranchOffices) private branchOfficeRepository: Repository<BranchOffices>,
    @InjectRepository(Usuario) private userRepository: Repository<Usuario>,
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    @InjectRepository(Request) private requestRepository: Repository<Request>,
    @InjectRepository(Notification) private notificationRepository: Repository<Notification>,
    @InjectRepository(LogReport) private logReportRepository: Repository<LogReport>,
    @Inject(NotificationsService) private notificationsService: NotificationsService,
    @Inject(UsuariosService) private userService: UsuariosService,
    private commonService: CommonService,
    private requestService: RequestService,
    private logReportService: LogReportService
  ) { }

  async create(billData: Bill): Promise<any> {

    console.log('==================BillData===================');
    console.log(billData);
    console.log('=============================================');

    try {
      const userId = billData.operator.toString();

      if (billData.charge.masaTotal <= 0) {
        let data = {
          code_event: 1,
          userId: userId,
        }

        const logReport = this.logReportRepository.create({
          ...data
        });

        await this.logReportService.create(logReport);
        
        return ResponseUtil.error(
          401,
          'La masa no puede ser menor o igual a 0, se ha creado un informe de error',
        );
      }

      const existingUser = await this.userService.findUserById(userId);

      if (existingUser.statusCode != 200) {
        const response = ResponseUtil.error(400, 'Usuario no válido');
        console.log("Usuario inválido");
        return response;
      }

      const existingBill = await this.billRepository
        .createQueryBuilder("bill")
        .where("JSON_EXTRACT(bill.charge, '$.fechaInicial') = :fechaInicial", { fechaInicial: billData.charge.fechaInicial })
        .andWhere("JSON_EXTRACT(bill.charge, '$.horaInicial') = :horaInicial", { horaInicial: billData.charge.horaInicial })
        .getOne();

      if (existingBill) {
        const response = ResponseUtil.error(400, 'La factura ya existe');
        console.log('===================== FACTURA EXISTENTE ========================');
        console.log(response);
        return response;
      }

      // Generación de código Unico para la factura
      var bill_code = await this.generateUniqueCode();

      var existing_code = await this.billRepository.findOne({
        where: {
          bill_code: bill_code
        },
      });

      while (existing_code) {
        // Generar un nuevo código único
        const new_code = await this.generateUniqueCode();
        // Verificar si ya existe un permiso con el nuevo nombre
        existing_code = await this.billRepository.findOne({
          where: {
            bill_code: new_code
          },
        });

        // Asignar el nuevo código único a la variable branch_office_code
        bill_code = new_code;
      }

      const branchOfficeId = billData.branch_office;

      const branch_office = await this.branchOfficeRepository.findByIds(
        billData.branch_office
      );

      const operator = await this.userRepository.findByIds(
        billData.operator
      );

      const client = await this.clientRepository.findByIds(
        billData.client
      );

      const total = branch_office[0].kilogramValue * billData.charge.masaTotal

      const formattedFecha = formatFecha(billData.charge.fechaInicial, billData.charge.horaInicial);

      const fechaInicial = formatFecha(billData.charge.fechaInicial, billData.charge.horaInicial);
      const fechaFinal = formatFecha(billData.charge.fechaFinal, billData.charge.horaFinal);

      const fechaInicialMoment = moment(fechaInicial, 'YYYY-MM-DD HH:mm:ss');
      const fechaFinalMoment = moment(fechaFinal, 'YYYY-MM-DD HH:mm:ss');

      const duration = Math.abs(fechaFinalMoment.diff(fechaInicialMoment));     

      const service_time = msToTime(duration);

      if (billData) {
        const newBill = this.billRepository.create({
          ...billData,
          id: uuidv4(), // Generar un nuevo UUID
          bill_code: bill_code,
          branch_office_name: branch_office[0].name,
          branch_office_nit: branch_office[0].nit,
          branch_office_address: branch_office[0].address,
          branch_office_code: branch_office[0].branch_office_code,
          client_firstName: client[0].firstName,
          client_lastName: client[0].lastName,
          client_cc: client[0].cc,
          operator_firstName: operator[0].firstName,
          operator_lastName: operator[0].lastName,
          densidad: billData.charge.densidad,
          temperatura: billData.charge.temperatura,
          masaTotal: parseFloat(billData.charge.masaTotal),
          volumenTotal: billData.charge.volumenTotal,
          horaInicial: billData.charge.horaInicial,
          horaFinal: billData.charge.horaFinal,
          fechaInicial: billData.charge.fechaInicial,
          fechaFinal: billData.charge.fechaFinal,
          fecha: formattedFecha,
          service_time: service_time,
          total: total,
        });

        const createdBill = await this.billRepository.save(newBill);

        console.log('===================== FACTURA CREADA ========================');
        console.log(createdBill);
        console.log('=============================================================');

        if (createdBill) {
          this.updateStatus(branchOfficeId);
          PDFGenerator.generatePDF(createdBill); // Llama al generador de PDF
          MailerService.sendEmail(createdBill, client[0].email);

          const notificationData = this.notificationRepository.create({
            status: "NO LEIDO",
            message: `Se ha creado una nueva remisión con el código ${createdBill.id} en el establecimiento ${createdBill.branch_office_name}`,
            title: `Nueva remisión en ${createdBill.branch_office_name}`,
            type: "CARGUE",
            intercourse: createdBill.id
          })

          this.notificationsService.create(notificationData);

          const statusBranchOffice = {
            "status": "CARGADO"
          }

          const statusOrder = {
            "status": "FINALIZADO"
          }

          const data_series = {
            densidad: billData.charge.densidad,
            temperatura: billData.charge.temperatura,
            masaTotal: billData.charge.masaTotal,
            volumenTotal: billData.charge.volumenTotal,
            fechaInicial: fechaInicial,
            fechaFinal: fechaFinal,
            service_time: service_time,
            total: total,
          }

          const requestData = this.requestRepository.create({
            folio: billData.folio,
            payment_type: billData.payment_type,
            plate: billData.plate,
            idNumber: operator[0].idNumber,
            branch_office_code: branch_office[0].branch_office_code,
            data_series: data_series
          });

          await this.requestService.create(requestData);
          const responseUpdateStatus = await this.commonService.updateBranchOfficeStatus(branchOfficeId, statusBranchOffice);

          if (responseUpdateStatus.statusCode == 200) {
            this.commonService.findCoursesByOperatorNameAndLastName(createdBill.operator_firstName, createdBill.operator_lastName);
            this.commonService.updateOrder(createdBill.folio, statusOrder);
          }

          return ResponseUtil.success(
            200,
            'Factura creada exitosamente',
            createdBill
          );

        } else {
          return ResponseUtil.error(
            400,
            'Ha ocurrido un problema al crear la factura',
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Ha ocurrido un error al crear la factura',
        error.message
      );
    }
  }

  async createMultiple(billData: any): Promise<any> {
    for (let i = 0; i < billData.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Espera 1 segundo
      this.create(billData[i]);
    }

    return ResponseUtil.success(
      200,
      'Facturas creadas exitosamente'
    );
  }

  async findAll(): Promise<any> {
    try {
      const bills = await this.billRepository.find({
        relations: [
          'branch_office',
          'branch_office.city',
          'branch_office.city.department',
          'branch_office.zone',

          'operator',
          'operator.role',

          'client',
          'client.occupation',
        ]
      })

      if (!bills) {
        return ResponseUtil.error(
          400,
          'No se han encontrado facturas'
        );
      }

      return ResponseUtil.success(
        200,
        'facturas encontradas',
        bills
      );

    } catch (error) {
      return ResponseUtil.error(
        500,
        'Ha ocurrido un error al obtener las facturas',
      );
    }
  }

  async findOne(id: string) {
    try {
      const bill = await this.billRepository.findOne({
        where: { id },
        relations: [
          'branch_office',
          'branch_office.city',
          'branch_office.city.department',
          'branch_office.zone',

          'operator',
          'operator.role',

          'client',
          'client.occupation',
        ]
      });

      if (bill) {
        return ResponseUtil.success(
          200,
          'Factura encontrada',
          bill
        );
      } else {
        return ResponseUtil.error(
          404,
          'Factura no encontrada'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener la Factura'
      );
    }
  }

  async update(id, billData) {
    try {
      const existingBill = await this.billRepository.findOne({
        where: { id },
      });

      console.log(billData);

      if (!existingBill) {
        throw new NotFoundException('Factura no encontrada');
      }

      const branch_office = await this.branchOfficeRepository.findByIds(
        billData.branch_office
      );

      const operator = await this.userRepository.findByIds(
        billData.operator
      );

      const client = await this.clientRepository.findByIds(
        billData.client
      );

      const updatedBill = await this.billRepository.save({
        ...existingBill,
        ...billData,
        branch_office: branch_office,
        operator: operator,
        client: client
      });

      return ResponseUtil.success(
        200,
        'Factura actualizada exitosamente',
        updatedBill
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Factura no encontrada'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar la Factura'
      );
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const existingBill = await this.billRepository.findOne({
        where: { id },
      });

      if (!existingBill) {
        return ResponseUtil.error(404, 'Factura no encontrada');
      }

      existingBill.status = 'INACTIVO';
      const updatedBill = await this.billRepository.save(existingBill);

      if (updatedBill) {
        return ResponseUtil.success(
          200,
          'Factura eliminada exitosamente',
          updatedBill
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al eliminar la Factura'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al eliminar la Factura'
      );
    }
  }


  ///////////////////////////////////////////////////////////////////////////////////

  async findByDate(branchOfficeCode: number, billData: any): Promise<any> {
    try {
      const startDate = "01/" + billData.date;
      const endDate = "31/" + billData.date;

      const startDateFormat = transformDate(startDate);
      const endDateFormat = transformDate(endDate);

      const bills = await this.billRepository
        .createQueryBuilder('bill')
        .where('branch_office_code = :branchOfficeCode', { branchOfficeCode })
        .andWhere("fechaInicial >= :startDateFormat", { startDateFormat })
        .andWhere("fechaInicial <= :endDateFormat", { endDateFormat })
        .getMany();

      if (bills.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado facturas'
        );
      }

      return ResponseUtil.success(
        200,
        'Facturas encontradas',
        bills
      );

    } catch (error) {
      return ResponseUtil.error(
        500,
        'Ha ocurrido un error al obtener facturas',
        error.message
      );
    }
  }

  async findBillsByBranchOffice(branchOfficeCode: number): Promise<any> {
    try {
      const bills = await this.billRepository
        .createQueryBuilder('bill')
        .where('branch_office_code = :branchOfficeCode', { branchOfficeCode })
        .getMany();

      bills.forEach(item => {
        const dateInBogota = moment.tz(item.fecha, 'America/Bogota').subtract(5, 'hours');
        const formattedDate = dateInBogota.format('YYYY-MM-DD HH:mm:ss');
        item.fecha = new Date(formattedDate);
      });

      if (bills.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado facturas'
        );
      }

      return ResponseUtil.success(
        200,
        'Facturas encontradas',
        bills
      );

    } catch (error) {
      return ResponseUtil.error(
        500,
        'Ha ocurrido un error al obtener facturas',
        error.message
      );
    }
  }

  async findBillsByOperator(operatorId: string): Promise<any> {
    try {

      const bills = await this.billRepository
        .createQueryBuilder('bill')
        .where('operator.id = :operatorId', { operatorId })
        .getMany();

      if (bills.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado facturas'
        );
      }

      return ResponseUtil.success(
        200,
        'Facturas encontradas',
        bills
      );

    } catch (error) {
      return ResponseUtil.error(
        500,
        'Ha ocurrido un error al obtener facturas'
      );
    }

  }

  async updateStatus(id: any): Promise<any> {
    try {
      const existingBranchOffice = await this.branchOfficeRepository.findOne({
        where: { id },
      });

      if (!existingBranchOffice) {
        return ResponseUtil.error(404, 'Sucursal no encontrada');
      }

      existingBranchOffice.status = 'EFECTIVO';
      const updatedBranchOffice = await this.branchOfficeRepository.save(existingBranchOffice);

      if (updatedBranchOffice) {
        return ResponseUtil.success(
          200,
          'Sucursal actualizada exitosamente',
          updatedBranchOffice
        );
      } else {
        return ResponseUtil.error(
          500,
          'Ha ocurrido un problema al actualizar la Sucursal'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al actualizar la Sucursal'
      );
    }
  }

  private async generateUniqueCode(): Promise<number> {
    let uniqueBillCodeGenerated = false;
    let newBillCode: number = 1;
    while (!uniqueBillCodeGenerated) {
      const existingBill = await this.billRepository.findOne({
        where: { bill_code: newBillCode },
      });
      if (!existingBill) {
        uniqueBillCodeGenerated = true;
      } else {
        newBillCode += 1;
        if (newBillCode > 999999) {
          throw new Error("No more unique codes can be generated.");
        }
      }
    }
    return newBillCode;
  }

}

function formatFecha(fechaInicial: string, horaInicial: string): string {
  const [day, month, year] = fechaInicial.split("/");
  const [hour, minute, second] = horaInicial.split(":");
  const paddedDay = day.padStart(2, '0');
  const paddedMonth = month.padStart(2, '0');
  const paddedHour = hour.padStart(2, '0');
  const paddedMinute = minute.padStart(2, '0');
  const paddedSecond = second.padStart(2, '0');
  const fechaString = `20${year}-${paddedMonth}-${paddedDay}T${paddedHour}:${paddedMinute}:${paddedSecond}`;
  const fecha = moment.tz(fechaString, 'America/Bogota');

  const formattedFecha = fecha.format('YYYY-MM-DD HH:mm:ss');
  return formattedFecha;
}

function msToTime(duration: number) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  const hoursStr = (hours < 10) ? "0" + hours : hours;
  const minutesStr = (minutes < 10) ? "0" + minutes : minutes;
  const secondsStr = (seconds < 10) ? "0" + seconds : seconds;

  return hoursStr + ":" + minutesStr + ":" + secondsStr;
}
