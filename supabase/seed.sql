-- ============================================================
-- Optional seed data. Run AFTER schema.sql, once, in the SQL Editor.
-- Populates skills / experience / education exactly as originally
-- specified, and adds the six projects as DRAFTS (not visible on
-- the public site) with their known info filled in and narrative
-- fields (problem, objective, results, etc.) left as placeholders
-- for you to complete and images left empty — add those from
-- /admin/projects, then set each to "Published" when ready.
-- ============================================================

insert into projects (title, slug, short_description, description, category, status, technologies, hardware, software, problem, objective, role, how_it_works, workflow, testing, results, github_url)
values
('Smart Fish Pond Monitoring & Feeding System', 'smart-fish-pond-monitoring-feeding-system',
 'ESP32-based IoT system for monitoring fish pond conditions and automating feeding, water management, and aeration.',
 'ESP32-based IoT system for monitoring fish pond conditions and automating feeding, water management, and aeration.',
 'IoT', 'draft',
 array['ESP32','DS18B20','pH Sensor','Turbidity Sensor','Water-Level Sensors','Firebase','Servo','Pumps','Aerator'],
 'ESP32, DS18B20 temperature sensor, pH sensor, turbidity sensor, water-level sensors, servo motor, water pumps, aerator',
 'Arduino IDE, Firebase (cloud data & control)',
 '[Add problem statement — what issue this project solves]',
 '[Add project objective]',
 '[Add your role and contributions]',
 '[Add explanation of how the system works]',
 '[Add development process notes]',
 '[Add testing details and observations]',
 '[Add measured result here]',
 ''),

('Smart Tomato Storage System', 'smart-tomato-storage-system',
 'ESP32-based smart storage system designed to monitor temperature and humidity while controlling cooling conditions for improved tomato storage.',
 'ESP32-based smart storage system designed to monitor temperature and humidity while controlling cooling conditions for improved tomato storage.',
 'Electronics', 'draft',
 array['ESP32','DHT22','Peltier Cooling','Relay','LCD','Firebase','PCB Design'],
 'ESP32, DHT22 temperature & humidity sensor, Peltier cooling module, relay module, LCD display, custom PCB',
 'Arduino IDE, Firebase (cloud data logging)',
 '[Add problem statement — what issue this project solves]',
 '[Add project objective]',
 '[Add your role and contributions]',
 '[Add explanation of how the system works]',
 '[Add development process notes]',
 '[Add testing details and observations]',
 '[Add measured result here]',
 ''),

('Smart Waste Management System', 'smart-waste-management-system',
 'Microcontroller-based smart waste system integrating RFID access, ultrasonic level monitoring, load-cell weighing, LCD display, and automated bin control.',
 'Microcontroller-based smart waste system integrating RFID access, ultrasonic level monitoring, load-cell weighing, LCD display, and automated bin control.',
 'Automation', 'draft',
 array['Arduino','RFID','Ultrasonic Sensor','Load Cell','LCD','Servo','PCB Design'],
 'Arduino, RFID reader/tags, ultrasonic sensor, load cell, LCD display, servo motor, custom PCB',
 'Arduino IDE',
 '[Add problem statement — what issue this project solves]',
 '[Add project objective]',
 '[Add your role and contributions]',
 '[Add explanation of how the system works]',
 '[Add development process notes]',
 '[Add testing details and observations]',
 '[Add measured result here]',
 ''),

('Smart Dustbin', 'smart-dustbin',
 'ESP32-based automatic dustbin with contactless lid control and IoT monitoring using ultrasonic and IR sensing.',
 'ESP32-based automatic dustbin with contactless lid control and IoT monitoring using ultrasonic and IR sensing.',
 'IoT', 'draft',
 array['ESP32','Ultrasonic Sensor','IR Sensor','Servo Motor','Blynk'],
 'ESP32, ultrasonic sensor, IR sensor, servo motor',
 'Arduino IDE, Blynk (IoT dashboard)',
 '[Add problem statement — what issue this project solves]',
 '[Add project objective]',
 '[Add your role and contributions]',
 '[Add explanation of how the system works]',
 '[Add development process notes]',
 '[Add testing details and observations]',
 '[Add measured result here]',
 ''),

('Intruder Alarm System', 'intruder-alarm-system',
 'Embedded security system combining motion detection, distance sensing, wireless communication, and alarm notification.',
 'Embedded security system combining motion detection, distance sensing, wireless communication, and alarm notification.',
 'Embedded Systems', 'draft',
 array['ATmega328P','PIR Sensor','Ultrasonic Sensor','433 MHz RF','GSM','Buzzer','Custom PCB'],
 'ATmega328P, PIR motion sensor, ultrasonic sensor, 433 MHz RF module, GSM module, buzzer, custom PCB',
 'Arduino IDE / AVR toolchain',
 '[Add problem statement — what issue this project solves]',
 '[Add project objective]',
 '[Add your role and contributions]',
 '[Add explanation of how the system works]',
 '[Add development process notes]',
 '[Add testing details and observations]',
 '[Add measured result here]',
 ''),

