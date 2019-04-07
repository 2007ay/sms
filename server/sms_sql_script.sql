CREATE DATABASE /*!32312 IF NOT EXISTS*/`sms_portal` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `sms_portal`;


CREATE TABLE `records` (
  `recordId` int NOT NULL AUTO_INCREMENT,
  `studentEmailId` varchar(128) DEFAULT NULL,
  `teacherEmailId` varchar(128) DEFAULT NULL,
  `suspended` varchar(5) DEFAULT false,
   primary key (`recordId`)
)

/*Data for the table `employee` */

insert  into `records`(`studentEmailId`,`teacherEmailId`,`suspended`)
 values ('s1@example.com','t1@example.com', false);

insert  into `records`(`studentEmailId`,`teacherEmailId`,`suspended`) values 
('s2@example.com','t2@example.com', false);

insert  into `records`(`studentEmailId`,`teacherEmailId`,`suspended`) values 
('s2@example.com','t1@example.com', false);

insert  into `records`(`studentEmailId`,`teacherEmailId`,`suspended`) values 
('s2@example.com','t3@example.com', false);

insert  into `records`(`studentEmailId`,`teacherEmailId`,`suspended`) values 
('s1@example.com','t3@example.com', false);







