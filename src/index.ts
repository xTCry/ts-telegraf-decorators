import * as path from 'path';
import Telegraf, { Context } from 'telegraf';
import * as glob from 'glob';
import { buildFromMetadata } from './builder';
import { getContainer, useContainer } from './container';
import { IBotOptions } from './interfaces/IBotOptions';

export function buildBot<TC extends Context = Context>(options: IBotOptions<TC>) {
    if (options.container) {
        useContainer(options.container);
    }

    let bot = options.bot || new Telegraf<TC>(options.token!);
    getContainer().set(Telegraf, bot);

    (options.controllers as any[])
        .filter((value) => !(value instanceof Function))
        .forEach((value: string) =>
            glob
                .sync(path.normalize(value))
                .filter((file) => file.substring(file.length - 5, file.length) !== '.d.ts')
                .forEach((dir) => require(dir)),
        );

    return buildFromMetadata<TC>(bot, options);
}

export * from './decorators';
export * from './interfaces/IBotOptions';
export * from './metadata';
export * from './MetadataStorage';
export * from './TFIMiddleware';
