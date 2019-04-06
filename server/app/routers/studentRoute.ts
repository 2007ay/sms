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

  private registerStudent(req, res, next): void {

    debugger;
    const payload: IRegisterStudentPayload = req.body;
    const students = payload.students;
    let isValidEmail = students.length ? true : false;
    students.forEach((email) => {
      if (isValidEmail) {
        isValidEmail = emailValidator(email);
      }
    });

    if (emailValidator(payload.teacher) && isValidEmail) {
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
    this.studentHandler.getCommonStudent(req.body).then(
      result => {
        return ResponseSuccess(res, result, HTTPCODES.SUCCESS);
      },
      err => {
        next(err);
      }
    );
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
          },
          err => {
            next(err);
          }
        );
    }
  }
}
