use inventory; 

delete from babies;
delete from customer_banks;
delete from customers;
delete from raw_materials;
delete from transaction_history;

-- seed customers
INSERT INTO customers (name, business_name, email, phone, tax_id, created_at, updated_at, created_by, updated_by)
VALUES 
('Alon Rotem', 'Romtech' ,'alon@mail.com', '+359 (88) 401-3532', 'Tax payer 1234', NOW(), NOW(), 1, 1),
('Avi Bar', 'Romtech' ,'avi_bar@mail.com', '+359 87 985 8868', 'Tax payer 5678', NOW(), NOW(), 1, 1),
('Guy Tal', 'Guytech' ,'guy@mail.com', '+359 87 123 4567', 'Tax payer 90123', NOW(), NOW(), 1, 1),
('Eran Inger', 'Erantech' ,'eran@mail.com', '+359 88 890 1234', 'Not paying taxes', NOW(), NOW(), 1, 1);

set @alon_id = (select id from customers where name='Alon Rotem' limit 1);
set @avi_id = (select id from customers where name='Avi Bar' limit 1);
set @guy_id = (select id from customers where name='Guy Tal' limit 1);
set @eran_id = (select id from customers where name='Eran Inger' limit 1);

-- seed raw materials
INSERT INTO `raw_materials` (
  `name`, `purchased_at`, `purchase_quantity`, `remaining_quantity`, `quantity_units`, `units_per_kg`, `vendor_name`, `origin_country`, 
  `price`, `currency`, `notes`, `created_at`, `updated_at`, `created_by`, `updated_by`) 
VALUES 
('Sable', '2024-06-08', 200, 200, 'units', 30, 'JJ','US', 30, 'USD', 'This is a test material', NOW(), NOW(), 1, 1),
('DM','2024-06-09',25, 25, 'kg', NULL,'MM','US',40,'EUR','This is a test material',NOW(), NOW(), 1, 1),
('SM','2024-06-08',1000, 1000, 'units',112,'KK','RU',3,'USD','This is a test material',NOW(), NOW(), 1, 1),
('BM','2024-06-08',750,  750, 'units', 135,NULL,'US',60,'EUR','This is a test material',NOW(), NOW(), 1, 1),
('Canady', '2024-06-08', 7, 7, 'kg', 10, 'XY', 'US', 10, 'USD', 'This is a test material',NOW(), NOW(), 1, 1);

set @sable_id = (select id from raw_materials where name='Sable' limit 1);
set @dm_id = (select id from raw_materials where name='DM' limit 1);
set @sm_id = (select id from raw_materials where name='SM' limit 1);
set @bm_id = (select id from raw_materials where name='BM' limit 1);
set @canady_id = (select id from raw_materials where name='Canady' limit 1);

-- seed raw material customer banks
INSERT INTO customer_banks (customer_id, raw_material_id, quantity, remaining_quantity)
VALUES 
(@alon_id, @sable_id, 10, 10),
(@avi_id, @sable_id, 15, 15),
(@guy_id, @sable_id, 2, 2),
(@eran_id, @sable_id, 16, 16);
#(@eran_id, @dm_id, NULL, 25);

set @bank_eran_sable = (select id from customer_banks where customer_id=@eran_id and raw_material_id=@sable_id limit 1);
set @bank_eran_dm = (select id from customer_banks where customer_id=@eran_id and raw_material_id=@dm_id limit 1);

-- seed babies
INSERT INTO babies (customer_bank_id, length, quantity, created_at, updated_at, created_by, updated_by)
VALUES 
(@bank_eran_sable, 10.5, 10,NOW(), NOW(),1,1),
(@bank_eran_sable, 9, 19,NOW(), NOW(),1,1),
(@bank_eran_sable, 6, 31,NOW(), NOW(),1,1),
(@bank_eran_sable, 7.5, 20,NOW(), NOW(),1,1),
(@bank_eran_dm, 11, 34, NOW(), NOW(),1,1),
(@bank_eran_dm, 6.5, 11, NOW(), NOW(),1,1),
(@bank_eran_dm, 5, 13, NOW(), NOW(),1,1);

