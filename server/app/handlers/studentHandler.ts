import { MySqlConnector } from '../dataLayer/mySqlConnector';
import { Tables } from '../dataLayer/tableSchema';
import { IRegisterStudentPayload, ICommonStudent, ICommonStudentResult } from '../modals/index';
import {
  MESSAGES,
  ERR_MESSAGES,
  emailValidator,
  getEmailIds
} from '../helpers/index';

export class StudentHandler {
  registerStudent<T>(payload: IRegisterStudentPayload): Promise<string> {
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
      let connection = MySqlConnector.getInstance().connection;
      const selectQuery = `select studentEmailId from ${Tables.Records} where teacherEmailId = '${teacher}' and (studentEmailId in (${emails}))`;
      connection.query(selectQuery, (error, results) => {
        console.log(results);
        if (error || results.length) {
          if (error) {
            reject(error);
          } else {
            reject(`${ERR_MESSAGES.STUDENT_EXIST} : ${results.join(',')}`);
          }
        } else {
          let records = [];
          payload.students.forEach(email => {
            records.push([email, teacher, false]);
          });
          const query = `INSERT INTO ${Tables.Records} (studentEmailId, teacherEmailId, suspended) VALUES ?`;
          connection.query(query, [records], err => {
            if (err) reject(err);
            else resolve(MESSAGES.INSERTED_SUCCESSFULLY);
          });
        }
      });
    });
  }

  suspendStudent(email: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const query = `select * from ${
        Tables.Records
        } where studentEmailId = ${email}`;
      let connection = MySqlConnector.getInstance().connection;

      connection.query(query, (err, results) => {
        if (err) reject(err);
        else if (results.length) {
          const updateQuery = `UPDATE ${Tables.Records} SET suspended = true where studentEmailId = ${email} `;
          connection.query(updateQuery, err => {
            if (err) reject(err);
            else {
              resolve(`${email} ${MESSAGES.STUDENT_SUSPENDED}`);
            }
          });
        } else {
          return reject(`${ERR_MESSAGES.EMAIL_MISSING}, ${email}`);
        }
      });
    });
  }

  getCommonStudent(payload: Array<string>): Promise<ICommonStudent> {
    return new Promise((resolve, reject) => {
      let connection = MySqlConnector.getInstance().connection;
      const sqlQuery = ``;
      connection.query(sqlQuery, (err, result) => {
        if (err) reject(err);
        else {
          resolve(result);
        }
      });
    });
  }

  getRetrieveForNotifications(
    teacher: string,
    notification: string
  ): Promise<ICommonStudentResult> {
    return new Promise((resolve, reject) => {
      let connection = MySqlConnector.getInstance().connection;
      const emails = getEmailIds(notification);

      const sqlQuery = `select DISTINCT(studentEmailId) from ${Tables.Records}  where teacherEmailId = ${teacher} and suspended = false  or (suspended = false and studentEmailId in (${emails.join(',')}))`

      connection.query(sqlQuery, (err, result) => {
        if (err) reject(err);
        else {
          if (result.length) {
            let commonResult: ICommonStudentResult = { recipients: result }
            resolve(commonResult);
          } else {
            reject(ERR_MESSAGES.NOTIFICATION_MISSING)
          }
        }
      });
    });
  }
}
