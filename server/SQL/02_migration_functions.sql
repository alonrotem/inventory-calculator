use inventory;

#SET FOREIGN_KEY_CHECKS = 0;

#====================== FUNCTIONS ======================
#=======================================================

#--------------------------------------------------------
# add_column_if_not_exists
#--------------------------------------------------------
DROP PROCEDURE IF EXISTS add_column_if_not_exists;
DELIMITER $$
CREATE PROCEDURE add_column_if_not_exists (
    IN p_table_name VARCHAR(64),
    IN p_column_name VARCHAR(64),
    IN p_column_definition TEXT  -- e.g., 'VARCHAR(255) NOT NULL DEFAULT ""'
)
BEGIN
    DECLARE col_exists INT DEFAULT 0;
    DECLARE tbl_exists INT DEFAULT 0;
    DECLARE stmt_text TEXT;
    -- Check if the table exists in current DB
    SELECT COUNT(*) INTO tbl_exists
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = p_table_name;
    IF tbl_exists = 1 THEN
        -- Check if the column already exists
        SELECT COUNT(*) INTO col_exists
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = p_table_name
          AND COLUMN_NAME = p_column_name;
        -- If not, add the column
        IF col_exists = 0 THEN
            SET @stmt_text = CONCAT('ALTER TABLE `', p_table_name, '` ADD COLUMN `', p_column_name, '` ', p_column_definition);
            PREPARE stmt FROM @stmt_text;
            EXECUTE stmt;
            DEALLOCATE PREPARE stmt;
        END IF;
    END IF;
END$$
DELIMITER ;

#--------------------------------------------------------
# drop_column_if_exists
#--------------------------------------------------------
DROP PROCEDURE IF EXISTS drop_column_if_exists;
DELIMITER $$
CREATE PROCEDURE drop_column_if_exists (
    IN p_table_name VARCHAR(64),
    IN p_column_name VARCHAR(64)
)
BEGIN
    DECLARE col_exists INT DEFAULT 0;
    DECLARE tbl_exists INT DEFAULT 0;
    DECLARE stmt_text TEXT;
    -- Check if the table exists
    SELECT COUNT(*) INTO tbl_exists
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = p_table_name;
    IF tbl_exists = 1 THEN
        -- Check if the column exists
        SELECT COUNT(*) INTO col_exists
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = p_table_name
          AND COLUMN_NAME = p_column_name;
        -- Drop it if it exists
        IF col_exists = 1 THEN
            SET @stmt_text = CONCAT('ALTER TABLE `', p_table_name, '` DROP COLUMN `', p_column_name, '`');
            PREPARE stmt FROM @stmt_text;
            EXECUTE stmt;
            DEALLOCATE PREPARE stmt;
        END IF;
    END IF;
END$$
DELIMITER ;



#--------------------------------------------------------
# run_if_column_exists
#--------------------------------------------------------
DROP PROCEDURE IF EXISTS run_if_column_exists;
DELIMITER $$
CREATE PROCEDURE run_if_column_exists(
    IN p_table_name VARCHAR(64),
    IN p_column_name VARCHAR(64),
    IN p_sql_stmt TEXT
)
BEGIN
    DECLARE col_exists INT DEFAULT 0;
    -- Check if column exists
    SELECT COUNT(*) INTO col_exists
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = p_table_name
      AND COLUMN_NAME = p_column_name;

    -- If column exists, run the SQL statement
    IF col_exists > 0 THEN
        SET @sql = p_sql_stmt;
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$
DELIMITER ;

