import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      const errorMessage = 'Encabezado de autorización no encontrado';
      return res.status(401).json({ statusCode: 401, message: errorMessage });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      const errorMessage = 'Token de autorización no encontrado';
      return res.status(401).json({ statusCode: 401, message: errorMessage });
    }

    try {
      const secret = this.configService.get<string>('SECRET_KEY_JWT');

      jwt.verify(token, secret);
      next();
    } catch (err) {
      console.error(err);
      const errorMessage = 'Token de autorización invalido';
      return res.status(401).json({ statusCode: 401, message: errorMessage });
    }
  }
}
