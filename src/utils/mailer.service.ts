import { enviroment } from 'src/utils/environment.prod'
import { join } from 'path';
import { Bill } from 'src/bill/entities/bill.entity';
import { Order } from 'src/orders/entities/order.entity';
import * as nodemailer from 'nodemailer';
import { ConfigurationSheetService } from 'src/configuration-sheet/configuration-sheet.service';
import * as fs from 'fs';
import * as path from 'path';

export class MailerService {
    static sendEmail(bill: Bill, clientEmail: string, dataEmail: any) {
        const company = dataEmail.company;
        const companyEmail = dataEmail.email;
        const companyPhone = dataEmail.phone;
        const companyCountry = dataEmail.country;
        const companyCode = dataEmail.country_code;

        // Verificar que la imagen esté presente
        if (!dataEmail.image) {
            console.error('La imagen no está definida');
            return;
        }

        const imageBuffer = Buffer.from(dataEmail.image); // Convertir el array de datos a Buffer
        const imageBase64 = imageBuffer.toString('base64'); // Convertir el Buffer a base64
        const imageMimeType = 'image/png'; // Ajusta el tipo MIME según sea necesario

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
            subject: `${company} | Remisión Establecimiento: ${bill.branch_office_name}`,
            html: `
                     <!DOCTYPE html>
                    <html>

                    <body>
                        <p><span style="font-size: 22px; color: #014e87; text-shadow: rgba(136, 136, 136, 0.7) 0px 2px 2px; font-weight: bold;">${company}</span></p>
                        <p style="text-align: start;color: #fff;font-size: 16px;border: 0px solid rgb(217, 217, 227);"><span style="color: rgb(0, 0, 0);">Estimado/a ${bill.client_firstName} ${bill.client_lastName},</span></p>
                        <p style="text-align: start;color: #fff;font-size: 16px;border: 0px solid rgb(217, 217, 227);"><span style="color: rgb(0, 0, 0);">Es un placer informarte que hemos completado exitosamente el cargue de producto en su establecimiento ${bill.branch_office_name} relacionado con tu solicitud. Esta remisi&oacute;n ha sido asignada con el n&uacute;mero <span style="font-weight: bold; color: #dc3545">${bill.bill_code}</span>, y contiene detalles precisos sobre los productos/servicios remitidos.</span></p>
                        <p style="text-align: start;color: #fff;font-size: 16px;border: 0px solid rgb(217, 217, 227);"><span style="color: rgb(0, 0, 0);">A continuaci&oacute;n, encontrar&aacute;s un resumen de la remisi&oacute;n:</span></p>
                        <ul style="text-align: start;color: #fff;font-size: 16px;border: 0px solid rgb(217, 217, 227); margin-bottom: 100px;">
                            <li style="color: rgb(0, 0, 0); border: 0px solid rgb(217, 217, 227); font-weight: bold;">Remisión ${bill.bill_code}</li>
                            <li style="color: rgb(0, 0, 0); border: 0px solid rgb(217, 217, 227);">Establecimiento: ${bill.branch_office_name} | NIT: ${bill.branch_office_nit}</li>
                            <li style="color: rgb(0, 0, 0); border: 0px solid rgb(217, 217, 227);">Fecha: ${bill.create}</li>
                            <li style="color: rgb(0, 0, 0); border: 0px solid rgb(217, 217, 227);">Cantidad: ${formattedCharge}Kg | GLP</li>
                        </ul> 
                        <br>
                        <p style="color: #9b9b9b; font-size: 13px; text-align: center; width: 35%; margin: 0 auto; border: 1px dashed #9b9b9b; padding: 1.5rem; border-radius: 5px">
                        <span style="font-weight: bold;">Nota:</span> Esta información refleja la actividad de suministro de GLP realizada en su establecimiento. Para obtener más detalles, comuníquese directamente con su proveedor, ${company}.
                        </p>
                        <div style="text-align: center; margin-top: 100px">
                            <p style="background: #f6f6f6; width: 70%; margin: 0 auto; padding: 1.3rem; border-radius: 5px; font-size: 13px; color: #9b9b9b">
                                <span style="font-size: 16px; color: #014e87; font-weight: bold;">${company}</span>
                                <br>
                                <span>${companyEmail}</span>
                                <br>
                                <span>(${companyCode}) ${companyPhone}</span>
                                <br>
                            </p>
                        </div>
                        <br>
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 70%; margin: 0 auto;">
                            <div style="margin: 0 auto">
                                <img src="cid:companyLogo" style="width: 300px;">
                            </div>
                            <div style="margin: 0 auto">
                                <img src="http://172.105.153.203/assets/images/firma_simer.png" style="width: 300px;">
                            </div>
                        </div>
                    </body>

                    </html>           
            `,
            attachments: [
                {
                    filename: `remisión_${bill.id}.pdf`,
                    path: join(enviroment.srcDir, 'pdf', `bill_${bill.id}.pdf`),
                    cid: 'Remisión'
                },
                {
                    filename: `${company}.png`,
                    content: imageBuffer,
                    cid: 'companyLogo' // Referencia del CID en el HTML
                }
            ]
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log(`Email Enviado a ${bill.client_firstName} ${bill.client_lastName} | Email sent: ${info.response}`);
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

    static sendToken(order: Order, clientEmail: string, dataEmail: any) {
        const company = dataEmail.company;
        const companyEmail = dataEmail.email;
        const companyPhone = dataEmail.phone;
        const companyCountry = dataEmail.country;
        const companyCode = dataEmail.country_code;

        // Verificar que la imagen esté presente
        if (!dataEmail.image) {
            console.error('La imagen no está definida');
            return;
        }

        const imageBuffer = Buffer.from(dataEmail.image); // Convertir el array de datos a Buffer
        const imageBase64 = imageBuffer.toString('base64'); // Convertir el Buffer a base64
        const imageMimeType = 'image/png'; // Ajusta el tipo MIME según sea necesario

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
                subject: `${company} | Token de validación para cargue`,
                html: `
                    <!DOCTYPE html>
                    <html>

                    <body>
                        <p><span style="font-size: 22px; color: #014e87; text-shadow: rgba(136, 136, 136, 0.7) 0px 2px 2px; font-weight: bold;">${company}</span></p>
                        <p style="text-align: start;color: #fff;font-size: 16px;border: 0px solid rgb(217, 217, 227);">
                            <span style="color: rgb(0, 0, 0);">Estimado/a cliente ${order.branch_office.client[0].firstName} ${order.branch_office.client[0].lastName},</span>
                        </p>
                        <p style="text-align: start;color: #fff;font-size: 16px;border: 0px solid rgb(217, 217, 227); margin-bottom: 50px;">
                            <span style="color: rgb(0, 0, 0);">Su token de validación para su cargue es <span style="font-weight: bold; color: #dc3545">${order.token}</span>
                            </span>
                        </p>
                        <p style="color: #9b9b9b; font-size: 13px; text-align: center; width: 35%; margin: 0 auto; border: 1px dashed #9b9b9b; padding: 1.5rem; border-radius: 5px">
                            <span style="font-weight: bold;">Nota:</span> Por favor, comparta esta información únicamente si es requerida por el operario de ${company}. Este elemento es un validador necesario para llevar a cabo la entrega de GLP en su establecimiento. Para
                            más información, comuníquese directamente con su proveedor, ${company}.
                        </p>
                        <br>
                        <div style="text-align: center; margin-top: 100px">
                            <p style="background: #f6f6f6; width: 70%; margin: 0 auto; padding: 1.3rem; border-radius: 5px; font-size: 13px; color: #9b9b9b">
                                <span style="font-size: 16px; color: #014e87; font-weight: bold;">${company}</span>
                                <br>
                                <span>${companyEmail}</span>
                                <br>
                                <span>(${companyCode}) ${companyPhone}</span>
                                <br>
                            </p>
                        </div>
                        <br>
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 70%; margin: 0 auto;">
                            <div style="margin: 0 auto">
                                <img src="cid:companyLogo" style="width: 300px;">
                            </div>
                            <div style="margin: 0 auto">
                                <img src="http://172.105.153.203/assets/images/firma_simer.png" style="width: 300px;">
                            </div>
                        </div>
                    </body>

                    </html>
                `,
                attachments: [
                    {
                        filename: `${company}.png`,
                        content: imageBuffer,
                        cid: 'companyLogo' // Referencia del CID en el HTML
                    }
                ]
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(`Establecimiento: ${order.branch_office.name} | Token enviado a ${order.branch_office.client[0].firstName} ${order.branch_office.client[0].lastName} | Email sent: ${info.response}`);
                }
            });

        } catch (error) {
            console.log('Error sending token: ', error);
        }
    }

}
