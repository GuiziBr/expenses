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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var User_1 = __importDefault(require("./User"));
var Bank_1 = __importDefault(require("./Bank"));
var StatementPeriod = /** @class */ (function () {
    function StatementPeriod() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn('uuid'),
        __metadata("design:type", String)
    ], StatementPeriod.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], StatementPeriod.prototype, "user_id", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return User_1.default; }),
        typeorm_1.JoinColumn({ name: 'user_id' }),
        __metadata("design:type", User_1.default)
    ], StatementPeriod.prototype, "owner", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], StatementPeriod.prototype, "bank_id", void 0);
    __decorate([
        typeorm_1.OneToOne(function () { return Bank_1.default; }),
        typeorm_1.JoinColumn({ name: 'bank_id' }),
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], StatementPeriod.prototype, "initial_day", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], StatementPeriod.prototype, "final_day", void 0);
    StatementPeriod = __decorate([
        typeorm_1.Entity('statement_periods')
    ], StatementPeriod);
    return StatementPeriod;
}());
exports.default = StatementPeriod;
