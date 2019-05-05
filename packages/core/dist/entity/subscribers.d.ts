import { EntitySubscriberInterface, InsertEvent } from 'typeorm';
export declare class CalculatedPropertySubscriber implements EntitySubscriberInterface {
    afterLoad(event: any): void;
    afterInsert(event: InsertEvent<any>): Promise<any> | void;
    private moveCalculatedGettersToInstance;
}
export declare const coreSubscribersMap: {
    CalculatedPropertySubscriber: typeof CalculatedPropertySubscriber;
};
