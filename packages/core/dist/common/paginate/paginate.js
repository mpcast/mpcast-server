"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pagination_1 = require("./pagination");
async function paginate(repository, options, searchOptions) {
    const page = options.page > 0 ? options.page - 1 : options.page < 0 ? 0 : options.page;
    const limit = options.limit;
    const route = options.route;
    delete options.page;
    delete options.limit;
    delete options.route;
    const [items, total] = await repository.findAndCount(Object.assign({ skip: page * limit, take: limit }, searchOptions));
    const isNext = route && total / limit >= page + 1;
    const isPrevious = route && page > 0;
    const routes = {
        next: isNext ? `${route}?page=${page + 2}` : '',
        previous: isPrevious ? `${route}?page=${page}` : '',
    };
    return new pagination_1.Pagination(items, items.length, total, Math.ceil(total / limit), routes.next, routes.previous);
}
exports.paginate = paginate;
//# sourceMappingURL=paginate.js.map