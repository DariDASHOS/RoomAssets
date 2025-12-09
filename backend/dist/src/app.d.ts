import Fastify from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type { PrismaClient } from './generated/prisma/client.js';
declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}
/**
 * Создает и настраивает экземпляр Fastify, готовый к запуску.
 */
export declare function buildApp(): Promise<Fastify.FastifyInstance<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, Fastify.FastifyBaseLogger, TypeBoxTypeProvider>>;
//# sourceMappingURL=app.d.ts.map