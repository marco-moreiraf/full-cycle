CREATE TABLE clients (
    id varchar(255), 
    name varchar(255), 
    email varchar(255), 
    created_at date, 
    updated_at date
);

CREATE TABLE accounts (
    id varchar(255), 
    client_id varchar(255), 
    balance float, 
    created_at date, 
    updated_at date
);

CREATE TABLE transactions (
    id varchar(255), 
    account_id_from varchar(255), 
    account_id_to varchar(255), 
    amount float, 
    created_at date
);

INSERT INTO clients (id, name, email, created_at, updated_at) VALUES ('1', 'Client 1', 'client1@email.com', '2024-10-20', '2024-10-20');
INSERT INTO clients (id, name, email, created_at, updated_at) VALUES ('2', 'Client 2', 'client2@email.com', '2024-10-20', '2024-10-20');
INSERT INTO accounts (id, client_id, balance, created_at, updated_at) VALUES ('1', '1', 1000, '2024-10-20', '2024-10-20');
INSERT INTO accounts (id, client_id, balance, created_at, updated_at) VALUES ('2', '2', 1000, '2024-10-20', '2024-10-20');