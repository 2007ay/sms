"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require('body-parser');
const initRouters_1 = require("./routers/initRouters");
const mySqlConnector_1 = require("./dataLayer/mySqlConnector");
const index_1 = require("../app/helpers/index");
class AppServer {
    constructor() {
        this.port = 4000;
        this.server = express();
        this.routes = new initRouters_1.InitRouters();
        this.init();
    }
    init() {
        this.setupApp();
        this.mountRoutes();
        this.start();
    }
    mountRoutes() {
        this.server.use('/api', this.routes.rest);
    }
    setupApp() {
        this.allowCrosAccess();
        this.server.use(bodyParser.json());
        this.server.use(bodyParser.urlencoded({ extended: true }));
    }
    allowCrosAccess() {
        this.server.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });
    }
    start() {
        this.server.use((req, res) => {
            res.status(index_1.HTTPCODES.NOT_FOUND).send(`URL Not Found ${req.url}`);
        });
        this.server.use((err, req, res) => {
            res.status(index_1.HTTPCODES.APP_ERROR).send(err);
        });
        let instance = mySqlConnector_1.MySqlConnector.getInstance();
        instance.createConnection().then(() => {
            this.server.listen(this.port, () => {
                console.log(`Application started at port ${this.port}`);
            });
        }, console.error);
    }
}
exports.AppServer = AppServer;
let appServer = new AppServer();
module.exports = appServer.server; // for testing
