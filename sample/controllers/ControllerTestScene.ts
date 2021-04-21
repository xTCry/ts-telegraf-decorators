import { Hears, Enter, TFScene } from '../../src/decorators';
import { TFContext } from '../../src';

@TFScene('game')
export class ControllerTestScene {
    @Enter()
    onEnter(@TFContext() ctx) {
        ctx.reply('Hello Scene game');
    }

    @Hears('ok')
    hearOk(@TFContext() ctx) {
        ctx.reply('OK!!!!');
    }
}
