'use strict';

const fs = require('fs'),
    glob = require('glob'),
    chai = require('chai'),
    should = chai.should(),
    expect = chai.expect,
    chaiAsPromised = require('chai-as-promised'),
    Mysql = require('mysql'),
    sinon = require('sinon'),
    bluebird = require('bluebird');

const StudentHandler = require('../app/handlers/studentHandler').StudentHandler;


chai.use(chaiAsPromised);

const fixtures = {};
glob.sync(`${__dirname}/cases/*`).forEach(f => {
    let testCase = JSON.parse(fs.readFileSync(f));
    for (let key of Object.keys(testCase)) {
        fixtures[key] = testCase[key];
    }
});

describe('UserRepository', function (done) {
    var mysqlConnection = Mysql.createConnection({
        host: 'localhost'
    });
    var mysqlMock = sinon.mock(mysqlConnection);
    const studentHandler = new StudentHandler();


    it('generates the proper select query when fetching a user and return promise', function (done) {
        var results = [{
            studentEmailId: 'studentmiche1@example.com',
            teacherEmailId: 'teacher2@gmail.com'
        }];
        var fields = ['studentEmailId', 'teacherEmailId'];
        studentHandler.connection.query = mysqlMock.expects('query')
            .withArgs(`select studentEmailId from records where teacherEmailId = 'teacher2@gmail.com' and (studentEmailId in ('studentmiche1@example.com'))`)
            .callsArgWith(2, null, results, fields);

        // studentHandler.connection = mysqlMock;

        return bluebird.resolve(studentHandler.registerStudent({
                "students": [
                    "studentmiche@example.com"
                ]
            }))
            .then(result => {
                console.log("result", result);
                // assert.deepEqual(result, fixture.jsonResponse);
            })
            .then(done)
            .catch(err => done(err));
    });

});