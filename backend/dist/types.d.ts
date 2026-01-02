import type { FastifyError, FastifySchemaValidationError } from 'fastify';
import type { SchemaErrorDataVar } from 'fastify/types/schema.js';
import { Type as T, type Static } from 'typebox';
/**
 * Обёртка над стандартной ошибкой Fastify для случаев, когда схема запроса не проходит валидацию.
 * Мы расширяем Error, чтобы получить сообщение и stack trace, и одновременно реализуем FastifyError,
 * чтобы Fastify понимал код ошибки и корректно возвращал ответ клиенту.
 */
export declare class ValidationProblem extends Error implements FastifyError {
    readonly name = "ValidationError";
    readonly code = "FST_ERR_VALIDATION";
    readonly statusCode = 400;
    readonly validation: FastifySchemaValidationError[];
    readonly validationContext: SchemaErrorDataVar;
    /**
     * @param message Сообщение об ошибке, которое увидит клиент.
     * @param errs Подробные сведения о том, какие поля не прошли проверку схемы.
     * @param ctx Контекст (какая часть запроса проверялась: body, params и т.д.), полезно для логирования.
     * @param options Стандартные опции конструктора Error (причина ошибки, управление stack trace и т.д.).
     */
    constructor(message: string, errs: FastifySchemaValidationError[], ctx: SchemaErrorDataVar, options?: ErrorOptions);
}
export declare const ProblemDetails: T.TObject<{
    type: T.TString;
    title: T.TString;
    status: T.TInteger;
    detail: T.TOptional<T.TString>;
    instance: T.TOptional<T.TString>;
    errorsText: T.TOptional<T.TString>;
}>;
export type ProblemDetails = Static<typeof ProblemDetails>;
export declare const Room: T.TObject<{
    id: T.TString;
    name: T.TString;
    capacity: T.TInteger;
    features: T.TArray<T.TString>;
    createdAt: T.TString;
}>;
export type Room = Static<typeof Room>;
export declare const Asset: T.TObject<{
    id: T.TString;
    name: T.TString;
    inventoryCode: T.TOptional<T.TString>;
    status: T.TString;
    createdAt: T.TString;
}>;
export type Asset = Static<typeof Asset>;
export declare const Booking: T.TObject<{
    id: T.TString;
    resourceType: T.TString;
    resourceId: T.TString;
    title: T.TString;
    notes: T.TOptional<T.TString>;
    start: T.TString;
    end: T.TString;
    createdAt: T.TString;
}>;
export type Booking = Static<typeof Booking>;
export declare const Health: T.TObject<{
    ok: T.TBoolean;
}>;
export type Health = Static<typeof Health>;
//# sourceMappingURL=types.d.ts.map