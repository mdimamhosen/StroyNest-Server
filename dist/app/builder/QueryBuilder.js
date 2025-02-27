"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    // search query
    searchTerm(searchableFields) {
        var _a;
        if ((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.searchTerm) {
            const searchTerm = this.query.searchTerm;
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map(field => ({
                    [field]: { $regex: searchTerm, $options: 'i' },
                })),
            });
        }
        return this;
    }
    // filter query
    filter() {
        const queryObject = Object.assign({}, this.query);
        const skipedFields = [
            'limit',
            'page',
            'searchTerm',
            'sort',
            'select',
            'fields',
        ];
        skipedFields.forEach(field => {
            if (queryObject[field]) {
                delete queryObject[field];
            }
        });
        this.modelQuery = this.modelQuery.find(queryObject);
        return this;
    }
    // sort query
    sort() {
        var _a;
        let sort = '-createdAt';
        if ((_a = this.query) === null || _a === void 0 ? void 0 : _a.sort) {
            sort = this.query.sort.split(',').join(' ');
        }
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    // pagination query
    pagination() {
        var _a, _b;
        let page = 1;
        let skip = 0;
        let limit = 12;
        if ((_a = this.query) === null || _a === void 0 ? void 0 : _a.limit) {
            limit = parseInt(this.query.limit, 10);
        }
        if ((_b = this.query) === null || _b === void 0 ? void 0 : _b.page) {
            page = parseInt(this.query.page, 10);
            skip = (page - 1) * limit;
        }
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    // field selection query
    fields() {
        var _a;
        const fields = ((_a = this.query) === null || _a === void 0 ? void 0 : _a.fields)
            ? this.query.fields.split(',').join(' ')
            : '-__v';
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    countTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const filter = this.modelQuery.getFilter();
            const total = yield this.modelQuery.model.countDocuments(filter);
            let page = 1;
            let limit = 12;
            if ((_a = this.query) === null || _a === void 0 ? void 0 : _a.limit) {
                limit = parseInt(this.query.limit, 10);
            }
            if ((_b = this.query) === null || _b === void 0 ? void 0 : _b.page) {
                page = parseInt(this.query.page, 10);
            }
            const totalPage = Math.ceil(total / limit);
            return {
                total,
                page,
                limit,
                totalPage,
            };
        });
    }
}
exports.default = QueryBuilder;
