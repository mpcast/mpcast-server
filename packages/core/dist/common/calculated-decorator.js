"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CALCULATED_PROPERTIES = '__calculatedProperties__';
function Calculated() {
    return (target, propertyKey, descriptor) => {
        if (target[exports.CALCULATED_PROPERTIES]) {
            if (!target[exports.CALCULATED_PROPERTIES].includes(propertyKey)) {
                target[exports.CALCULATED_PROPERTIES].push(propertyKey);
            }
        }
        else {
            target[exports.CALCULATED_PROPERTIES] = [propertyKey];
        }
    };
}
exports.Calculated = Calculated;
//# sourceMappingURL=calculated-decorator.js.map