-- ****************** SqlDBM: MySQL ******************;
-- ***************************************************;
CREATE DATABASE MovieDB;

Use MovieDB;

DROP TABLE `StarMovie`;
DROP TABLE `UserMovie`;
DROP TABLE `Star`;
DROP TABLE `Movie`;
DROP TABLE `User`;

-- ************************************** `Star`

CREATE TABLE `Star`
(
 `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
 `name`        VARCHAR(45) NOT NULL,
 `photo_url`     CHAR(32) NOT NULL,
 `is_actor`    TINYINT(1) NOT NULL,
 `is_director` TINYINT(1) NOT NULL,
PRIMARY KEY (`id`)
) AUTO_INCREMENT=1;



-- ************************************** `Movie`

CREATE TABLE `Movie`
(
 `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
 `title`         VARCHAR(45) NOT NULL,
 `photo_url`     CHAR(32) NOT NULL,
 `lenght`        INT NOT NULL,
 `released_date` DATE NOT NULL,

PRIMARY KEY (`id`)
) AUTO_INCREMENT=1;

-- ************************************** `User`

CREATE TABLE `User`
(
 `id`      INT UNSIGNED NOT NULL AUTO_INCREMENT,
 `email`   VARCHAR(45) NOT NULL,
 `fbToken` TINYTEXT,
 `name`    VARCHAR(45) NOT NULL,
 `photo_url`     CHAR(32) NOT NULL,
PRIMARY KEY (`id`)
) AUTO_INCREMENT=1;

-- ************************************** `StarMovie`

CREATE TABLE `StarMovie`
(
 `id`       INT UNSIGNED NOT NULL,
 `movie_id` INT UNSIGNED NOT NULL,
 `star_id`  INT UNSIGNED NOT NULL,

PRIMARY KEY (`id`),
KEY `FK_MovieID` (`movie_id`),
CONSTRAINT `CT_StarMovie_MovieID` FOREIGN KEY `FK_MovieID` (`movie_id`) REFERENCES `Movie` (`id`),
KEY `FK_StarID` (`star_id`),
CONSTRAINT `CT_StarMovie_SM_StarID` FOREIGN KEY `FK_StarID` (`star_id`) REFERENCES `Star` (`id`)
) AUTO_INCREMENT=1;

-- ************************************** `UserMovie`

CREATE TABLE `UserMovie`
(
 `id`       INT UNSIGNED NOT NULL AUTO_INCREMENT,
 `toWatch`  TINYINT(1) NOT NULL,
 `watched`  TINYINT(1) NOT NULL,
 `favorite` TINYINT(1) NOT NULL,
 `review`   TINYINT NOT NULL,
 `user_id` INT UNSIGNED NOT NULL,
 `movie_id` INT UNSIGNED NOT NULL,

PRIMARY KEY (`id`),
KEY `FK_MovieID` (`movie_id`),
CONSTRAINT `CT_UserMovie_MovieID` FOREIGN KEY `FK_MovieID` (`movie_id`) REFERENCES `Movie` (`id`),
KEY `FK_UserID` (`user_id`),
CONSTRAINT `CT_UserMovie_UserID` FOREIGN KEY `FK_UserID` (`user_id`) REFERENCES `User` (`id`)
) AUTO_INCREMENT=1;


-- ************************************** INSERTS ************************************** --


INSERT INTO Movie (id, title, photo_url, lenght, released_date) 
    VALUES (0, 'The Matrix', 'the-matrix.jpg', 136, '1999-03-31');
INSERT INTO Movie (id, title, photo_url, lenght, released_date) 
    VALUES (0, 'The Matrix Reloaded', 'the-matrix.jpg-2', 138, '2003-05-15');
INSERT INTO Movie (id, title, photo_url, lenght, released_date) 
    VALUES (0, 'The Matrix Revolution', 'the-matrix.jpg-3', 129, '2003-11-05');

INSERT INTO Star (id, name, photo_url, is_actor, is_director) 
    VALUES (0, 'Keanu Reeves', 'keanu-reeves.jpg', true, false);

INSERT INTO StarMovie (id, movie_id, star_id) 
    VALUES (0, 1, 1);

INSERT INTO User (id, email, fbToken, name, photo_url) 
    VALUES (0, 'rafaelbcdr@gmail.com', '', 'Rafael Reis', 'rafael-reis.jpg');


INSERT INTO UserMovie (id, toWatch, watched, favorite, review, user_id, movie_id) 
    VALUES (0, false, true, true, 9, 1, 1);
