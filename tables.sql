CREATE TABLE players (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(250),
    nickname VARCHAR(250),
    email VARCHAR(100),
    password VARCHAR(250),
    status VARCHAR(20),
    UNIQUE (email, nickname)
);

INSERT INTO players (name, nickname, email, password, status) VALUES ('Lucas', 'Taborda', 'lucasadmin123@gmail.com', 'admin', 'admin');
