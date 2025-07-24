"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripNonDigits = void 0;
const stripNonDigits = (value) => {
    return value.replace(/\D/g, '');
};
exports.stripNonDigits = stripNonDigits;
