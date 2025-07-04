use inventory;
#SET FOREIGN_KEY_CHECKS = 0;
/*
#==========
-- Check if the table exists
SET @table_exists = (SELECT COUNT(*) num FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'alon');
-- Prepare the INSERT statement only if the table exists
SET @sql = IF(@table_exists > 0, "INSERT INTO `alon` (`name`) VALUES ('test')", 'SELECT 1');

-- Execute the prepared statement
PREPARE stmt FROM @sql;
EXECUTE stmt; #USING @value1, @value2;
DEALLOCATE PREPARE stmt;
#==========
select * from `alon`;
drop table if exists `alon`;
*/

/*
Remove hats and hat_wings table
Create customer_hats with id, name, wing info, material and customer id
Add customer id to wings table, allow customer save their custom wings
*/
/*
# Drop foreign key if exists:
SET @table_name = 'hats_wings', @fk_name = 'fk_hat_parent_wing_id'; SET @sql = (SELECT IF(EXISTS (SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_NAME = @table_name AND CONSTRAINT_TYPE = 'FOREIGN KEY' AND CONSTRAINT_NAME = @fk_name), CONCAT('ALTER TABLE ', @table_name, ' DROP FOREIGN KEY ', @fk_name), concat('SELECT "Foreign key ', @fk_name ,' does not exist"'))); PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
*/

/* Drop old tables */
/*
drop table if exists hats;
drop table if exists hats_wings;
*/

/*
# -----------------------------------
# Add column if doesn't exist
SET @tbl='wings';
SET @col='customer_id';
SET @col_type='INT NULL';
SET @sttmnt = CONCAT('ALTER TABLE ', @tbl ,' ADD COLUMN ', @col ,' ', @col_type, ';');
SET @col_exists = (
    SELECT COUNT(*) FROM information_schema.COLUMNS 
		WHERE TABLE_NAME = @tbl 
		AND COLUMN_NAME = @col 
		AND TABLE_SCHEMA = DATABASE()
);
SET @query = IF(@col_exists = 0, @sttmnt, 'SELECT 1');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
# End: Add column if doesn't exist
# -----------------------------------

# -----------------------------------
DELETE from material_colors;

# Add column if doesn't exist
SET @tbl='material_colors';
SET @col='priority';
SET @col_type='int not null';
SET @sttmnt = CONCAT('ALTER TABLE ', @tbl ,' ADD COLUMN ', @col ,' ', @col_type, ';');
SET @col_exists = (
    SELECT COUNT(*) FROM information_schema.COLUMNS 
		WHERE TABLE_NAME = @tbl 
		AND COLUMN_NAME = @col 
		AND TABLE_SCHEMA = DATABASE()
);
SET @query = IF(@col_exists = 0, @sttmnt, 'SELECT 1');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

Insert into `material_colors` (`priority`, `color`)
VALUES
(10, 'Natural'), (20, 'Light brown'), (30, 'Brown'), (40, 'Dark brown'), (50, 'Black'), (60, 'Mixed color');
# End: Add column if doesn't exist
# -----------------------------------

# -----------------------------------
# Add constraint if doesn't exist
SET @tablename = "wings";
SET @constraintname = "fk_wing_customer_id";
SET @columnname = "customer_id";
SET @othertablename = "customers";
SET @othercolumnname = "id";
SET @sttmnt = CONCAT("ALTER TABLE ",@tablename, " ADD CONSTRAINT ",@constraintname, " FOREIGN KEY(",@columnname,")",
	" REFERENCES ",@othertablename,"(",@othercolumnname,") ON DELETE CASCADE");
SET @preparedStatement = (SELECT IF((
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE (table_name = @tablename) AND (table_schema = DATABASE()) AND (constraint_name = @constraintname) ) > 0,
	"SELECT 1", @sttmnt));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;
# End: Add constraint if doesn't exist
# -----------------------------------

# -----------------------------------
# Add column if doesn't exist
SET @tbl='customer_hats';
SET @col='shorten_top_by';
SET @col_type='float NULL';
SET @sttmnt = CONCAT('ALTER TABLE ', @tbl ,' ADD COLUMN ', @col ,' ', @col_type, ';');
SET @col_exists = (
    SELECT COUNT(*) FROM information_schema.COLUMNS 
		WHERE TABLE_NAME = @tbl 
		AND COLUMN_NAME = @col 
		AND TABLE_SCHEMA = DATABASE()
);
SET @query = IF(@col_exists = 0, @sttmnt, 'SELECT 1');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
# End: Add column if doesn't exist
# -----------------------------------

# -----------------------------------
# Add column if doesn't exist
SET @tbl='customer_hats';
SET @col='shorten_crown_by';
SET @col_type='float NULL';
SET @sttmnt = CONCAT('ALTER TABLE ', @tbl ,' ADD COLUMN ', @col ,' ', @col_type, ';');
SET @col_exists = (
    SELECT COUNT(*) FROM information_schema.COLUMNS 
		WHERE TABLE_NAME = @tbl 
		AND COLUMN_NAME = @col 
		AND TABLE_SCHEMA = DATABASE()
);
SET @query = IF(@col_exists = 0, @sttmnt, 'SELECT 1');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
# End: Add column if doesn't exist
# -----------------------------------

#*******************************************************************
# -----------------------------------
# Add column if doesn't exist
SET @tbl='customer_banks_allocations';
SET @col='tails_quantity';
SET @col_type='INT NOT NULL DEFAULT(0)';
SET @sttmnt = CONCAT('ALTER TABLE ', @tbl ,' ADD COLUMN ', @col ,' ', @col_type, ';');
SET @col_exists = (
    SELECT COUNT(*) FROM information_schema.COLUMNS 
		WHERE TABLE_NAME = @tbl 
		AND COLUMN_NAME = @col 
		AND TABLE_SCHEMA = DATABASE()
);
SET @query = IF(@col_exists = 0, @sttmnt, 'SELECT 1');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
# End: Add column if doesn't exist
# -----------------------------------
# -----------------------------------
# Add column if doesn't exist
SET @tbl='customer_banks_allocations';
SET @col='tails_in_orders';
SET @col_type='INT NOT NULL DEFAULT(0)';
SET @sttmnt = CONCAT('ALTER TABLE ', @tbl ,' ADD COLUMN ', @col ,' ', @col_type, ';');
SET @col_exists = (
    SELECT COUNT(*) FROM information_schema.COLUMNS 
		WHERE TABLE_NAME = @tbl 
		AND COLUMN_NAME = @col 
		AND TABLE_SCHEMA = DATABASE()
);
SET @query = IF(@col_exists = 0, @sttmnt, 'SELECT 1');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
# End: Add column if doesn't exist
# -----------------------------------


SET FOREIGN_KEY_CHECKS = 1;
*/
