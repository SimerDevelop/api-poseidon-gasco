import { Bill } from 'src/bill/entities/bill.entity';
import { join } from 'path';
import { enviroment } from 'src/utils/environment.prod'
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';

export class PDFGenerator {
    static async generatePDF(bill: Bill): Promise<void> {
        // Crea un nuevo documento PDF
        const doc = new PDFDocument({ font: 'Courier', size: 'A8', margin: 15 });

        // Define el nombre del archivo PDF y el lugar donde se guardará
        const fileName = `bill_${bill.id}.pdf`;
        const filePath = join(enviroment.srcDir, 'pdf', fileName); // Agrega el nombre del archivo al directorio

        // Stream de escritura del archivo PDF
        const writeStream = fs.createWriteStream(filePath);

        // Función para formatear los números con separador de miles
        function formatNumberWithCommas(number: number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        const formattedTotal = formatNumberWithCommas(Math.floor(bill.total)); // Formatear el valor total sin decimales

        doc.pipe(writeStream);

        // Título "Remisión"
        doc.fontSize(9).text('Remisión', { align: 'center', bold: true });
        const originalColor = '#000000' // Guarda el color de relleno original
        doc.fillColor('#a2a2a2').fontSize(4).text('________________________________________________', { align: 'center' });
        // Restaurar el color original
        doc.fillColor(originalColor);

        // Datos del establecimiento y fecha de creación
        doc.moveDown().fontSize(5).text(`Establecimiento:`, { align: 'left' });
        doc.fontSize(5).text(`${bill.branch_office_name}`, { align: 'left' });

        doc.moveDown().fontSize(5).text(`NIT:`);
        doc.fontSize(5).text(`${bill.branch_office_nit}`);

        doc.moveDown().fontSize(5).text(`Código:`);
        doc.fontSize(5).text(`${bill.branch_office_code}`);

        doc.moveDown().fontSize(5).text(`Dirección:`);
        doc.fontSize(5).text(`${bill.branch_office_address}`);

        doc.moveUp(11).fontSize(5).text(`Fecha:`, { align: 'right' });
        doc.fontSize(5).text(`${bill.charge.fechaInicial}`, { align: 'right' });

        // Datos del cliente
        doc.moveDown().fontSize(5).text(`Cliente:`, { align: 'right' });
        doc.fontSize(5).text(`${bill.client_firstName} ${bill.client_lastName}`, { align: 'right' });

        doc.moveDown().fontSize(5).text(`CC:`, { align: 'right' });
        doc.fontSize(5).text(`${bill.client_cc}`, { align: 'right' });

        // Línea separadora
        // Datos del operario
        doc.fillColor('#a2a2a2').moveDown(4).fontSize(4).text('________________________________________________', { align: 'center' });
        doc.fillColor(originalColor);
        doc.moveDown().fontSize(5).text(`Operario: ${bill.operator_firstName} ${bill.operator_lastName}`);
        doc.fillColor('#a2a2a2').fontSize(4).text('________________________________________________', { align: 'center' });
        doc.fillColor(originalColor);

        // Fecha de inicio y fin
        doc.moveDown().fontSize(5).text(`Fecha Inicio/Fin: ${bill.fechaInicial} -- ${bill.fechaFinal}`);
        doc.moveDown().fontSize(5).text(`Hora Inicio/Fin: ${bill.horaInicial} -- ${bill.horaFinal}`);
        doc.fillColor('#a2a2a2').fontSize(4).text('________________________________________________', { align: 'center' });
        doc.fillColor(originalColor);

        // Datos de carga: Volumen, Densidad, Masa, Temperatura


        // Datos de carga: Volumen, Densidad, Masa, Temperatura
        doc.moveDown(3).fontSize(3).text('Datos de Carga:', { bold: true });

        // Headers de la tabla
        const headers = ['Volumen ', 'Densidad ', 'Masa ', 'Temperatura'];

        // Datos de la tabla
        const tableData = [
            [bill.volumenTotal, bill.densidad, bill.masaTotal, bill.temperatura]
        ];


        const columnWidths = [70, 70, 70, 70]; // Ancho de las columnas

        // Generar la tabla
        for (let i = 0; i < headers.length; i++) {
            doc.font('Courier-Bold').fontSize(3).text(headers[i], {
                width: columnWidths[i],
                align: 'left',
                continued: true,
            });
        }

        doc.moveDown().fontSize(2); // Espaciado entre headers y datos

        for (let row = 0; row < tableData.length; row++) {
            const rowData = tableData[row];
            for (let col = 0; col < rowData.length; col++) {
                doc.font('Courier').fontSize(3).text(rowData[col] + '  | ', {
                    width: columnWidths[col],
                    align: 'left',
                    continued: true,
                });
            }
            doc.moveDown(); // Espaciado entre filas
        }


        // Total
        doc.fillColor('#a2a2a2').fontSize(4).text('   ____________________', { width: 280 });
        doc.fillColor(originalColor);
        doc.font('Courier-Bold').moveDown().fontSize(5).text(`Total: $${formattedTotal}`, { bold: true, align: 'right' });

        // Finaliza la creación del PDF
        doc.end();

        // Escucha los eventos de cierre y error del stream de escritura
        writeStream.on('finish', () => {
            console.log(`PDF generado: ${filePath}`);
            // Aquí puedes enviar el PDF por correo electrónico o manejarlo según tus necesidades
        });

        writeStream.on('error', (error) => {
            console.error('Error al escribir el archivo PDF:', error);
        });
    }
}
