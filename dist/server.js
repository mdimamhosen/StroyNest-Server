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
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
const mongoose_1 = __importDefault(require("mongoose"));
const port = process.env.PORT || 8000;
let isConnected = false;
let server;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield mongoose_1.default.connect(config_1.default.mongoUri);
            if (!isConnected) {
                console.log(`Connected to database ${connection.connection.host}`);
                isConnected = true;
            }
            server = app_1.default.listen(config_1.default.port, () => {
                console.log(`Example app listening on port ${port}!`);
            });
        }
        catch (error) {
            console.error(error);
            process.exit(1);
        }
    });
}
main();
process.on('unhandledRejection', () => {
    console.log('👹Shutting down server due to unhandled promise rejection👹');
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on('SIGTERM', () => {
    console.log('👹SIGTERM RECEIVED. Shutting down server👹');
    if (server) {
        server.close(() => {
            console.log('💥Process terminated💥');
        });
    }
});
process.on('uncaughtException', () => {
    console.log('👹Shutting down server due to uncaught exception👹');
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
