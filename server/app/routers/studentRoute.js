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
    validate(emails) {
        if (!emails)
            return false;
        let isValid = emails.length ? true : false;
        emails.forEach((email) => {
            if (isValid) {
                isValid = index_1.emailValidator(email);
            }
        });
        return isValid;
    }
    registerStudent(req, res, next) {
        const payload = req.body;
        const students = payload.students;
        let isValid = this.validate(students);
        if (index_1.emailValidator(payload.teacher) && isValid) {
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
        let { teacher } = req.query;
        teacher = typeof (teacher) == 'string' ? [teacher] : teacher;
        let isValid = this.validate(teacher);
        if (isValid) {
            this.studentHandler.getCommonStudent(teacher).then(result => {
                return appUtil_1.ResponseSuccess(res, result, index_1.HTTPCODES.SUCCESS);
            }, next);
        }
        else {
            appUtil_1.ResponseFailure(res, index_1.MESSAGES.INVALIED_EMAIL_LIST, index_1.HTTPCODES.BAD_REQUEST);
        }
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
            }, next);
        }
    }
}
exports.StudentRoute = StudentRoute;
