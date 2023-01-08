UPDATE employee
SET employee.manager = (
    SELECT CONCAT(first_name, " ", last_name)
    FROM (SELECT * FROM employee) AS temp 
    WHERE temp.id = employee.manager_id);

UPDATE employee e
JOIN role r
ON e.role_id = r.id
SET e.are_manager = r.is_manager;

CREATE TABLE temp_table AS
SELECT e.id, e.first_name, e.last_name, e.role_id, e.manager_id, e.manager, e.are_manager, r.title, r.salary, r.department_id, r.is_manager, d.name
FROM employee e
JOIN role r ON e.role_id = r.id
JOIN department d ON r.department_id = d.id;

UPDATE temp_table q
SET q.manager_id = (SELECT e2.id FROM 
(SELECT e.id, e.first_name, e.last_name, e.role_id, e.manager_id, e.manager, e.are_manager, r.title, r.salary, r.department_id, r.is_manager, d.name
FROM employee e
JOIN role r ON e.role_id = r.id
JOIN department d ON r.department_id = d.id) e2 WHERE e2.are_manager = 1 AND e2.department_id = q.department_id LIMIT 1)
WHERE q.id = (SELECT MAX(id) FROM employee) AND q.are_manager = 0;

UPDATE employee e
INNER JOIN temp_table t ON e.id = t.id
SET e.manager_id = t.manager_id;

DROP DATABASE IF EXISTS temp_table;

