"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAmount = void 0;
exports.formatAmount = function (valueInCents) {
    if (valueInCents === void 0) { valueInCents = 0; }
    return Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valueInCents / 100);
};
