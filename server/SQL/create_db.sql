use inventory;
drop table if exists raw_materials;
drop table if exists babies;

CREATE TABLE  IF NOT EXISTS `raw_materials`
(
  `id`            INT NOT NULL auto_increment ,
  `name`          VARCHAR(255) NOT NULL ,
  `purchased_at`  DATE NOT NULL DEFAULT(CURRENT_DATE),
  `weight`   	    INT NULL ,
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `updated_at`    DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `created_by`	 int null,
  `updated_by`	 int null,
  PRIMARY KEY (`id`)
);

CREATE TABLE  IF NOT EXISTS `babies`
(
  `id`            INT NOT NULL auto_increment ,
  `raw_material_parent_id` INT NOT NULL,
  `purchased_at`  DATE NOT NULL DEFAULT(CURRENT_DATE),
  `length`   	    INT NULL ,
  `quantity`   	    INT NULL ,
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `updated_at`    DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `created_by`	 int null,
  `updated_by`	 int null,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`raw_material_parent_id`) REFERENCES raw_materials(`id`)
);

insert into raw_materials (`name`, `purchased_at`,  `weight`, `created_by`, `updated_by`)
values
('Gold', '2024-06-08', 30, 1, 1),
('Silver', '2024-06-08', 25, 1, 1),
('Metal', '2024-06-08', 1, 1, 1),
('Wood', '2024-06-08', 13, 1, 1),
('Concrete', '2024-06-08', 50, 1, 1),
('Diamond', '2024-06-08', 14, 1, 1),
('Plastic', '2024-06-08', 99, 1, 1),
('Bad plastic', '2024-06-08', 13, 1, 1),
('Metal', '2024-06-08', 1, 1, 1),
('Copper', '2024-06-08', 12, 1, 1)