drop database if exists budget;
create database budget;
use budget;


drop table if exists app_user_role;
drop table if exists app_role;
drop table if exists app_user;

create table app_user (
    app_user_id int primary key auto_increment,
    username varchar(50) not null unique,
    password_hash varchar(2048) not null,
    enabled bit not null default(1)
);

create table app_role (
    app_role_id int primary key auto_increment,
    `name` varchar(50) not null unique
);

create table app_user_role (
    app_user_id int not null,
    app_role_id int not null,
    constraint pk_app_user_role
        primary key (app_user_id, app_role_id),
    constraint fk_app_user_role_user_id
        foreign key (app_user_id)
        references app_user(app_user_id),
    constraint fk_app_user_role_role_id
        foreign key (app_role_id)
        references app_role(app_role_id)
);

create table category (
	category_id int primary key auto_increment,
    category_name text not null
);

create table goals (
	goals_id int primary key auto_increment,
    app_user_id int not null,
    category_id int not null,
    goal_type text not null,
    goal_amount decimal not null,
    start_date date not null,
    end_date date not null,
     constraint fk_goals_app_user_app_user_id
        foreign key (app_user_id)
        references app_user(app_user_id),
    constraint fk_category_category_id
        foreign key (category_id)
        references category(category_id)
);

create table reports (
	reports_id int primary key auto_increment, 
    app_user_id int not null,
    start_date date not null,
    end_date date not null,
    report_url text not null,
    constraint fk_reports_app_user_app_user_id
        foreign key (app_user_id)
        references app_user(app_user_id)
);

CREATE TABLE `transaction` (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT, 
    app_user_id INT NOT NULL,
    goals_id int not null,
    amount DECIMAL,
    `description` TEXT,
    transaction_date DATE NOT NULL,
    CONSTRAINT fk_transaction_app_user_app_user_id
        FOREIGN KEY (app_user_id)
        REFERENCES app_user(app_user_id),
    CONSTRAINT fk_goals_goals_id
        FOREIGN KEY (goals_id)
        REFERENCES goals(goals_id)
);


insert into app_role (`name`) values
    ('USER'),
    ('ADMIN');

-- passwords are set to "P@ssw0rd!"
insert into app_user (username, password_hash, enabled)
    values
    ('john@smith.com', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 1),
    ('sally@jones.com', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 1);

insert into app_user_role
    values
    (1, 2),
    (2, 1);
    
INSERT INTO category (category_name)
VALUES
    ('Emergency Fund'),
    ('Vacation Fund'),
    ('Pay Off High-Interest Debt'),
    ('Buy a Car'),
    ('Home Down Payment'),
    ('Higher Education'),
    ('Starting a Business'),
    ('Family Planning'),
    ('Retirement Savings'),
    ('Mortgage Payoff'),
    ('Financial Independence'),
    ('Education Fund for Children'),
    ('Estate Planning'),
    ('World Travel'),
    ('Investment Portfolio Growth');

    
insert into goals (app_user_id, category_id, goal_type, goal_amount, start_date, end_date)
	values
    (1, 1, 'spending', 120.00, '2023-08-01', '2023-08-31'),
    (1, 2, 'saving', 1200.00, '2023-08-01', '2023-08-31'),
    (1, 3, 'saving', 1500.00, '2023-08-01', '2023-08-31'),
    (2, 4, 'spending', 65.00, '2023-08-01', '2023-08-31'),
    (1, 5, 'saving', 5000.00, '2023-08-01', '2023-12-31'),
    (2, 7, 'spending', 150.00, '2023-08-01', '2023-09-30'),
    (1, 9, 'saving', 800.00, '2023-08-01', '2023-12-31'),
    (1, 12, 'saving', 300.00, '2023-08-01', '2023-11-30');
    

insert into reports (app_user_id, start_date, end_date, report_url)
	values
    (1, '2023-08-01', '2023-08-31', 'https://example.com/report/john_august.pdf'), 
    (2, '2023-08-01', '2023-08-31', 'https://example.com/report/sally_august.pdf');
    
insert into transaction (app_user_id, goals_id, amount, transaction_date, `description`)
	values
    (1, 1, 8000.00, '2023-08-05', 'spending'),
    (1, 2, 1000.00, '2023-08-10', 'saving'),
    (1, 3, 1100.00, '2023-08-20', 'saving'),
    (2, 4, 280.00, '2023-08-07', 'spending');
    
     select * from goals where app_user_id = 1 ;
     
     
SELECT
    t.transaction_id,
    t.app_user_id,
    t.goals_id,
    t.amount,
    t.description,
    t.transaction_date,
    c.category_name
FROM
    `transaction` t
JOIN
    goals g ON t.goals_id = g.goals_id
JOIN
    category c ON g.category_id = c.category_id;


    
    -- Insert data into transaction table
INSERT INTO `transaction` (app_user_id, goals_id, amount, transaction_date, `description`)
VALUES
    (1, 1, 8000.00, '2023-08-05', 'spending'),   
    (1, 2, 1000.00, '2023-08-10', 'saving'),      
    (1, 3, 1100.00, '2023-08-20', 'saving'),      
    (2, 4, 280.00, '2023-08-07', 'spending');     


select * from app_role;
select * from app_user;
select * from category;
select * from goals;

select * from goals;

drop table if exists transaction;


select * from transaction;