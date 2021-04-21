import { Middleware, Context } from 'telegraf';
import { Container } from '../container';

export interface IBotOptions {
    bot?: any;
    token?: string;
    container?: Container;
    controllers: Function[] | string[];
    session?: any | false;
    stage?: any;
    beforeMiddleware?: Middleware<Context>;
    afterMiddleware?: Middleware<Context>;
}
