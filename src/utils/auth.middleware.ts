import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(' ')[1]; // Token en el formato "Bearer <token>"

        if (token) {
            try {
                const decodedToken = jwt.verify(token, 'your-secret-key') as any; // Reemplaza con tu clave secreta
                req['user'] = decodedToken; // Adjunta los datos decodificados del usuario a la solicitud
            } catch (error) {
                // Maneja el error de token inválido
            }
        }

        next(); // Continúa con el siguiente middleware o controlador
    }
}

