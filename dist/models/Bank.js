"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var Bank = /** @class */ (function () {
    function Bank() {
    }
    Bank.prototype.logBankInsertion = function () {
        console.log("Bank ID: " + this.id + ", recorded at: " + this.created_at.toISOString());
    };
    Bank.prototype.logBankUpdate = function () {
        console.log("Bank ID: " + this.id + ", updated at: " + this.updated_at.toISOString());
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn('uuid'),
        __metadata("design:type", String)
    ], Bank.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Bank.prototype, "name", void 0);
    __decorate([
        typeorm_1.CreateDateColumn(),
        __metadata("design:type", Date)
    ], Bank.prototype, "created_at", void 0);
    __decorate([
        typeorm_1.UpdateDateColumn(),
        __metadata("design:type", Date)
    ], Bank.prototype, "updated_at", void 0);
    __decorate([
        typeorm_1.Column({ type: Date, nullable: true }),
        __metadata("design:type", Object)
    ], Bank.prototype, "deleted_at", void 0);
    __decorate([
        typeorm_1.AfterInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Bank.prototype, "logBankInsertion", null);
    __decorate([
        typeorm_1.AfterUpdate(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Bank.prototype, "logBankUpdate", null);
    Bank = __decorate([
        typeorm_1.Entity('banks')
    ], Bank);
    return Bank;
}());
exports.default = Bank;
