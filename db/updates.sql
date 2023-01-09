--updates to set employee manager for each employee based on manager_id before running application

UPDATE employee
SET employee.manager = (
    SELECT CONCAT(first_name, " ", last_name)
    FROM (SELECT * FROM employee) AS temp 
    WHERE temp.id = employee.manager_id);

UPDATE employee e
JOIN role r
ON e.role_id = r.id
SET e.are_manager = r.is_manager;

