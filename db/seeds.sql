INSERT INTO departments (name)
VALUES 
("Marketing"), 
("Customer Service"), 
("Human Resources"), 
("Management");

INSERT INTO roles (title, department_id, salary)
VALUES 
("Marketer", 1, 40000),
("Customer Service Rep", 3, 22000),
("HR Person", 3, 30000),
("Manager", 4, 50000);

INSERT INTO employees (first_name, last_name, role_id)
VALUES
("Brandon", "Baker", 1),
("Sandra", "Smith", 2),
("Trevor", "Trenkins", 3),
("Debbie", "Banks", 4);



UPDATE employees SET manager_id = 3 WHERE id = 4;
UPDATE employees SET manager_id = 1 WHERE id = 5;
UPDATE employees SET manager_id = 2 WHERE id = 6;
UPDATE employees SET manager_id = 2 WHERE id = 7;
