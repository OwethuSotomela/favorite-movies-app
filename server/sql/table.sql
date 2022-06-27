CREATE TABLE user(
    id SERIAL NOT NULL PRIMARY KEY,
    firstname VARCHAR NOT NULL,
    lastname VARCHAR NOT NULL,
	username VARCHAR(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL
);

-- CREATE TABLE user_playlist(
--     id SERIAL NOT NULL PRIMARY KEY,
--     user_id 
--     movie_list 
--     );