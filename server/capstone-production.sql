drop database if exists budget;
create database budget;
use budget;


drop table if exists transaction;
drop table if exists reports;
drop table if exists goals;
drop table if exists app_user_role;
drop table if exists app_role;
drop table if exists app_user;
drop table if exists category;




create table app_user (
    app_user_id int primary key auto_increment,
    first_name text not null,
    last_name text not null,
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
     constraint fk_goals_app_user_id
        foreign key (app_user_id)
        references app_user(app_user_id),
    constraint fk_goals_category_id
        foreign key (category_id)
        references category(category_id)
);

create table reports (
	reports_id int primary key auto_increment, 
    app_user_id int not null,
    start_date date not null,
    end_date date not null,
    goal_type text not null,
    report_url text not null,
    constraint fk_reports_app_user_id
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
    CONSTRAINT fk_transaction_app_user_id
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
insert into app_user (first_name, last_name, username, password_hash, enabled)
    values
  ('Jonh', 'Smith', 'john@smith.com', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 1),
  ('Sally', 'Jones', 'sally@jones.com', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 1);
 


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

    
INSERT INTO goals (app_user_id, category_id, goal_type, goal_amount, start_date, end_date)
VALUES
  -- User 1 Goals
  (1, 1, 'spending', 120.00, '2023-08-01', '2023-08-31'),
  (1, 15, 'spending', 1200.00, '2023-08-01', '2023-08-31'),
  (2, 1, 'spending', 120.00, '2023-08-01', '2023-08-31'),
  (2, 15, 'spending', 1200.00, '2023-08-01', '2023-08-31'),
  (1, 2, 'saving', 1200.00, '2023-08-01', '2023-08-31'),
  (1, 3, 'saving', 1500.00, '2023-08-01', '2023-08-31'),
  (1, 5, 'saving', 5000.00, '2023-08-01', '2023-12-31'),
  (1, 9, 'saving', 800.00, '2023-08-01', '2023-12-31'),
  (1, 12, 'saving', 300.00, '2023-08-01', '2023-11-30'),
  -- User 2 Goals
  (2, 1, 'spending', 80.00, '2023-08-01', '2023-08-31'),
  (2, 3, 'saving', 1800.00, '2023-08-01', '2023-08-31'),
  (2, 6, 'saving', 2500.00, '2023-08-01', '2023-12-31'),
  (2, 7, 'spending', 120.00, '2023-08-01', '2023-09-30');


    

insert into reports (app_user_id, start_date, end_date, goal_type, report_url)
	values
    (1, '2023-08-01', '2023-08-31', 'spending', 'https://example.com/report/john_august.pdf'), 
	(1, '2023-08-01', '2023-08-31', 'spending', 'https://example.com/report/john_august.pdf'), 
    (2, '2023-08-01', '2023-08-31', 'spending', 'https://example.com/report/sally_august.pdf');
    


    -- Insert data into transaction table
INSERT INTO transaction (app_user_id, goals_id, amount, transaction_date, `description`)
VALUES
    (1, 1, 8000.00, '2023-08-05', 'spending on vacation'),
    (1, 2, 1000.00, '2023-08-10', 'saving to kids college'),
    (1, 3, 1100.00, '2023-08-20', 'saving to buy a new house'),
    (1, 4, 120.00, '2023-08-07', 'spending on entertainment'),
    (1, 5, 500.00, '2023-08-10', 'saving for a special occasion'),
    (1, 6, 3000.00, '2023-08-15', 'saving for a dream vacation'),
    (2, 7, 100.00, '2023-08-07', 'spending on hobbies'),
    (2, 8, 600.00, '2023-08-10', 'saving for electronics'),
    (2, 9, 1200.00, '2023-08-15', 'saving for future plans'),
    (2, 10, 350.00, '2023-08-20', 'spending on leisure activities');



drop table if exists transaction;
select * from transaction;
select * from reports;
select * from goals;
select * from app_user;
select * from app_user_role;
select * from app_role;
select * from category;
select * from `transaction`;



SELECT
    t.transaction_id,
    t.app_user_id,
    t.goals_id,
    t.amount,
    t.description,
    t.transaction_date,
    c.category_name,
    g.goal_type
FROM
    `transaction` t
JOIN
    goals g ON t.goals_id = g.goals_id
JOIN
    category c ON g.category_id = c.category_id;


-- -- find categories by type
-- SELECT c.category_name
-- FROM goals g
-- JOIN category c ON g.category_id = c.category_id
-- WHERE g.goal_type = 'spending';


-- -- get goal id by goal type and category_name
-- SELECT goals_id
-- FROM goals
-- WHERE goal_type = 'saving'
-- AND category_id = (
--     SELECT category_id
--     FROM category
--     WHERE category_name = 'Emergency Fund'
-- );


select * from transaction where app_user_id = 1 AND goal_type = "saving";

select * from reports;

DELETE FROM reports
WHERE reports_id between 13 and 26;


