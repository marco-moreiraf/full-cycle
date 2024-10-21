CREATE TABLE balances (
    id varchar(255) PRIMARY KEY, 
    account_id varchar(255) NOT NULL, 
    balance float NOT NULL, 
    created_at date NOT NULL, 
    updated_at date, 
    UNIQUE(account_id)
);

INSERT INTO balances (id, account_id, balance, created_at, updated_at) VALUES ('1', '1', 100, '2024-10-20', '2024-10-20');
INSERT INTO balances (id, account_id, balance, created_at, updated_at) VALUES ('2', '2', 200, '2024-10-20', '2024-10-20');
INSERT INTO balances (id, account_id, balance, created_at, updated_at) VALUES ('3', '3', 300, '2024-10-20', '2024-10-20');
INSERT INTO balances (id, account_id, balance, created_at, updated_at) VALUES ('4', '4', 400, '2024-10-20', '2024-10-20');