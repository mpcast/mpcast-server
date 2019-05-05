"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function patchEntity(entity, input) {
    for (const key of Object.keys(entity)) {
        const value = input[key];
        if (key === 'customFields') {
            patchEntity(entity[key], value);
        }
        else if (value != null && key !== 'id') {
            entity[key] = value;
        }
    }
    return entity;
}
exports.patchEntity = patchEntity;
//# sourceMappingURL=patch-entity.js.map