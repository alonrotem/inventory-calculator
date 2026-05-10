DELIMITER $$
CREATE PROCEDURE full_cleanup()
BEGIN
    DECLARE tbls_exist INT DEFAULT 0;

    SET FOREIGN_KEY_CHECKS = 0;

    SET @TABLES = NULL;

    SELECT count(*) FROM information_schema.tables WHERE table_schema = 'inventory' INTO tbls_exist;

    IF (tbls_exist > 0) THEN
        SELECT GROUP_CONCAT('`', table_schema, '`.`', table_name,'`') INTO @TABLES FROM information_schema.tables 
          WHERE table_schema = 'inventory';

        SET @TABLES = CONCAT('DROP TABLE IF EXISTS ', @TABLES);

        PREPARE stmt FROM @TABLES;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

    SET FOREIGN_KEY_CHECKS = 1;
END$$
DELIMITER ;

-- Set group_concat_max_len outside the procedure
SET SESSION group_concat_max_len = 1000000;
CALL full_cleanup();
SET SESSION group_concat_max_len = 1024;