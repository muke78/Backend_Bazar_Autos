-- TOTAL DE CARROS KPI
-- Total de carros que se han vendido
SELECT YEAR(created) AS year, MONTH(created) AS month, status, COUNT(*) AS total_cars
FROM cars
WHERE
    created >= '2025-01-01'
    AND created < '2026-01-01'
GROUP BY
    YEAR(created),
    MONTH(created),
    status
ORDER BY year ASC, month ASC;

-- INVERSION KPI
-- Graficar la inversion total por año
SELECT YEAR(created) AS year, MONTH(created) AS month, SUM(purchase_price) AS total_purchase_price
FROM bazar_autos.cars
WHERE
    YEAR(created) = 2026
GROUP BY
    YEAR(created),
    MONTH(created)
ORDER BY year ASC, month ASC;

-- Utilidad por mes (ideal para gráficas)
SELECT YEAR(created) AS year, MONTH(created) AS month, SUM(
        price_for_sale - purchase_price
    ) AS total_profit
FROM cars
WHERE
    status = 'Vendido'
    AND price_for_sale IS NOT NULL
    AND created >= '2024-01-01'
    AND created < '2025-01-01'
GROUP BY
    YEAR(created),
    MONTH(created)
ORDER BY year ASC, month ASC;

-- Utilidad promedio
SELECT AVG(
        price_for_sale - purchase_price
    ) AS average_profit
FROM cars
WHERE
    status = 'Vendido';

-- Utilidad por marca
SELECT brand, SUM(
        price_for_sale - purchase_price
    ) AS total_profit
FROM cars
WHERE
    status = 'Vendido'
GROUP BY
    brand
ORDER BY total_profit DESC;

-- Top carros con mayor utilidad
SELECT
    brand,
    model,
    year_of_car,
    purchase_price,
    price_for_sale,
    (
        price_for_sale - purchase_price
    ) AS profit
FROM cars
WHERE
    status = 'Vendido'
ORDER BY profit DESC
LIMIT 10;

-- GRAFICAS QUE SE TIENE CONTEMPLADAS Y COMO SE PUEDEN INTEGRAR A EL SISTEMA
-- Autos por marcas

SELECT brand, COUNT(*) AS total_cars
FROM cars
GROUP BY
    brand
ORDER BY total_cars DESC;

-- Solo autos venidos
SELECT brand, COUNT(*) AS total_cars
FROM cars
WHERE
    status = 'Vendido'
GROUP BY
    brand
ORDER BY total_cars DESC;

-- Utilidad total por año
SELECT YEAR(created) AS year, SUM(
        price_for_sale - purchase_price
    ) AS total_profit
FROM cars
WHERE
    status = 'Vendido'
    AND price_for_sale IS NOT NULL
    AND created >= '2024-01-01'
    AND created < '2025-01-01'
GROUP BY
    YEAR(created)
ORDER BY year ASC;

-- Dashboard PRO (muy buena)
SELECT
    user_id,
    COUNT(*) AS total_movements,
    SUM(investment_amount) AS total_invested,
    AVG(investment_amount) AS average_investment
FROM investor
GROUP BY
    user_id
ORDER BY total_invested DESC;

-- Gastos por categoría ESTE SI ES MUY IMPORTANTE
SELECT
    mc.name AS category_name,
    mc.type,
    SUM(m.amount) AS total_amount
FROM
    movements m
    INNER JOIN movements_category mc ON mc.category_id = m.movements_category_id
GROUP BY
    mc.name,
    mc.type
ORDER BY total_amount DESC;

-- KPIS DE CARROS
-- Top carros que más rápido se vendieron
SELECT
    brand,
    model,
    year_of_car,
    purchase_date,
    sale_date,
    DATEDIFF(sale_date, purchase_date) AS days_to_sell
FROM cars
WHERE
    status = 'Vendido'
    AND sale_date IS NOT NULL
ORDER BY days_to_sell ASC
LIMIT 10;

-- KPI MUCHO MÁS IMPORTANTE (PRO)
-- Promedio de días por marca
-- ESTA es probablemente la mejor gráfica.

SELECT 
    brand,
    COUNT(*) AS total_sold,
    AVG(DATEDIFF(sale_date, purchase_date)) AS avg_days_to_sell
FROM
    cars
WHERE
    status = 'Vendido'
        AND sale_date IS NOT NULL
GROUP BY brand
HAVING total_sold >= 2
ORDER BY avg_days_to_sell ASC;

-- Utilidad + velocidad
SELECT 
    brand,
    model,
    DATEDIFF(sale_date, purchase_date) AS days_to_sell,
    (price_for_sale - purchase_price) AS profit
FROM
    cars
WHERE
    status = 'Vendido'
        AND sale_date IS NOT NULL
ORDER BY days_to_sell ASC , profit DESC;