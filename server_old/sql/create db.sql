use inventory;
drop table if exists raw_materials;

CREATE TABLE  IF NOT EXISTS `raw_materials`
(
  `id`            INT NOT NULL auto_increment ,
  `name`          VARCHAR(255) NOT NULL ,
  `purchased_at`  DATE NOT NULL DEFAULT(CURRENT_DATE),
  `weight`   	  INT NULL ,
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `updated_at`    DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `created_by`	 int null,
  `updated_by`	 int null,
  PRIMARY KEY (`id`)
);

insert into raw_materials (`name`, `purchased_at`,  `weight`, `created_by`, `updated_by`)
values
('Gold', '2024-06-08', 30, 1, 1)