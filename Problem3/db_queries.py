def get_monthly_attendance(conn, employee_id, month, year):
    query = """
        SELECT a.date,
               a.check_in,
               a.check_out,
               e.name

        FROM attendance a

        -- Fix A: INNER JOIN
        INNER JOIN employees e
        ON a.employee_id = e.id

        WHERE a.employee_id = ?
        AND a.month = ?
        AND a.year = ?

        ORDER BY a.date ASC
    """

    cursor = conn.cursor()

    # Fix B: employee_id passed
    cursor.execute(query,
                   (employee_id, month, year))

    return cursor.fetchall()