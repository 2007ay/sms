"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentHandler_1 = require("../handlers/studentHandler");
const appUtil_1 = require("../helpers/appUtil");
const index_1 = require("../helpers/index");
class StudentRoute {
    constructor() {
        this.route = express_1.Router();
        this.studentHandler = new studentHandler_1.StudentHandler();
        this.init();
    }
    init() {
        this.route.post('/register', this.registerStudent.bind(this));
        this.route.post('/suspend', this.suspendStudent.bind(this));
        this.route.get('/commonstudents', this.getCommonStudent.bind(this));
        this.route.post('/retrievefornotifications', this.getRetrieveForNotifications.bind(this));
    }
    registerStudent(req, res, next) {
        debugger;
        const payload = req.body;
        const students = payload.students;
        let isValidEmail = students.length ? true : false;
        students.forEach((email) => {
            if (isValidEmail) {
                isValidEmail = index_1.emailValidator(email);
            }
        });
        if (index_1.emailValidator(payload.teacher) && isValidEmail) {
            this.studentHandler
                .registerStudent(payload)
                .then(result => appUtil_1.ResponseSuccess(res, result, index_1.HTTPCODES.SUCCESS), next);
        }
        else {
            appUtil_1.ResponseFailure(res, index_1.MESSAGES.INVALID_STUDENT_LIST, index_1.HTTPCODES.BAD_REQUEST);
        }
    }
    suspendStudent(req, res, next) {
        const { student } = req.body;
        if (student && index_1.emailValidator(student)) {
            this.studentHandler
                .suspendStudent(student)
                .then(result => appUtil_1.ResponseSuccess(res, result, index_1.HTTPCODES.SUCCESS), next);
        }
        else {
            appUtil_1.ResponseFailure(res, index_1.MESSAGES.INVALID_STUDENT_LIST, index_1.HTTPCODES.BAD_REQUEST);
        }
    }
    getCommonStudent(req, res, next) {
        this.studentHandler.getCommonStudent(req.body).then(result => {
            return appUtil_1.ResponseSuccess(res, result, index_1.HTTPCODES.SUCCESS);
        }, err => {
            next(err);
        });
    }
    getRetrieveForNotifications(req, res, next) {
        const { teacher, notification } = req.body;
        if (!index_1.emailValidator(teacher) || !notification) {
            return next(index_1.ERR_MESSAGES.NOTIFICATION_MISSING);
        }
        else {
            this.studentHandler
                .getRetrieveForNotifications(teacher, notification)
                .then(result => {
                return appUtil_1.ResponseSuccess(res, result, index_1.HTTPCODES.SUCCESS);
            }, err => {
                next(err);
            });
        }
    }
}
exports.StudentRoute = StudentRoute;
