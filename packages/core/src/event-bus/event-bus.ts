import { Injectable } from '@nestjs/common';

import { Type } from '../common/shared-types';

import { MpcastEvent } from './mpcast-event';

export type EventHandler<T extends MpcastEvent> = (event: T) => void;
export type UnsubscribeFn = () => void;

/**
 * @description
 * The EventBus is used to globally publish events which can then be subscribed to.
 * 全局事件发布及订阅
 * @docsCategory events
 * @docsWeight 0
 */
@Injectable()
export class EventBus {
  private subscriberMap = new Map<Type<MpcastEvent>, Array<EventHandler<any>>>();

  /**
   * @description
   * Publish an event which any subscribers can react to.
   */
  publish(event: MpcastEvent): void {
    const eventType = (event as any).constructor;
    const handlers = this.subscriberMap.get(eventType);
    if (handlers) {
      const length = handlers.length;
      for (let i = 0; i < length; i++) {
        handlers[i](event);
      }
    }
  }

  /**
   * @description
   * Subscribe to the given event type. Returns an unsubscribe function which can be used
   * to unsubscribe the handler from the event.
   */
  subscribe<T extends MpcastEvent>(type: Type<T>, handler: EventHandler<T>): UnsubscribeFn {
    const handlers = this.subscriberMap.get(type) || [];
    if (!handlers.includes(handler)) {
      handlers.push(handler);
    }
    this.subscriberMap.set(type, handlers);
    return () => this.subscriberMap.set(type, handlers.filter(h => h !== handler));
  }
}
