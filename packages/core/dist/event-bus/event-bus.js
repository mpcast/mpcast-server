"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let EventBus = class EventBus {
    constructor() {
        this.subscriberMap = new Map();
    }
    publish(event) {
        const eventType = event.constructor;
        const handlers = this.subscriberMap.get(eventType);
        if (handlers) {
            const length = handlers.length;
            for (let i = 0; i < length; i++) {
                handlers[i](event);
            }
        }
    }
    subscribe(type, handler) {
        const handlers = this.subscriberMap.get(type) || [];
        if (!handlers.includes(handler)) {
            handlers.push(handler);
        }
        this.subscriberMap.set(type, handlers);
        return () => this.subscriberMap.set(type, handlers.filter(h => h !== handler));
    }
};
EventBus = __decorate([
    common_1.Injectable()
], EventBus);
exports.EventBus = EventBus;
//# sourceMappingURL=event-bus.js.map