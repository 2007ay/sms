"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentRoute_1 = require("./studentRoute");
class InitRouters {
    constructor() {
        this.rest = express_1.Router();
        this.studentRoute = new studentRoute_1.StudentRoute();
        this.init();
    }
    init() {
        this.rest.use('/', this.studentRoute.route);
    }
}
exports.InitRouters = InitRouters;
