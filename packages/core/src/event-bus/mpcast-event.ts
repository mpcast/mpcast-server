/**
 * @description
 * The base class for all events used by the EventBus system.
 * 事件前端总线
 * @docsCategory events
 * @docsWeight 1
 */
export abstract class MpcastEvent {
  public readonly createdAt: Date;
  protected constructor() {
    this.createdAt = new Date();
  }
}
