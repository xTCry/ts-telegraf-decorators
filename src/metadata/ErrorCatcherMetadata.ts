import { TFIMiddleware } from "..";

export interface ErrorCatcherMetadata {
    type: 'class' | 'method';
    target: Function;
    handler: { new (...args: any[]): TFIMiddleware };
}
