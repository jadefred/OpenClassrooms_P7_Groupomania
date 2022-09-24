"use strict";
//const Pool = require("pg").Pool;
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const Pool = pg_1.default.Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'groupomania',
});
exports.default = pool;
