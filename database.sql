-- tabla de usuarios
DROP TABLE IF EXISTS users;

CREATE TABLE `users` (
    `user_id` char(36) NOT NULL,
    `username` varchar(100) NOT NULL,
    `password_hash` varchar(255) NOT NULL,
    `full_name` varchar(200) DEFAULT NULL,
    `email` varchar(200) DEFAULT NULL,
    `last_login` datetime DEFAULT NULL,
    `created` datetime DEFAULT CURRENT_TIMESTAMP,
    `updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `username` (`username`),
    UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--

-- tabla de autos (se omite el año ya que se puede sacar de el created)
DROP TABLE IF EXISTS cars;

CREATE TABLE `cars` (
    `car_id` char(36) NOT NULL,
    `brand` VARCHAR(20) NOT NULL,
    `model` VARCHAR(50) NOT NULL,
    `year_of_car` INT NOT NULL,
    `color` VARCHAR(15) NOT NULL,
    `purchase_date` DATE NOT NULL,
    `sale_date` DATE NULL,
    `status` ENUM(
        'Vendido',
        'Inventario',
        'En espera',
        'Reparacion'
    ) NOT NULL,
    `purchase_price` DECIMAL(10, 2) NOT NULL,
    `price_for_sale` DECIMAL(10, 2) NULL,
    `created` datetime DEFAULT CURRENT_TIMESTAMP,
    `updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (car_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX idx_brand_model ON cars (brand, model);

CREATE INDEX idx_dates on cars (purchase_date, sale_date);

CREATE INDEX idx_year_of_car ON cars (year_of_car);
--

-- tabla de costos por cada carro y sus notas o subcategorias
DROP TABLE IF EXISTS car_costs;

CREATE TABLE car_costs (
    `cost_id` CHAR(36) NOT NULL,
    `car_id` CHAR(36) NOT NULL,
    cost_type ENUM(
        'llantas',
        'hojalateria',
        'tapiceria',
        'cielo',
        'volante',
        'funda',
        'mecanico',
        'tapones',
        'multa',
        'kit',
        'sombrerera',
        'rin_llaveta',
        'aceite',
        'tapon_facion',
        'alineacion',
        'manija',
        'faros_calaveras'
    ) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    note VARCHAR(255),
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (cost_id),
    CONSTRAINT fk_cost_car FOREIGN KEY (car_id) REFERENCES cars (car_id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX idx_car_cost_type ON car_costs (car_id, cost_type);
--

-- tabla de movimientos o gastos
DROP TABLE IF EXISTS movements;

CREATE TABLE `movements` (
    `movements_id` char(36) NOT NULL,
    `movements_category_id` char(36) NOT NULL, -- id de foreign key al catalogo de refacciones o gasolina
    `car_id` char(36) NOT NULL, -- id del carro a cargar su movimiento o gastos extras
    `type` ENUM('Compra', 'Gasto') NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `description` VARCHAR(120),
    `created` datetime DEFAULT CURRENT_TIMESTAMP,
    `updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (movements_id),
    CONSTRAINT fk_movements_car FOREIGN KEY (car_id) REFERENCES cars (car_id) ON DELETE CASCADE,
    CONSTRAINT fk_movements_category FOREIGN KEY (movements_category_id) REFERENCES movements_category (category_id) ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX idx_movements_car ON movements (car_id);

CREATE INDEX idx_movements_category ON movements (movements_category_id);
--

-- tabla de inversionistas (se omite el año ya que se puede sacar de el created)
DROP TABLE IF EXISTS investor;

CREATE TABLE `investor` (
    `investor_id` char(36) NOT NULL,
    `user_id` char(36) NOT NULL,
    `investment_amount` DECIMAL(10, 2) NOT NULL,
    `created` datetime DEFAULT CURRENT_TIMESTAMP,
    `updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (investor_id),
    CONSTRAINT fk_investor_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX idx_investor_user ON investor (user_id);
--

-- catalogo de gastos o movimientos (categorias)
DROP TABLE IF EXISTS movements_category;

CREATE TABLE `movements_category` (
    `category_id` char(36) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `type` ENUM('Activo', 'Pasivo') NOT NULL,
    PRIMARY KEY (category_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--