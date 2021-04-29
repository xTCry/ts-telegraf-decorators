export interface HandlerMetadata {
    type: string;
    target: Object;
    propertyName: string;
    params?: any[];
    paramsInject?: (...args: any[]) => any[];
}
