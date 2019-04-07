import { Router } from 'express';
import { StudentHandler } from '../handlers/studentHandler';
import { ResponseSuccess, ResponseFailure } from '../helpers/appUtil';
import {
  HTTPCODES,
  MESSAGES,
  emailValidator,
  ERR_MESSAGES
} from '../helpers/index';
import { IRegisterStudentPayload } from '../modals/index';

export class StudentRoute {
  route: Router;
  studentHandler: StudentHandler;
  constructor() {
    this.route = Router();
    this.studentHandler = new StudentHandler();
    this.init();
  }

  private init(): void {
    this.route.post('/register', this.registerStudent.bind(this));
    this.route.post('/suspend', this.suspendStudent.bind(this));
    this.route.get('/commonstudents', this.getCommonStudent.bind(this));
    this.route.post('/retrievefornotifications', this.getRetrieveForNotifications.bind(this));
  }

  private validate(emails) {

    if (!emails) return false;
    
    let isValid = emails.length ? true : false;
    emails.forEach((email) => {
      if (isValid) {
        isValid = emailValidator(email);
      }
    });
    return isValid
  }


  private registerStudent(req, res, next): void {
    const payload: IRegisterStudentPayload = req.body;
    const students = payload.students;
    let isValid = this.validate(students);
    if (emailValidator(payload.teacher) && isValid) {
      this.studentHandler
        .registerStudent(payload)
        .then(result => ResponseSuccess(res, result, HTTPCODES.SUCCESS), next);
    } else {
      ResponseFailure(res, MESSAGES.INVALID_STUDENT_LIST, HTTPCODES.BAD_REQUEST);
    }
  }

  private suspendStudent(req, res, next): void {
    const { student } = req.body;

    if (student && emailValidator(student)) {
      this.studentHandler
        .suspendStudent(student)
        .then(result => ResponseSuccess(res, result, HTTPCODES.SUCCESS), next);
    } else {
      ResponseFailure(
        res,
        MESSAGES.INVALID_STUDENT_LIST,
        HTTPCODES.BAD_REQUEST
      );
    }
  }

  private getCommonStudent(req, res, next): void {

    let { teacher } = req.query;
    teacher = typeof (teacher) == 'string' ? [teacher] : teacher;
    let isValid = this.validate(teacher);
    if (isValid) {
      this.studentHandler.getCommonStudent(teacher).then(
        result => {
          return ResponseSuccess(res, result, HTTPCODES.SUCCESS);
        }, next
      );
    } else {
      ResponseFailure(res, MESSAGES.INVALIED_EMAIL_LIST, HTTPCODES.BAD_REQUEST);
    }
  }

  private getRetrieveForNotifications(req, res, next): void {
    const { teacher, notification } = req.body;
    if (!emailValidator(teacher) || !notification) {
      return next(ERR_MESSAGES.NOTIFICATION_MISSING);
    } else {
      this.studentHandler
        .getRetrieveForNotifications(teacher, notification)
        .then(
          result => {
            return ResponseSuccess(res, result, HTTPCODES.SUCCESS);
          }, next
        );
    }
  }
}