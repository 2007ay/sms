const mysql = require('mysql');
var config = require('config');
import { ISQLConfig } from '../modals/index';

export class MySqlConnector {
  private static instance: MySqlConnector;
  public connection: any;
  private sqlConfig: ISQLConfig = config.get('dbConfig');
  private constructor() {

  }

  public createConnection() {
    const con = mysql.createConnection(this.sqlConfig);
    return new Promise((resolve, reject) => {
      con.connect(err => {
        if (err) {
          reject(err);
        } else {
          this.connection = con;
          this.connection.query(`USE ${this.sqlConfig.database}`, (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve(this.connection);
            }
          });
        }
      });
    });
  }

  static getInstance() {
    if (!MySqlConnector.instance) {
      MySqlConnector.instance = new MySqlConnector();
    }
    return MySqlConnector.instance;
  }
}
