"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
exports.Utils = {
    enforceValue: (validValues, value, defaultIndex = 0) => {
        if (typeof value === 'undefined') {
            return validValues[defaultIndex];
        }
        else {
            let i = validValues.indexOf(value.trim().toLowerCase());
            if (i >= 0)
                return validValues[i];
            else
                return validValues[defaultIndex];
        }
    }
};
//# sourceMappingURL=utils.js.map