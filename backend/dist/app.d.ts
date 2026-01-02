import Fastify from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
/**
 * Создает и настраивает экземпляр Fastify, готовый к запуску.
 */
export declare function buildApp(): Promise<Fastify.FastifyInstance<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, Fastify.FastifyBaseLogger, TypeBoxTypeProvider>>;
//# sourceMappingURL=app.d.ts.map