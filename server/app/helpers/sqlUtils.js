"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getInClauseText(emailArr) {
    let emails = "";
    const len = emailArr.length;
    emailArr.forEach((e, index) => {
        emails += "'" + e + "'";
        if ((index < len - 1)) {
            emails = emails + ",";
        }
    });
    return emails;
}
exports.getInClauseText = getInClauseText;
