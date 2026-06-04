SELECT
    d.dept_name,
    e.name,
    e.salary
FROM Employees e
JOIN Departments d
ON e.dept_id = d.dept_id
WHERE e.salary =
(
    SELECT MAX(salary)
    FROM Employees
    WHERE dept_id = e.dept_id
);

/*
Expected Output Example:

dept_name | name  | salary
--------------------------------
IT        | Aryan | 90000
HR        | Neha  | 70000
Sales     | Ravi  | 85000

If multiple employees have the same highest salary,
all of them will be shown.
*/