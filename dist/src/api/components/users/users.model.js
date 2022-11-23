"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModel = void 0;
const mongoose_1 = require("mongoose");
const users_schema_1 = require("./users.schema");
const UsersModel = (0, mongoose_1.model)("Users", users_schema_1.UsersSchema);
exports.UsersModel = UsersModel;
