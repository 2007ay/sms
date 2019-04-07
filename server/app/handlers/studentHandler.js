"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mySqlConnector_1 = require("../dataLayer/mySqlConnector");
const tableSchema_1 = require("../dataLayer/tableSchema");
const index_1 = require("../helpers/index");
class StudentHandler {
    registerStudent(payload) {
        return new Promise((resolve, reject) => {
            let connection = mySqlConnector_1.MySqlConnector.getInstance().connection;
            const teacher = payload.teacher;
            let emails = index_1.getInClauseText(payload.students);
            const selectQuery = `select studentEmailId from ${tableSchema_1.Tables.Records} where teacherEmailId = '${teacher}' and (studentEmailId in (${emails}))`;
            connection.query(selectQuery, (error, results) => {
                if (error || results.length) {
                    if (error) {
                        reject(error);
                    }
                    else {
                        results = index_1.sqlParse(results);
                        const str = results.map((r) => r.studentEmailId);
                        reject(`${index_1.ERR_MESSAGES.STUDENT_EXIST} : ${str}`);
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
                        else
                            resolve(`${email} ${index_1.MESSAGES.STUDENT_SUSPENDED}`);
                    });
                }
                else
                    return reject(`${index_1.ERR_MESSAGES.EMAIL_MISSING}, ${email}`);
            });
        });
    }
    getCommonStudent(payload) {
        return new Promise((resolve, reject) => {
            let connection = mySqlConnector_1.MySqlConnector.getInstance().connection;
            const emails = index_1.getInClauseText(payload);
            const sqlQuery = `select DISTINCT(studentEmailId) from ${tableSchema_1.Tables.Records} where teacherEmailId in (${emails})
      group by studentEmailId having count(studentEmailId)`;
            connection.query(sqlQuery, (err, sqlResp) => {
                if (err)
                    reject(err);
                else {
                    sqlResp = index_1.sqlParse(sqlResp);
                    sqlResp = sqlResp.map(resp => resp.studentEmailId);
                    const commonResult = {
                        students: sqlResp
                    };
                    resolve(commonResult);
                }
            });
        });
    }
    getRetrieveForNotifications(teacher, notification) {
        return new Promise((resolve, reject) => {
            const techerPromise = new Promise((tResolve, tReject) => {
                let connection = mySqlConnector_1.MySqlConnector.getInstance().connection;
                const sqlQuery = `select DISTINCT(studentEmailId) from ${tableSchema_1.Tables.Records}  where teacherEmailId = '${teacher}' and suspended = false`;
                connection.query(sqlQuery, (err, result) => {
                    if (err)
                        tReject(err);
                    else {
                        if (result.length) {
                            tResolve(result);
                        }
                        else {
                            tReject(index_1.ERR_MESSAGES.NOTIFICATION_MISSING);
                        }
                    }
                });
            });
            const studentPromise = new Promise((sResolve, sReject) => {
                let connection = mySqlConnector_1.MySqlConnector.getInstance().connection;
                const emails = index_1.getEmailIds(notification);
                const sqlQuery = `select DISTINCT(studentEmailId) from ${tableSchema_1.Tables.Records}  where suspended = false and studentEmailId in (${index_1.getInClauseText(emails)});`;
                connection.query(sqlQuery, (err, result) => {
                    if (err)
                        sReject(err);
                    else {
                        if (result.length) {
                            sResolve(result);
                        }
                        else {
                            sReject(`${emails} ${index_1.ERR_MESSAGES.NOTIFICATION_MISSING}`);
                        }
                    }
                });
            });
            return Promise.all([techerPromise, studentPromise]).then((resultSet) => {
                let commonResult = { recipients: [] };
                index_1.sqlParse(resultSet).forEach((record) => {
                    record.forEach(element => commonResult.recipients.push(element.studentEmailId));
                });
                resolve(commonResult);
            }, reject);
        });
    }
}
exports.StudentHandler = StudentHandler;
