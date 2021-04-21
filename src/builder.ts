import { Composer, Telegraf, Context } from 'telegraf';
import WizardScene from 'telegraf/scenes/wizard';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import session from 'telegraf/session';

import { getFromContainer } from './container';
import { IBotOptions } from './interfaces/IBotOptions';

import { TFIMiddleware } from './TFIMiddleware';
import { MetadataArgsStorage } from './MetadataStorage';
import { WizardMetadata } from './metadata/WizardMetadata';
import { ComposerMetadata } from './metadata/ComposerMetadata';

interface ControllerOptions<TC extends Context = Context> {
    bot: Telegraf<TC>;
    stage: Stage;
    controller: ComposerMetadata;
    controllerInstance: any;
    middlewareInstances: TFIMiddleware<TC>[];
}

export function buildFromMetadata<TC extends Context = Context>(bot: Telegraf<TC>, options: IBotOptions): Telegraf<TC> {
    const stage = options.stage || new Stage();

    if (options.beforeMiddleware) {
        bot.use(options.beforeMiddleware);
    }

    if (options.session !== false) {
        bot.use(options.session ? options.session : session());
    }

    bot.use(stage.middleware());

    MetadataArgsStorage.composerMetadata.forEach((controller) => {
        const controllerInstance = getFromContainer(controller.target);
        const middlewareInstances = MetadataArgsStorage.middlewareMetadata
            .filter((value) => value.target.prototype == controller.target.prototype)
            .map((value) => getFromContainer<TFIMiddleware<TC>>(value.middleware));

        const controllerOptions: ControllerOptions<TC> = {
            bot,
            stage,
            controller,
            controllerInstance,
            middlewareInstances,
        };

        switch (controller.options.type) {
            case 'controller':
                buildController(controllerOptions);
                break;

            case 'scene':
                buildScene(controllerOptions);
                break;

            case 'wizard':
                buildWizard(controllerOptions);
                break;
        }
    });

    if (options.afterMiddleware) {
        bot.use(options.afterMiddleware);
    }

    return bot;
}

function buildScene<TC extends Context>(options: ControllerOptions<TC>) {
    const { stage, controller: controllerScene, controllerInstance, middlewareInstances } = options;

    const scene = new Scene(controllerScene.options.data.scene);
    scene.use(...middlewareInstances.map((value) => (ctx, next) => value.use(ctx, next)));

    MetadataArgsStorage.handlers
        .filter((value) => controllerScene.target.prototype == value.target)
        .forEach((handler) => {
            scene[handler.type](
                ...[
                    ...handler.data,
                    (ctx) => {
                        controllerInstance[handler.propertyName](
                            ...getInjectParams(ctx, controllerScene.target, handler.propertyName),
                        );
                    },
                ],
            );
        });
    stage.register(scene);
}

function buildController<TC extends Context>(options: ControllerOptions<TC>) {
    const { bot, controller, controllerInstance, middlewareInstances } = options;

    const composer = new Composer();
    composer.use(...middlewareInstances.map((value) => (ctx, next) => value.use(ctx, next)));
    MetadataArgsStorage.handlers
        .filter(
            (value) => controller.target.prototype == value.target && value.type != 'enter' && value.type != 'leave',
        )
        .forEach((handler) => {
            composer[handler.type](
                ...[
                    ...handler.data,
                    (ctx) => {
                        controllerInstance[handler.propertyName](
                            ...getInjectParams(ctx, controller.target, handler.propertyName),
                        );
                    },
                ],
            );
        });
    bot.use(controller.options.data.compose ? controller.options.data.compose(composer) : composer);
}

function buildWizard<TC extends Context>(options: ControllerOptions<TC>) {
    const { stage, controller: wizard, controllerInstance } = options;

    const group = MetadataArgsStorage.wizardStep
        .sort((a, b) => a.step - b.step)
        .reduce<{ [key: number]: WizardMetadata[] }>(
            (prev, cur) => ({
                ...prev,
                [cur.step]: [...(prev[cur.step] || []), cur],
            }),
            {},
        );

    const steps = Object.values(group).map((stepsMetadata) => {
        const composer = new Composer();
        let method = null;

        stepsMetadata.forEach((stepMethod) => {
            const handlers = MetadataArgsStorage.handlers.filter(
                (value) => value.target == wizard.target.prototype && value.propertyName == stepMethod.propertyName,
            );
            if (handlers.length) {
                handlers.forEach((handler) => {
                    composer[handler.type](
                        ...[
                            ...handler.data,
                            (ctx) =>
                                controllerInstance[handler.propertyName](
                                    ...getInjectParams(ctx, wizard.target, handler.propertyName),
                                ),
                        ],
                    );
                });
            } else {
                method = (ctx) =>
                    controllerInstance[stepMethod.propertyName](
                        ...getInjectParams(ctx, wizard.target, stepMethod.propertyName),
                    );
            }
        });
        return method || composer;
    });

    const wizardInstance = new WizardScene(wizard.options.data.name, ...steps);
    const handlers = MetadataArgsStorage.handlers.filter(
        (value) =>
            wizard.target.prototype == value.target &&
            !MetadataArgsStorage.wizardStep.find((value1) => value1.propertyName == value.propertyName),
    );
    handlers.forEach((handler) => {
        wizardInstance[handler.type](
            ...[
                ...handler.data,
                (ctx) =>
                    controllerInstance[handler.propertyName](
                        ...getInjectParams(ctx, wizard.target, handler.propertyName),
                    ),
            ],
        );
    });

    stage.register(wizardInstance);
}

function getInjectParams(ctx: any, target: Function, methodName: string): any[] {
    return MetadataArgsStorage.paramMetadata
        .filter((value) => value.target == target.prototype && methodName === value.propertyName)
        .sort((a, b) => a.index - b.index)
        .map((value) => value.foo(ctx));
}
