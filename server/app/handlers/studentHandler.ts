import { MySqlConnector } from '../dataLayer/mySqlConnector';
import { Tables } from '../dataLayer/tableSchema';
import { IRegisterStudentPayload, INotificationResult, ICommonStudentResult } from '../modals/index';
import {
  MESSAGES,
  ERR_MESSAGES,
  sqlParse,
  getEmailIds,
  getInClauseText
} from '../helpers/index';

export class StudentHandler {

  registerStudent<T>(payload: IRegisterStudentPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      let connection = MySqlConnector.getInstance().connection;
      const teacher = payload.teacher;
      let emails = getInClauseText(payload.students);
      const selectQuery = `select studentEmailId from ${Tables.Records} where teacherEmailId = '${teacher}' and (studentEmailId in (${emails}))`;
      connection.query(selectQuery, (error, results) => {
        if (error || results.length) {
          if (error) {
            reject(error);
          } else {
            results = sqlParse(results);
            const str = results.map((r) => r.studentEmailId);
            reject(`${ERR_MESSAGES.STUDENT_EXIST} : ${str}`);
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
            else resolve(`${email} ${MESSAGES.STUDENT_SUSPENDED}`);
          });
        } else return reject(`${ERR_MESSAGES.EMAIL_MISSING}, ${email}`);
      });
    });
  }

  getCommonStudent(payload: Array<string>): Promise<ICommonStudentResult> {

    return new Promise((resolve, reject) => {

      let connection = MySqlConnector.getInstance().connection;
      const emails = getInClauseText(payload);

      const sqlQuery = `select DISTINCT(studentEmailId) from ${Tables.Records} where teacherEmailId in (${emails})
      group by studentEmailId having count(studentEmailId)`;

      connection.query(sqlQuery, (err, sqlResp) => {
        if (err) reject(err);
        else {
          sqlResp = sqlParse(sqlResp);
          sqlResp = sqlResp.map(resp => resp.studentEmailId);
          const commonResult: ICommonStudentResult = {
            students: sqlResp
          }
          resolve(commonResult);
        }
      });
    });
  }

  getRetrieveForNotifications(
    teacher: string,
    notification: string
  ): Promise<INotificationResult> {

    return new Promise((resolve, reject) => {

      const techerPromise = new Promise((tResolve, tReject) => {
        let connection = MySqlConnector.getInstance().connection;
        const sqlQuery = `select DISTINCT(studentEmailId) from ${Tables.Records}  where teacherEmailId = '${teacher}' and suspended = false`

        connection.query(sqlQuery, (err, result) => {
          if (err) tReject(err);
          else {
            if (result.length) {
              tResolve(result);
            } else {
              tReject(ERR_MESSAGES.NOTIFICATION_MISSING)
            }
          }
        });
      });

      const studentPromise = new Promise((sResolve, sReject) => {
        let connection = MySqlConnector.getInstance().connection;
        const emails = getEmailIds(notification);
        const sqlQuery = `select DISTINCT(studentEmailId) from ${Tables.Records}  where suspended = false and studentEmailId in (${getInClauseText(emails)});`;
        connection.query(sqlQuery, (err, result) => {
          if (err) sReject(err);
          else {
            if (result.length) {
              sResolve(result);
            } else {
              sReject(`${emails} ${ERR_MESSAGES.NOTIFICATION_MISSING}`);
            }
          }
        });
      });

      return Promise.all([techerPromise, studentPromise]).then((resultSet) => {
        let commonResult: INotificationResult = { recipients: [] }
        sqlParse(resultSet).forEach((record) => {
          record.forEach(element => commonResult.recipients.push(element.studentEmailId));
        });
        resolve(commonResult);
      }, reject);
    })
  }
}
