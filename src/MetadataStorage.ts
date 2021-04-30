import {
    ParamsMetadata,
    ComposerMetadata,
    WizardStepMetadata,
    HandlerMetadata,
    MiddlewareMetadata,
    ErrorCatcherMetadata,
} from './metadata';

class MetadataStorage {
    public handlers: HandlerMetadata[] = [];

    public paramMetadata: ParamsMetadata[] = [];

    public composerMetadata: ComposerMetadata[] = [];

    public wizardStep: WizardStepMetadata[] = [];

    public middlewareMetadata: MiddlewareMetadata[] = [];

    public errorCatcherMetadata: ErrorCatcherMetadata[] = [];

    public reset() {
        this.handlers = [];
        this.paramMetadata = [];
        this.composerMetadata = [];
        this.wizardStep = [];
        this.middlewareMetadata = [];
        this.errorCatcherMetadata = [];
    }
}

export const MetadataArgsStorage = new MetadataStorage();
