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
  ('John', 'Smith', 'john@smith.com', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 1),
  ('Sally', 'Jones', 'sally@jones.com', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 1);


 

 

insert into app_user_role
    values
    (1, 2),
    (2, 1);

INSERT INTO category (category_name)
VALUES
    ('Emergency Fund'), -- savings --
    ('Vacation Fund'), -- savings --
    ('Pay Off High-Interest Debt'), -- savings --
    ('Spending Money'), -- savings --
    ('Home Down Payment'), -- savings --
    ('Education'), -- savings --
    ('Retirement Fund'), -- savings --
    ('Childcare'), -- spending --
    ('Home Improvement'), -- savings --
    ('Mortgage/Rent'), -- spending --
    ('Food'), -- spending --
    ('Shopping'), -- spending --
    ('Entertainment'), -- spending --
    ('Car Payment'), -- spending --
    ('Investment Portfolio Growth'), -- savings --
    ('Gas'), -- spending --
    ('Repairs/Maintenance'), -- spending --
    ('Bills/Utilities'), -- spending --
    ('Fees'), -- spending --
    ('Supplies'), -- spending --
    ('Health/Fitness'), -- spending --
    ('Personal Care'), -- spending --
    ('Pets'), -- spending--
    ('Business Spending'), -- spending --
    ('Insurance'),-- spending --
    ('Income'), -- savings --
    ('Misc. Expenses'); -- spending --

 

    
INSERT INTO goals (app_user_id, category_id, goal_type, goal_amount, start_date, end_date)
VALUES
  -- User 1 Goals
  (1, 8, 'spending', 1500.00, '2023-08-01', '2023-08-31'), -- current month spending childcare
  (1, 10, 'spending', 1500.00, '2023-08-01', '2023-08-31'), -- current month spending rent
  (1, 11, 'spending', 550.00, '2023-08-01', '2023-08-31'),-- current month spending food
  (1, 16, 'spending', 550.00, '2023-07-01', '2023-07-31'), -- last month spending Gas
  (1, 11, 'spending', 1200.00, '2023-06-01', '2023-06-30'), -- last 3 months spending Food
  (1, 21, 'spending', 1500.00, '2022-08-01', '2022-08-31'), -- last year spending Health
  (1, 1, 'saving', 5000.00, '2023-08-01', '2023-12-31'), -- current month savings Emergency fund
  (1, 2, 'saving', 800.00, '2023-07-01', '2023-07-31'),  -- last month savings vacation
  (1, 4, 'saving', 300.00, '2023-08-01', '2023-12-31'), -- current month savings spending
  -- User 2 Goals
  (2, 8, 'spending', 80.00, '2023-08-01', '2023-08-31'),
  (2, 1, 'saving', 1800.00, '2023-08-01', '2023-08-31'),
  (2, 2, 'saving', 2500.00, '2023-08-01', '2023-12-31'),
  (2, 10, 'spending', 1200.00, '2023-08-01', '2023-09-30'),
  (1, 26, 'saving', 5000.00, '2023-08-01', '2023-08-31'); -- this month saving income


INSERT INTO goals (app_user_id, category_id, goal_type, goal_amount, start_date, end_date)
VALUES
  (1, 14, 'spending', 500.00, '2022-08-01', '2022-08-31'),
	(1, 6, 'saving', 500.00, '2022-08-01', '2022-08-31'),
	(1, 7, 'saving', 2500.00, '2022-08-01', '2022-08-31');

 

    
select * from category;
 

-- insert into reports (app_user_id, start_date, end_date, goal_type, report_url)
--     values
--     (1, '2023-08-01', '2023-08-31', 'spending', 'https://example.com/report/john_august.pdf'), 
--         (1, '2023-08-01', '2023-08-31', 'spending', 'https://example.com/report/john_august.pdf'), 
--     (2, '2023-08-01', '2023-08-31', 'spending', 'https://example.com/report/sally_august.pdf');


 

 

    -- Insert data into transaction table
INSERT INTO transaction (app_user_id, goals_id, amount, transaction_date, `description`)
VALUES
    (1, 1, 100.00, '2023-08-05', 'diapers'),
    (1, 14, 5000.00, '2023-08-01', 'general income'),
    (1, 1, 600.00, '2023-08-10', '2 weeks of babysitting'),
    (1, 1, 500.00, '2023-08-21', 'back to school shopping'),
    (1, 2, 1500.00, '2023-08-05', 'August Rent'),
    (1, 3, 100.00, '2023-08-01', 'Groceries'),
    (1, 3, 120.00, '2023-08-05', 'Chuck E Cheeze'),
    (1, 3, 75.00, '2023-08-20', 'Cheesecake Factory'),
    (1, 4, 50.00, '2023-07-16', 'Gas'),
    (1, 5, 100.00, '2023-06-20', 'Groceries'),
    (1, 6, 500.00, '2022-08-05', 'MRI'),
    (1, 7, 100.00, '2023-08-07', 'Bonus money'),
    (1, 8, 500.00, '2023-07-05', 'Money Towards July Vacation'),
    (1, 9, 600.00, '2023-08-14', 'dog sitting cash'),
     (2, 10, 100.00, '2023-08-05', 'diapers'),
    (2, 11, 350.00, '2023-08-20', 'saving for emergency fund'),
     (2, 12, 100.00, '2023-08-05', 'towards our vacation trip to rome'),
      (2, 13, 100.00, '2023-08-15', 'August Rent');

 

 

-- drop table if exists transaction;
-- select * from transaction;
-- select * from reports;
-- select * from goals;
-- select * from app_user;
-- select * from app_user_role;
-- select * from app_role;
-- select * from category;
-- select * from `transaction`;

 

 

-- SELECT
--     t.transaction_id,
--     t.app_user_id,
--     t.goals_id,
--     t.amount,
--     t.description,
--     t.transaction_date,
--     c.category_name,
--     g.goal_type
-- FROM
--     `transaction` t
-- JOIN
--     goals g ON t.goals_id = g.goals_id
-- JOIN
--     category c ON g.category_id = c.category_id;

 

 

-- -- -- find categories by type
-- -- SELECT c.category_name
-- -- FROM goals g
-- -- JOIN category c ON g.category_id = c.category_id
-- -- WHERE g.goal_type = 'spending';

 

 

-- -- -- get goal id by goal type and category_name
-- -- SELECT goals_id
-- -- FROM goals
-- -- WHERE goal_type = 'saving'
-- -- AND category_id = (
-- --     SELECT category_id
-- --     FROM category
-- --     WHERE category_name = 'Emergency Fund'
-- -- );

 

 

-- -- select * from transaction where app_user_id = 1 AND goal_type = "saving";--

 

-- select * from reports;

 

-- DELETE FROM reports
-- WHERE reports_id between 13 and 26;

 