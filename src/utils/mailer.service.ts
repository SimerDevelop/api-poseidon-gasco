import { enviroment } from 'src/utils/environment.prod'
import { join } from 'path';
import { Bill } from 'src/bill/entities/bill.entity';
import { Order } from 'src/orders/entities/order.entity';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

export class MailerService {
    static sendEmail(bill: Bill, clientEmail: string) {
        let transporter = nodemailer.createTransport({
            host: 'mail.simerelectronics.com',
            port: 465,
            secure: true, // Habilita SSL/TLS
            auth: {
                user: 'poseidon@simerelectronics.com',
                pass: 't;D*PHñ+6'
            }
        });

        // Función para formatear los números con separador de miles
        function formatNumberWithCommas(number: number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        const formattedCharge = formatNumberWithCommas(Math.floor(bill.charge.masaTotal)); // Formatear los kilos cargados
        const formattedTotal = formatNumberWithCommas(Math.floor(bill.total)); // Formatear el valor total sin decimales

        let mailOptions = {
            from: 'poseidon@simerelectronics.com',
            to: clientEmail,
            subject: `Remisión Establecimiento: ${bill.branch_office_name}`,
            html: `<p><span style="font-size: 22px; color: red; text-shadow: rgba(136, 136, 136, 0.7) 0px 2px 2px;">SIMER ELECTRONICS SAS.</span></p>
            <p style="text-align: start;color: #fff;font-size: 16px;border: 0px solid rgb(217, 217, 227);"><span style="color: rgb(0, 0, 0);">Estimado/a ${bill.client_firstName} ${bill.client_lastName},</span></p>
            <p style="text-align: start;color: #fff;font-size: 16px;border: 0px solid rgb(217, 217, 227);"><span style="color: rgb(0, 0, 0);">Es un placer informarte que hemos completado exitosamente el cargue de producto en su establecimiento ${bill.branch_office_name} relacionado con tu solicitud. Esta remisi&oacute;n ha sido asignada con el n&uacute;mero ${bill.id}, y contiene detalles precisos sobre los productos/servicios remitidos.</span></p>
            <p style="text-align: start;color: #fff;font-size: 16px;border: 0px solid rgb(217, 217, 227);"><span style="color: rgb(0, 0, 0);">A continuaci&oacute;n, encontrar&aacute;s un resumen de la remisi&oacute;n:</span></p>
            <ul style="text-align: start;color: #fff;font-size: 16px;border: 0px solid rgb(217, 217, 227); margin-bottom: 100px;">
                <li style="color: rgb(0, 0, 0); border: 0px solid rgb(217, 217, 227); font-weight: bold;">ID: ${bill.id}</li>
                <li style="color: rgb(0, 0, 0); border: 0px solid rgb(217, 217, 227);">Establecimiento: ${bill.branch_office_name}</li>
                <li style="color: rgb(0, 0, 0); border: 0px solid rgb(217, 217, 227);">NIT: ${bill.branch_office_nit}</li>
                <li style="color: rgb(0, 0, 0); border: 0px solid rgb(217, 217, 227);">Fecha: ${bill.create}</li>
                <li style="color: rgb(0, 0, 0); border: 0px solid rgb(217, 217, 227);">Cantidad: ${formattedCharge}Kg</li>
                <li style="color: rgb(0, 0, 0); border: 0px solid rgb(217, 217, 227);">Valor total: $${formattedTotal}</li>
            </ul>
            <img src="http://172.105.153.203/assets/images/firma_simer.png" style="width: 300px;">`,
            attachments: [{
                filename: `remisión_${bill.id}.pdf`,
                path: join(enviroment.srcDir, 'pdf', `bill_${bill.id}.pdf`),
                cid: 'Remisión'
            }]
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);

                const filename = `bill_${bill.id}.pdf`
                const filepath = join(enviroment.srcDir, 'pdf', filename)

                try {
                    fs.promises.unlink(filepath)
                } catch (err) {
                    throw new Error(
                        `Error al eliminar el archivo ${filename}: ${err.message}`,
                    )
                }
            }
        });
    }

    static sendToken(order: Order, clientEmail: string) {
        try {
            let transporter = nodemailer.createTransport({
                host: 'mail.simerelectronics.com',
                port: 465,
                secure: true, // Habilita SSL/TLS
                auth: {
                    user: 'poseidon@simerelectronics.com',
                    pass: 't;D*PHñ+6'
                }
            });

            let mailOptions = {
                from: 'poseidon@simerelectronics.com',
                to: clientEmail,
                subject: `Token de validación para cargue`,
                html: `<p><span style="font-size: 22px; color: #014e87; text-shadow: rgba(136, 136, 136, 0.7) 0px 2px 2px; font-weight: bold;">SIMER ELECTRONICS SAS.</span></p>
                <p style="text-align: start;color: #fff;font-size: 16px;border: 0px solid rgb(217, 217, 227);"><span style="color: rgb(0, 0, 0);">Estimado/a cliente ${order.branch_office.client[0].firstName} ${order.branch_office.client[0].lastName},</span></p>
                <p style="text-align: start;color: #fff;font-size: 16px;border: 0px solid rgb(217, 217, 227); margin-bottom: 100px;"><span style="color: rgb(0, 0, 0);">Su token de validación para su cargue es <span style="font-weight: bold; color: #dc3545">${order.token}</span></span></p>
                <img src="http://172.105.153.203/assets/images/firma_simer.png" style="width: 300px;">`,
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Token sent: ' + info.response, 'Token: ', order.token);
                }
            });

        } catch (error) {
            console.log('Error sending token: ', error);
        }

    }

}
