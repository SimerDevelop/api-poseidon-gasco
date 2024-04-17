import * as path from 'path';
import { join } from 'path'

export class enviroment {

   // Ruta al ejecutable de Python

   //static pythonPath = 'C:\\Python\\python.exe' // Ruta común en sistemas Windows
   static pythonPath = '/usr/bin/python3.8'; // Ruta común en sistemas Linux

   // Ruta al ejecutable de Python

   //static srcDir = path.join(__dirname, '..', '..', 'src'); // Ruta absoluta a la carpeta src
   static srcDir = path.join(__dirname, '..', '..', 'backend'); // Ruta absoluta a la carpeta src

   //Ruta al archivo Python

   //static pythonScriptPath = join(process.cwd(), 'src', 'graphs', 'scripts', 'cumulative-purchase.py')
   static pythonScriptPath = join(process.cwd(), 'graphs', 'scripts', 'cumulative-purchase.py');
}
