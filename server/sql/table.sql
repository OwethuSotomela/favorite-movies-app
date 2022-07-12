DROP TABLE IF EXISTS;
CREATE TABLE users(
    id SERIAL NOT NULL PRIMARY KEY,
    firstname VARCHAR NOT NULL,
    lastname VARCHAR NOT NULL,
	username VARCHAR(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL
);

DROP TABLE IF EXISTS;
CREATE TABLE user_playlist(
    id SERIAL NOT NULL PRIMARY KEY,
    users_id int,
    movie_list VARCHAR NOT NULL,
    FOREIGN KEY (users_id) REFERENCES users(id)
);