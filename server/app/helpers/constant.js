"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPCODES = {
    SUCCESS: 204,
    BAD_REQUEST: 400,
    APP_ERROR: 500,
    NOT_FOUND: 404
};
exports.emailRegx = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
exports.MESSAGES = {
    INVALID_STUDENT_LIST: 'Please send the valid student list',
    INVALIED_EMAIL_LIST: 'Please provide valid emails',
    INSERTED_SUCCESSFULLY: 'Student list inseted successfully',
    STUDENT_SUSPENDED: 'Suspended successfully;'
};
exports.ERR_MESSAGES = {
    STUDENT_EXIST: 'student already exist',
    EMAIL_MISSING: 'Please check email',
    NOTIFICATION_MISSING: 'Please send valid notification'
};
