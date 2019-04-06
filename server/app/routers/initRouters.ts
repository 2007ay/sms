import { Router } from 'express';
import { StudentRoute } from './studentRoute';

export class InitRouters {
  rest: Router;
  private studentRoute: StudentRoute;
  constructor() {
    this.rest = Router();
    this.studentRoute = new StudentRoute();
    this.init();
  }
  private init(): void {
    this.rest.use('/', this.studentRoute.route);
  }
}
