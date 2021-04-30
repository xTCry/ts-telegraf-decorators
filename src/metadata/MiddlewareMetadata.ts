import { TFIMiddleware } from '..';

export interface MiddlewareMetadata {
    type: 'class' | 'method';
    target: Function;
    middleware: { new (...args: any[]): TFIMiddleware };
}
