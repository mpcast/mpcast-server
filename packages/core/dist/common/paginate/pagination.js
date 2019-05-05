"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Pagination {
    constructor(items, itemCount, totalItems, pageCount, next, previous) {
        this.items = items;
        this.itemCount = itemCount;
        this.totalItems = totalItems;
        this.pageCount = pageCount;
        this.next = next;
        this.previous = previous;
    }
}
exports.Pagination = Pagination;
//# sourceMappingURL=pagination.js.map