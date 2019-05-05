import { Type } from '../common/shared-types';
import { MpcastEvent } from './mpcast-event';
export declare type EventHandler<T extends MpcastEvent> = (event: T) => void;
export declare type UnsubscribeFn = () => void;
export declare class EventBus {
    private subscriberMap;
    publish(event: MpcastEvent): void;
    subscribe<T extends MpcastEvent>(type: Type<T>, handler: EventHandler<T>): UnsubscribeFn;
}
