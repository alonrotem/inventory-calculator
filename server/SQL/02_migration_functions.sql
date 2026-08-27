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
-- select @stmt_text;
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
# run a sql statement if column exists
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

#--------------------------------------------------------
# convert_column_type (if column exists)
#--------------------------------------------------------
DROP PROCEDURE IF EXISTS convert_column_type;
DELIMITER $$
CREATE PROCEDURE convert_column_type(
    IN p_table_name VARCHAR(64),
    IN p_column_name VARCHAR(64),
    IN p_new_column_type VARCHAR(256)
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
	    SET @sql = CONCAT(
	        'ALTER TABLE `', p_table_name, '` ',
	        'MODIFY COLUMN `', p_column_name, '` ', p_new_column_type
	    );
    -- select @sql;
	    PREPARE stmt FROM @sql;
	    EXECUTE stmt;
	    DEALLOCATE PREPARE stmt;
    END IF;
END$$
DELIMITER ;

#--------------------------------------------------------
# rename_column (if column exists)
#--------------------------------------------------------
DROP PROCEDURE IF EXISTS rename_column;
DELIMITER $$
CREATE PROCEDURE rename_column (
    IN p_table_name VARCHAR(64),
    IN p_column_name VARCHAR(64),
    IN p_new_name VARCHAR(256)
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
	    SET @sql = CONCAT(
	        'ALTER TABLE `', p_table_name, '` ',
	        'RENAME COLUMN `', p_column_name, '` TO `', p_new_name, '`'
	    );
	    PREPARE stmt FROM @sql;
	    EXECUTE stmt;
	    DEALLOCATE PREPARE stmt;
    END IF;
END$$
DELIMITER ;

#--------------------------------------------------------
# Drop foreign key if exists
#--------------------------------------------------------
DROP PROCEDURE IF EXISTS drop_fk;
DELIMITER $$
CREATE PROCEDURE drop_fk (
    IN p_table_name VARCHAR(64),
    IN fk_name VARCHAR(64)
)
BEGIN
	DECLARE col_exists INT DEFAULT 0;
	-- Check if column exists
	
    SELECT COUNT(*) INTO col_exists
    FROM INFORMATION_SCHEMA.table_constraints
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = p_table_name
      AND constraint_name = fk_name
      AND constraint_type = 'FOREIGN KEY';

    -- If column exists, run the SQL statement
    IF col_exists > 0 THEN
	    SET @sql = CONCAT(
	        'ALTER TABLE `', p_table_name, '` ',
	        'DROP FOREIGN KEY `', fk_name, '`'
	    );
	    PREPARE stmt FROM @sql;
	    EXECUTE stmt;
	    DEALLOCATE PREPARE stmt;
    END IF;
END$$
DELIMITER ;

#--------------------------------------------------------
# Add foreign key if doesn't exists
#--------------------------------------------------------
DROP PROCEDURE IF EXISTS add_fk;
DELIMITER $$
CREATE PROCEDURE add_fk (
    IN p_table_name VARCHAR(64),
    IN fk_name VARCHAR(64),
    IN fk_column VARCHAR(64),
    IN ref_table VARCHAR(64),
    IN ref_column VARCHAR(64),
    in on_delete_cascade BOOL
)
BEGIN
	DECLARE col_exists INT DEFAULT 0;
	-- Check if column exists
	
    SELECT COUNT(*) INTO col_exists
    FROM INFORMATION_SCHEMA.table_constraints
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = p_table_name
      AND constraint_name = fk_name
      AND constraint_type = 'FOREIGN KEY';

    -- If column exists, run the SQL statement
    IF col_exists = 0 THEN
	    SET @sql = CONCAT(
	        'ALTER TABLE `', p_table_name, '` ',
	        'ADD CONSTRAINT `', fk_name, '` ',
	        'FOREIGN KEY (`', fk_column ,'`) ',
	        'REFERENCES ', ref_table ,'(`', ref_column ,'`)'
	    );
    	if on_delete_cascade then
    		SET @sql = CONCAT(@sql, ' on delete cascade');
    	end if;
	    PREPARE stmt FROM @sql;
	    EXECUTE stmt;
	    DEALLOCATE PREPARE stmt;
    END IF;
END$$
DELIMITER ;

select "Migration functions done", CURRENT_TIMESTAMP;
