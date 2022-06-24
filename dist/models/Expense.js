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
var Category_1 = __importDefault(require("./Category"));
var PaymentType_1 = __importDefault(require("./PaymentType"));
var User_1 = __importDefault(require("./User"));
var Bank_1 = __importDefault(require("./Bank"));
var Store_1 = __importDefault(require("./Store"));
var Expense = /** @class */ (function () {
    function Expense() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn('uuid'),
        __metadata("design:type", String)
    ], Expense.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Expense.prototype, "owner_id", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return User_1.default; }),
        typeorm_1.JoinColumn({ name: 'owner_id' }),
        __metadata("design:type", User_1.default)
    ], Expense.prototype, "owner", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return Category_1.default; }, { eager: true }),
        typeorm_1.JoinColumn({ name: 'category_id' }),
        __metadata("design:type", Category_1.default)
    ], Expense.prototype, "category", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return PaymentType_1.default; }, { eager: true }),
        typeorm_1.JoinColumn({ name: 'payment_type_id' }),
        __metadata("design:type", PaymentType_1.default)
    ], Expense.prototype, "payment_type", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return Bank_1.default; }, { eager: true }),
        typeorm_1.JoinColumn({ name: 'bank_id' }),
        __metadata("design:type", Bank_1.default)
    ], Expense.prototype, "bank", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return Store_1.default; }, { eager: true }),
        typeorm_1.JoinColumn({ name: 'store_id' }),
        __metadata("design:type", Store_1.default)
    ], Expense.prototype, "store", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Expense.prototype, "category_id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Expense.prototype, "payment_type_id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Expense.prototype, "bank_id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Expense.prototype, "store_id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Expense.prototype, "description", void 0);
    __decorate([
        typeorm_1.Column('date'),
        __metadata("design:type", Date)
    ], Expense.prototype, "date", void 0);
    __decorate([
        typeorm_1.Column('integer'),
        __metadata("design:type", Number)
    ], Expense.prototype, "amount", void 0);
    __decorate([
        typeorm_1.CreateDateColumn(),
        __metadata("design:type", Date)
    ], Expense.prototype, "created_at", void 0);
    __decorate([
        typeorm_1.UpdateDateColumn(),
        __metadata("design:type", Date)
    ], Expense.prototype, "updated_at", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Boolean)
    ], Expense.prototype, "split", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Boolean)
    ], Expense.prototype, "personal", void 0);
    Expense = __decorate([
        typeorm_1.Entity('expenses')
    ], Expense);
    return Expense;
}());
exports.default = Expense;
