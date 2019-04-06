"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mySqlConnector_1 = require("../dataLayer/mySqlConnector");
const tableSchema_1 = require("../dataLayer/tableSchema");
const index_1 = require("../helpers/index");
class StudentHandler {
    registerStudent(payload) {
        return new Promise((resolve, reject) => {
            const teacher = payload.teacher;
            debugger;
            let emails = "";
            payload.students.forEach((e, index) => {
                emails += "'" + e + "'";
                if ((index < payload.students.length - 1)) {
                    emails = emails + ",";
                }
            });
            let connection = mySqlConnector_1.MySqlConnector.getInstance().connection;
            const selectQuery = `select studentEmailId from ${tableSchema_1.Tables.Records} where teacherEmailId = '${teacher}' and (studentEmailId in (${emails}))`;
            connection.query(selectQuery, (error, results) => {
                console.log(results);
                if (error || results.length) {
                    if (error) {
                        reject(error);
                    }
                    else {
                        reject(`${index_1.ERR_MESSAGES.STUDENT_EXIST} : ${results.join(',')}`);
                    }
                }
                else {
                    let records = [];
                    payload.students.forEach(email => {
                        records.push([email, teacher, false]);
                    });
                    const query = `INSERT INTO ${tableSchema_1.Tables.Records} (studentEmailId, teacherEmailId, suspended) VALUES ?`;
                    connection.query(query, [records], err => {
                        if (err)
                            reject(err);
                        else
                            resolve(index_1.MESSAGES.INSERTED_SUCCESSFULLY);
                    });
                }
            });
        });
    }
    suspendStudent(email) {
        return new Promise((resolve, reject) => {
            const query = `select * from ${tableSchema_1.Tables.Records} where studentEmailId = ${email}`;
            let connection = mySqlConnector_1.MySqlConnector.getInstance().connection;
            connection.query(query, (err, results) => {
                if (err)
                    reject(err);
                else if (results.length) {
                    const updateQuery = `UPDATE ${tableSchema_1.Tables.Records} SET suspended = true where studentEmailId = ${email} `;
                    connection.query(updateQuery, err => {
                        if (err)
                            reject(err);
                        else {
                            resolve(`${email} ${index_1.MESSAGES.STUDENT_SUSPENDED}`);
                        }
                    });
                }
                else {
                    return reject(`${index_1.ERR_MESSAGES.EMAIL_MISSING}, ${email}`);
                }
            });
        });
    }
    getCommonStudent(payload) {
        return new Promise((resolve, reject) => {
            let connection = mySqlConnector_1.MySqlConnector.getInstance().connection;
            const sqlQuery = ``;
            connection.query(sqlQuery, (err, result) => {
                if (err)
                    reject(err);
                else {
                    resolve(result);
                }
            });
        });
    }
    getRetrieveForNotifications(teacher, notification) {
        return new Promise((resolve, reject) => {
            let connection = mySqlConnector_1.MySqlConnector.getInstance().connection;
            const emails = index_1.getEmailIds(notification);
            const sqlQuery = `select DISTINCT(studentEmailId) from ${tableSchema_1.Tables.Records}  where teacherEmailId = ${teacher} and suspended = false  or (suspended = false and studentEmailId in (${emails.join(',')}))`;
            connection.query(sqlQuery, (err, result) => {
                if (err)
                    reject(err);
                else {
                    if (result.length) {
                        let commonResult = { recipients: result };
                        resolve(commonResult);
                    }
                    else {
                        reject(index_1.ERR_MESSAGES.NOTIFICATION_MISSING);
                    }
                }
            });
        });
    }
}
exports.StudentHandler = StudentHandler;
