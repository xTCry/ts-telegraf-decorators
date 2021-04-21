import { Hears, Help, TFChat, TFContext, TFController, TFMessage, TFTelegram, UseMiddleware } from '../../src/';
import { Service } from 'typedi';
import { InteropMiddleware, TestService } from '../services/TestService';
import { Chat, IncomingMessage } from 'telegraf/typings/telegram-types';
import { Context, Telegram } from 'telegraf';
import { CurrentUser } from '../params';

@TFController()
@UseMiddleware(InteropMiddleware)
@Service()
export class ControllerTest {
    constructor(private readonly service: TestService) {}

    @Hears('test')
    async hearTest(
        @TFContext() ctx: Context,
        @TFMessage() msg: IncomingMessage,
        @TFChat() chat: Chat,
        @TFTelegram() telegram: Telegram,
    ) {
        console.log('Received message:', msg);
        ctx.reply('Hello');
    }

    @Help()
    async onHelp(@TFContext() ctx, @CurrentUser() user) {
        ctx.reply(`Hello, ${user}!\nMy name is ${await this.service.getBotName()}`);
    }
}
