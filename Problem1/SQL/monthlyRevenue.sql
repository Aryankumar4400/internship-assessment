SELECT
    MONTHNAME(order_date) AS month,
    SUM(amount) AS total_revenue,
    COUNT(order_id) AS total_orders
FROM Orders
WHERE YEAR(order_date) = 2024
GROUP BY MONTH(order_date), MONTHNAME(order_date)
ORDER BY total_revenue DESC;

/*
Expected Output Example:

month | total_revenue | total_orders
------------------------------------
March | 25000         | 15
January | 18000       | 12
February | 14000      | 9

Ordered from highest revenue to lowest.
*/