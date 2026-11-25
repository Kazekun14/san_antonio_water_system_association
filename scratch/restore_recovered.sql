-- Restore recovered data for sawsa (recovered from MySQL binary logs)
-- Users: admin (44) and staff (45) survived; user_1, user_2, customer1, customer2 were deleted pre-wipe.

INSERT INTO users (id, username, password, role, remember_token, created_at, updated_at) VALUES
(44, 'admin', '$2y$12$WPNg27uJdOpDggJF1YsM..8wO/HaNrDnke52Wc7wJBg3ssLtuV6/i', 'admin', 'TtrPZO3U4xYFw8N8oynNAD3sjGEyEuIKFtVPcfnCcF87aiuNm2iGpmEjfDcy', FROM_UNIXTIME(1781422117), FROM_UNIXTIME(1781422117)),
(45, 'staff', '$2y$12$99wam7l90KhxtUgZQYSX/..jfUehyBm356Zd8vg46vN9cepkyQ0/m', 'staff', '0GSaIRFzwLke5bWLLTM5FmN5gxsiMVBtL44JSBn5FYZeLsBwD3jyFnDr5yy4', FROM_UNIXTIME(1781422117), FROM_UNIXTIME(1781422117));

INSERT INTO water_rates (id, base_rate, rate_per_cubic_meter, penalty_amount, billing_cycle_day, barangay_name, barangay_address, contact_number, created_at, updated_at) VALUES
(1, 200.00, 15.00, 50.00, 1, 'Barangay San Antonio', 'San Antonio, Philippines', '09000000000', FROM_UNIXTIME(1778288434), FROM_UNIXTIME(1778288434));

INSERT INTO customers (id, first_name, last_name, phone_number, email, meter_number, household_address, purok, balance, initial_reading, access_type, user_id, connection_status, created_at, updated_at) VALUES
(37, 'Kurt Shiedrick', 'Tangcay', '09984416156', 'kurtshiedrickbomedianotangcay@gmail.com', 'MTR-1111', 'Atbang sa bilyaran', 'Spathiphyllum', 0.00, 0.00, 'physical_only', NULL, 'active', FROM_UNIXTIME(1785486855), FROM_UNIXTIME(1785486855));

-- The old meter_readings row was in the pre-refactor schema; convert it to the new columns.
INSERT INTO meter_readings (id, customer_id, meter_reader_id, recorded_by_user_id, meter_reading, reading_date, created_at, updated_at) VALUES
(49, 37, 44, 44, 0.00, '2026-07-31', FROM_UNIXTIME(1785486855), FROM_UNIXTIME(1785486855));
