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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const connection_1 = __importDefault(require("../../../db/connection"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const Router_1 = require("../Router");
class Server {
    constructor() {
        this.apiPrefix = process.env.API_PREFIX || "/api";
        this.app = (0, express_1.default)();
        this.connectDB();
        this.middlewares();
        this.initAPIRoutes();
    }
    initAPIRoutes() {
        const server = new Router_1.Router(this.app, this.apiPrefix);
        server.initRoutes();
    }
    middlewares() {
        this.app.use((0, body_parser_1.json)());
        this.app.use((0, cors_1.default)());
    }
    connectDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield connection_1.default.then(() => {
                    console.log("Database is connected");
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    listen(port) {
        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}
exports.Server = Server;
