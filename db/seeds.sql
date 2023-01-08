INSERT INTO department (name)
VALUES  ("Sales"),
        ("Engineering"),
        ("Finance"),
        ("Legal");

INSERT INTO role (title, salary, department_id, is_manager)
VALUES  ("Sales Lead", 100000, 1, true),
        ("Salesperson", 80000, 1, false),
        ("Lead Engineer", 150000, 2, true),
        ("Software Engineer", 120000, 2, false),
        ("Account Manager", 160000, 3, true),
        ("Accountant", 125000, 3, false),
        ("Legal Team Lead", 250000, 4, true),
        ("Lawyer", 190000, 4, false);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("John", "Doe", 1, null),
        ("Mike", "Chan", 2, 1),
        ("Ashley", "Rodriguez", 3, null),
        ("Kevin", "Tupik", 4, 3),
        ("Kunal", "Singh", 5, null),
        ("Malia", "Brown", 6, 5),
        ("Sarah", "Lourd", 7, null),
        ("Tom", "Allen", 8, 7);