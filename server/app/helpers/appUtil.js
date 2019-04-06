"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("./constant");
function ResponseSuccess(res, data, code) {
    return res.status(code).json({ success: true, data: data });
}
exports.ResponseSuccess = ResponseSuccess;
function ResponseFailure(res, msg, code) {
    return res.status(code).json({ success: false, data: msg });
}
exports.ResponseFailure = ResponseFailure;
function emailValidator(email) {
    if (!email)
        return false;
    else {
        return constant_1.emailRegx.test(email.toLowerCase());
    }
}
exports.emailValidator = emailValidator;
function getEmailIds(txt) {
    const matches = txt.match(constant_1.emailRegx, 'gi');
    return matches;
}
exports.getEmailIds = getEmailIds;
