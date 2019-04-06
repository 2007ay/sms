var mysql = require('mysql');
var config = require('config');
var dbConfig = config.get('dbConfig');

var con = mysql.createConnection(dbConfig);
con.connect(function (err, result) {
    if (err) {
        console.log(err)
    } else {
        //createDefaultDB();
        selectQuery()
    }
});

function selectQuery() {
    con.query('select * from records', (err, r) => {
        if (err) {
            console.log(err);
        } else {
            console.log(JSON.parse(JSON.stringify(r)));
        }
    });
}

function createDefaultDB() {

    con.query(`CREATE DATABASE /*!32312 IF NOT EXISTS*/${dbConfig.database} /*!40100 DEFAULT CHARACTER SET latin1 */;`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log("db created");
            con.query('USE sms_portal', () => {
                const createTable = (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        con.query('CREATE TABLE `records` (`recordId` int NOT NULL AUTO_INCREMENT, `studentEmailId` varchar(128) DEFAULT NULL,`teacherEmailId` varchar(128) DEFAULT NULL, `suspended` varchar(5) DEFAULT false, primary key(`recordId`) )', (err) => {
                            if (err) console.log(err);
                            else {
                                console.log("table created");
                                con.query('insert  into `records`(`studentEmailId`,`teacherEmailId`,`suspended`) values ("studentbob@example.com","teacherken@example.com", false)', (err, result) => {
                                    if (err) console.log(err);
                                    else console.log("data inserted");
                                });
                            }
                        });
                    }
                }
                dropTable(createTable);
            });
        }
    });
}

function dropTable(callBack) {
    con.query('DROP TABLE records;', callBack);
}