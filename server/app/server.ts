import * as express from 'express';
const bodyParser = require('body-parser');
import { InitRouters } from './routers/initRouters';
import { MySqlConnector } from './dataLayer/mySqlConnector';
import { HTTPCODES } from "../app/helpers/index";

export class AppServer {
  private server: any;
  private port = 4000;
  private routes: InitRouters;
  constructor() {
    this.server = express();
    this.routes = new InitRouters();
    this.init();
  }

  private init(): void {
    this.setupApp();
    this.mountRoutes();
    this.start();
  }
  private mountRoutes(): void {
    this.server.use('/api', this.routes.rest);
  }

  private setupApp() {
    this.allowCrosAccess();

    this.server.use(bodyParser.json());
    this.server.use(bodyParser.urlencoded({ extended: true }));
  }

  private allowCrosAccess() {
    this.server.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });
  }
  private start(): void {



    this.server.use((req: any, res: any) => {
      res.status(HTTPCODES.NOT_FOUND).send(`URL Not Found ${req.url}`);
    });

    this.server.use((err: any, req: any, res: any) => {
      res.status(HTTPCODES.APP_ERROR).send(err);
    });

    let instance = MySqlConnector.getInstance();
    instance.createConnection().then(
      () => {
        this.server.listen(this.port, () => {
          console.log(`Application started at port ${this.port}`);
        });
      },
      err => {
        this.server.listen(this.port, () => {
          console.log(`Application started at port ${this.port}`);
        });
        console.error(err);
      }
    );
  }
}

let server = new AppServer();
module.exports = server;