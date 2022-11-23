"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChecklistsModel = void 0;
const mongoose_1 = require("mongoose");
const checklist_schema_1 = require("./checklist.schema");
const ChecklistsModel = (0, mongoose_1.model)("Checklists", checklist_schema_1.ChecklistsSchema);
exports.ChecklistsModel = ChecklistsModel;
