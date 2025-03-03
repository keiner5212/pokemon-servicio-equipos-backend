import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl } = req;
        const startTime = Date.now();

        let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        if (typeof ip === 'string' && ip.includes(',')) {
            ip = ip.split(',')[0];
        }
        if (ip === '::1' || ip === '::ffff:127.0.0.1') {
            ip = '127.0.0.1';
        }

        const userAgent = req.headers['user-agent'] || 'Unknown';

        res.on('finish', () => {
            const duration = Date.now() - startTime;
            const statusCode = res.statusCode;

            this.logger.log(
                `${method} ${originalUrl} [${statusCode}] - ${duration}ms - IP: ${ip?.toString()} - User-Agent: ${userAgent}`
            );
        });

        next();
    }
}
