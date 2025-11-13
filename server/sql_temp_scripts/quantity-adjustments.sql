
# Sum up the babies and tails in each allocation, to reflect the numbers in the allocations (make sure a buffer of 1000 remains)
UPDATE customer_banks_allocations cba
LEFT JOIN (
    SELECT allocation_id, SUM(quantity) AS sum_quantity
    FROM allocation_babies
    GROUP BY allocation_id
) ab ON cba.id = ab.allocation_id
SET 
    cba.quantity = CASE 
        WHEN cba.allocation_type = 'babies' 
             THEN COALESCE(ab.sum_quantity, 0) + 1000
        WHEN cba.allocation_type = 'tails'  
             THEN cba.tails_quantity + 1000
        ELSE cba.quantity
    END,
    cba.remaining_quantity = 1000;

# Sum up the quantities in allocations, into the customer banks (make sure a buffer of 1000 remains)
UPDATE customer_banks cb
JOIN (
    SELECT customer_bank_id, SUM(quantity) AS total_alloc_quantity
    FROM customer_banks_allocations
    GROUP BY customer_bank_id
) cba ON cb.id = cba.customer_bank_id
SET 
    cb.quantity = cba.total_alloc_quantity + 1000,
    cb.remaining_quantity = 1000;

# Sum up the quantities in customer banks, into the raw materials list (make sure a buffer of 1000 remains). 
# if the units are kg, the result is divided by 100, so that 100 units per kg are. the remaining is 10kg (again 1000 units).
UPDATE raw_materials rm
LEFT JOIN (
    SELECT raw_material_id, SUM(quantity) AS total_cb_quantity
    FROM customer_banks
    GROUP BY raw_material_id
) cb ON rm.id = cb.raw_material_id
SET 
    rm.purchase_quantity = CASE 
        WHEN rm.quantity_units = 'units' 
            THEN COALESCE(cb.total_cb_quantity, 0) + 1000
        WHEN rm.quantity_units = 'kg' 
            THEN (COALESCE(cb.total_cb_quantity, 0) + 1000) / 100
        ELSE rm.purchase_quantity
    END,
    rm.remaining_quantity = CASE 
        WHEN rm.quantity_units = 'units' THEN 1000
        WHEN rm.quantity_units = 'kg' THEN 10
        ELSE rm.remaining_quantity
    END,
    rm.units_per_kg = CASE
        WHEN rm.quantity_units = 'units' THEN NULL
        WHEN rm.quantity_units = 'kg' THEN 100
        ELSE rm.units_per_kg
    END;

# Update the banks' "quantity_in_kg" according to the material's "units per kg", if the material is in kg
# Now that all banks are measured in units
update customer_banks cb 
	left join raw_materials rm 
	on cb.raw_material_id=rm.id
	set cb.quantity_in_kg=cb.quantity/rm.units_per_kg
	where rm.quantity_units='kg';

# Update the transaction history records to reflect in kgs when the material is in kg
update 
	transaction_history th left join raw_materials rm on th.raw_material_id = rm.id
	set th.transaction_quantity = th.transaction_quantity / rm.units_per_kg
	where rm.quantity_units="kg" and th.transaction_type='to_customer_bank';