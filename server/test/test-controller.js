'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const HTTPCODES = require('../app/helpers/constant').HTTPCODES;
const app = require('../app/server.js');

chai.use(require('chai-http'));

const expect = chai.expect;
const should = chai.should();

const student1 = "s1@gmail.com";
const teacher1 = "t1@gmail.com";

describe('sms api Test', () => {

    // Invalid path test
    describe('server test', () => {
        it('should return 404', (done) => {
            chai.request(app)
                .get('/')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(HTTPCODES.NOT_FOUND);
                    done();
                });
        });
    });

    // register api test
    describe('POST /api/register', () => {

        it('should give  bad request for teacher', (done) => {
            chai.request(app)
                .post('/api/register')
                .send({
                    'students': [student1]
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(HTTPCODES.BAD_REQUEST);
                    done();
                });
        });

        it('should give bad request for student', (done) => {
            chai.request(app)
                .post('/api/register')
                .send({
                    'teacher': teacher1
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(HTTPCODES.BAD_REQUEST);
                    done();
                });
        });

        it('should register student', (done) => {
            chai.request(app)
                .post('/api/register')
                .send({
                    'teacher': teacher1,
                    'students': [student1]
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(HTTPCODES.SUCCESS);
                    done();
                });
        });

        it('should not register student', (done) => {
            chai.request(app)
                .post('/api/register')
                .send({
                    'teacher': teacher1,
                    'students': [student1]
                })
                .end((err, res) => {
                    res.should.have.status(HTTPCODES.APP_ERROR);
                    done();
                });
        });
    });

    // commonstudents api test
    describe('GET /api/commonstudents', () => {
        //api test for commonstudents
        it('should give list of student', (done) => {
            chai.request(app)
                .get(`/api/commonstudents?teacher=${teacher1}`)
                .end((err, res) => {
                    res.should.have.status(HTTPCODES.SUCCESS);
                    res.body.data.students.should.be.a('array');
                    expect(res.body.success).to.be.true;
                    done();
                });
        });

        //api test for commonstudents
        it('should not give list', (done) => {
            chai.request(app)
                .get(`/api/commonstudents?teacher=some@example.com`)
                .end((err, res) => {
                    res.should.have.status(HTTPCODES.SUCCESS);
                    res.body.data.students.should.be.empty();
                    expect(res.body.success).to.be.true;
                    done();
                });
        });
    });

    // suspend api test
    describe('POST /api/suspend', () => {
        it('should suspend the student', (done) => {
            chai.request(app)
                .post(`/api/suspend`)
                .send({
                    'students': [student1]
                })
                .end((err, res) => {
                    res.should.have.status(HTTPCODES.SUCCESS);
                    res.body.students.should.have.key('data')
                    expect(res.body.success).to.be.true;
                    done();
                });
        });

        it('should not suspend the student', (done) => {
            chai.request(app)
                .post(`/api/suspend`)
                .send({
                    'students': ["somerand@gmail.com"]
                })
                .end((err, res) => {
                    res.should.have.status(HTTPCODES.APP_ERROR);
                    done();
                });
        });
    });

    // retrievefornotifications api test
    describe('POST /api/retrievefornotifications', () => {

        it('should give the list of student', (done) => {
            chai.request(app)
                .post(`/api/retrievefornotifications`)
                .send({
                    "teacher": teacher1,
                    "notification": `Hello students! ${student1}`
                })
                .end((err, res) => {
                    res.should.have.status(HTTPCODES.SUCCESS);
                    expect(res.body.success).to.be.true;
                    done();
                });
        });
    });

});