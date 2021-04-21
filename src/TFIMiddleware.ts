import { TelegrafContext } from 'telegraf/typings/context';

export interface TFIMiddleware<TC extends TelegrafContext> {
    use(ctx: TC, next: (...args: any[]) => Promise<any>): void;
}