('Smart Irrigation System', 'smart-irrigation-system',
 'Automated irrigation system designed to monitor environmental conditions and control water delivery based on sensor readings.',
 'Automated irrigation system designed to monitor environmental conditions and control water delivery based on sensor readings.',
 'Automation', 'draft',
 array['Microcontroller','Sensors','Relay','Pump','Automation'],
 'Microcontroller, soil/environmental sensors, relay module, water pump',
 '[Add software/tools used]',
 '[Add problem statement — what issue this project solves]',
 '[Add project objective]',
 '[Add your role and contributions]',
 '[Add explanation of how the system works]',
 '[Add development process notes]',
 '[Add testing details and observations]',
 '[Add measured result here]',
 '')
on conflict (slug) do nothing;

insert into skills (category, name, order_index) values
('Embedded Systems','ESP32',0),('Embedded Systems','Arduino',1),('Embedded Systems','ATmega328P',2),
('Embedded Systems','Microcontroller Systems',3),('Embedded Systems','GPIO',4),('Embedded Systems','PWM',5),
('Embedded Systems','Sensor Integration',6),('Embedded Systems','Actuator Control',7),
('Programming & Firmware','Arduino C/C++',0),('Programming & Firmware','Embedded Firmware',1),
('Programming & Firmware','Arduino IDE',2),('Programming & Firmware','VS Code',3),
('IoT & Connectivity','Firebase',0),('IoT & Connectivity','Blynk',1),('IoT & Connectivity','Wireless Communication',2),
('IoT & Connectivity','Cloud Data Monitoring',3),('IoT & Connectivity','IoT System Integration',4),
('Electronics','Circuit Design',0),('Electronics','Analog Electronics',1),('Electronics','Digital Electronics',2),
('Electronics','Power Electronics',3),('Electronics','Relay Control',4),('Electronics','Motor Control',5),
('Electronics','Electronics Troubleshooting',6),
('PCB Design','Proteus',0),('PCB Design','KiCad',1),('PCB Design','Through-Hole PCB Design',2),
('PCB Design','PCB Fabrication',3),('PCB Design','Schematic Design',4),('PCB Design','PCB Testing',5),
('Test & Workshop Tools','Digital Multimeter',0),('Test & Workshop Tools','Oscilloscope',1),
('Test & Workshop Tools','Soldering Station',2),('Test & Workshop Tools','Rework Station',3)
on conflict do nothing;

insert into experience (role, organization, period, description, order_index) values
('Electronics Engineer', 'MusTech Electronics Lab — Ilorin', '2021–2023 · 2025',
 E'Designed, assembled, tested, and troubleshot electronic circuits and embedded systems for practical applications.\n\nDeveloped microcontroller-based systems using Arduino, ATmega328P, and ESP32, integrating sensors, actuators, displays, relays, motors, and communication modules.\n\nDesigned and fabricated through-hole PCBs, including circuit schematics, PCB layouts, component selection, assembly, and testing.\n\nWorked on electronics repair, power electronics, inverter systems, and electronic fault diagnosis.', 0),
('Electrical Engineer — SIWES', 'Sam Pharmaceuticals Ltd', '2020',
 'Supported preventive electrical maintenance, electrical panel and circuit inspection, lighting systems, motors and drives, grounding checks, troubleshooting, and repair activities.', 1),
('Solar/Electronics Technician — SIWES', 'Femtech Repair Centre, Ilorin', '2024',
 E'Diagnosed and repaired power electronics equipment, including inverters, UPS units, and voltage stabilizers.\n\nUtilized multimeters and test equipment to isolate circuit-level faults systematically.\n\nAssisted with solar system deployment, encompassing wiring, panel configuration, and system testing.', 2)
on conflict do nothing;

insert into education (degree, institution, period, order_index) values
('B.Eng. Electrical & Electronics Engineering', 'University of Ilorin, Kwara State', '2022 – 2026', 0),
('OND, Electrical & Electronics Engineering', 'Kwara State Polytechnic, Ilorin', '2019 – 2021', 1)
on conflict do nothing;

-- Real contact details and links, matching the CV.
update settings set
  email = 'muhammadmubaraqelectricity@gmail.com',
  linkedin_url = 'https://www.linkedin.com/in/mubaraq-olalekan-03307b310/',
  github_url = 'https://github.com/'
where id = 1;
