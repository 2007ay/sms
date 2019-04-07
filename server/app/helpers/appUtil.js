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
    const matches = txt.match(/(^|@)([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi) || [];
    matches.map((match) => {
        return match.split('@')[1].join('@');
    });
    return matches;
}
exports.getEmailIds = getEmailIds;
function sqlParse(record) {
    return JSON.parse(JSON.stringify(record));
}
exports.sqlParse = sqlParse;
