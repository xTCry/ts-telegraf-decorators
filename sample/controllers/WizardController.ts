import { Command, Hears, Leave, TFContext, TFWizard, TFWizardStep } from '../../src';

@TFWizard('steps')
export class WizardController {
    @TFWizardStep(1)
    step1(@TFContext() ctx) {
        console.log('step 1');
        return ctx.wizard.next();
    }

    @TFWizardStep(2)
    step2(@TFContext() ctx) {
        console.log('step 2');
        return ctx.wizard.next();
    }

    @TFWizardStep(3)
    @Hears('hello')
    step3(@TFContext() ctx) {
        console.log('step 3');
        return ctx.wizard.next();
    }

    @TFWizardStep(3)
    @Command('test')
    step4(@TFContext() ctx) {
        console.log('step 3');
        return ctx.wizard.next();
    }

    @TFWizardStep(3)
    @Command('hello')
    step5(@TFContext() ctx) {
        console.log('step 3');
        return ctx.scene.leave();
    }

    @Command('exit')
    onExit(@TFContext() ctx) {
        return ctx.scene.leave();
    }

    @Leave()
    onLeave(@TFContext() ctx) {
        console.log('Leave');
    }
}
