import { Service } from 'typedi';
import { TFIMiddleware } from '../../src/TFIMiddleware';

@Service()
export class TestService {
    async getBotName(): Promise<string> {
        return 'My Bot';
    }
}

export class InteropMiddleware implements TFIMiddleware {
    async use(ctx, next: (...args: any[]) => Promise<any>) {
        console.log('pre');
        await next();
        console.log('post');
    }
}
