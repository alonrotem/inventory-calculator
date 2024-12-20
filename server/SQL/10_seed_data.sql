use inventory; 

delete from babies;
delete from customer_banks;
delete from customers;
delete from raw_materials;
delete from transaction_history;
delete from wings;
delete from hats;

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
('Sable', '2024-06-08', 210, 152, 'units', 30, 'JJ','US', 30, 'USD', 'This is a test material', NOW(), NOW(), 1, 1),
('DM','2024-06-09',25, 5, 'kg', NULL,'MM','US',40,'EUR','This is a test material',NOW(), NOW(), 1, 1),
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
(@alon_id, @sable_id, 10, 2),
(@alon_id, @dm_id, 20, 15),
(@avi_id, @sable_id, 30, 30),
(@guy_id, @sable_id, 2, 2),
(@eran_id, @sable_id, 16, 6);


set @bank_eran_sable = (select id from customer_banks where customer_id=@eran_id and raw_material_id=@sable_id limit 1);
set @bank_eran_dm = (select id from customer_banks where customer_id=@eran_id and raw_material_id=@dm_id limit 1);
set @bank_guy_sable = (select id from customer_banks where customer_id=@guy_id and raw_material_id=@sable_id limit 1);
set @bank_avi_sable = (select id from customer_banks where customer_id=@avi_id and raw_material_id=@sable_id limit 1);
set @bank_alon_sable = (select id from customer_banks where customer_id=@alon_id and raw_material_id=@sable_id limit 1);
set @bank_alon_dm = (select id from customer_banks where customer_id=@alon_id and raw_material_id=@dm_id limit 1);

-- baby allocations in customer banks
INSERT INTO `customer_banks_babies` (
	`customer_bank_id`, `quantity`, `remaining_quantity`
) 
VALUES 
	(@bank_alon_sable, 5, 5),
    (@bank_alon_sable, 3, 2),
    (@bank_alon_dm, 5, 5),
    (@bank_eran_sable, 10, 10);
    
set @alon_sable_bank_allocation_1 = (select id from customer_banks_babies where customer_bank_id=@bank_alon_sable limit 1 offset 0);
set @alon_sable_bank_allocation_2 = (select id from customer_banks_babies where customer_bank_id=@bank_alon_sable limit 1 offset 1);
set @alon_dm_bank_allocation_1 = (select id from customer_banks_babies where customer_bank_id=@bank_alon_dm limit 1 offset 0);
set @bank_eran_sable_allocation_1 = (select id from customer_banks_babies where customer_bank_id=@bank_eran_sable limit 1 offset 0);

-- Create history records for materials
INSERT INTO `transaction_history` (
	`date`, `added_by`, `transaction_quantity`,  `transaction_type`, 
    `raw_material_id`, `customer_id`, `customer_bank_id`, 
    `customer_banks_babies_id`, `cur_raw_material_quantity`, 
    `cur_customer_bank_quantity`, `cur_banks_babies_allocation_quantity`)
VALUES
-- Sable: 200
('2024-09-11', 1, 200, 'raw_material_purchase', @sable_id, 0, 0, 0, 200, 0, 0),
('2024-09-12 01:01', 1, 10, 'to_customer_bank', @sable_id, @alon_id, @bank_alon_sable, 0, 190, 10, 0),
('2024-09-13 01:02', 1, 15, 'to_customer_bank', @sable_id, @avi_id, @bank_avi_sable, 0, 175, 15, 0),
('2024-09-14 01:03', 1, 2, 'to_customer_bank', @sable_id, @guy_id, @bank_guy_sable, 0, 173, 2, 0),
('2024-09-15 01:04', 1, 16, 'to_customer_bank', @sable_id, @eran_id, @bank_eran_sable, 0, 157, 16, 0),
('2024-09-16 01:05', 1, 10, 'raw_material_purchase', @sable_id, 0, 0, 0, 167, 0, 0),
('2024-09-17 01:06', 1, 15, 'to_customer_bank', @sable_id, @avi_id, @bank_avi_sable, 0, 152, 30, 0),
-- DM: 25
('2024-09-18', 1, 25, 'raw_material_purchase', @dm_id, 0, 0, 0, 25, 0, 0),
('2024-09-19 01:00', 1, 20, 'to_customer_bank', @dm_id, @alon_id, @bank_alon_dm, 0, 5, 20, 0),
-- Other purchases
('2024-09-20', 1, 1000, 'raw_material_purchase', @sm_id, 0, 0, 0, 1000, 0, 0),
('2024-09-21', 1, 750, 'raw_material_purchase', @bm_id, 0, 0, 0, 750, 0, 0),
('2024-09-22', 1, 7, 'raw_material_purchase', @canady_id, 0, 0, 0, 7, 0, 0),
-- bank work allocations
('2024-09-23', 1, 5, 'customer_bank_allocate_to_Work', @sable_id, @alon_id, @bank_alon_sable, @alon_sable_bank_allocation_1, -1, 5, 0),
('2024-09-24', 1, 3, 'customer_bank_allocate_to_Work', @sable_id, @alon_id, @bank_alon_sable, @alon_sable_bank_allocation_2, -1, 2, 0),
('2024-09-25', 1, 5, 'customer_bank_allocate_to_Work', @sable_id, @alon_id, @bank_alon_dm, @alon_dm_bank_allocation_1, -1, 15, 0);

-- seed babies
INSERT INTO babies (customer_banks_babies_id, length, quantity)
VALUES 
(@alon_sable_bank_allocation_1, 10.5, 10),
(@alon_sable_bank_allocation_1, 9, 19),
(@alon_sable_bank_allocation_1, 6, 31),
(@alon_sable_bank_allocation_1, 7.5, 20),
(@alon_sable_bank_allocation_1, 11, 34),
(@alon_sable_bank_allocation_2, 6.5, 11),
(@alon_sable_bank_allocation_2, 5, 13),
(@alon_dm_bank_allocation_1, 10.5, 10),
(@bank_eran_sable_allocation_1, 9, 19),
(@bank_eran_sable_allocation_1, 6, 31),
(@bank_eran_sable_allocation_1, 5, 10),
(@bank_eran_sable_allocation_1, 6, 10),
(@bank_eran_sable_allocation_1, 7, 10);


