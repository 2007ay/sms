"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require('mysql');
var config = require('config');
class MySqlConnector {
    constructor() {
        this.sqlConfig = config.get('dbConfig');
    }
    createConnection() {
        const con = mysql.createConnection(this.sqlConfig);
        return new Promise((resolve, reject) => {
            con.connect(err => {
                if (err) {
                    reject(err);
                }
                else {
                    this.connection = con;
                    this.connection.query(`USE ${this.sqlConfig.database}`, (err, result) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        }
                        else {
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
exports.MySqlConnector = MySqlConnector;
