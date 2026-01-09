

-- ===============================
-- 1. OFFICE TABLE
-- Enforces: same office → same phone extension
-- ===============================
CREATE TABLE Office (
  Office_Address VARCHAR(100) PRIMARY KEY,
  Phone_Extension VARCHAR(20) NOT NULL UNIQUE
);

-- ===============================
-- 2. RESEARCHER TABLE
-- ===============================
CREATE TABLE Researcher (
  Employee_Id INT PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Office_Address VARCHAR(100) NOT NULL,

  CONSTRAINT fk_researcher_office
    FOREIGN KEY (Office_Address)
    REFERENCES Office(Office_Address)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- ===============================
-- 3. LAB_EQUIPMENT TABLE
-- ===============================
CREATE TABLE Lab_Equipment (
  Name VARCHAR(50),
  Calibration_Standard VARCHAR(50),
  PRIMARY KEY (Name, Calibration_Standard)
);

-- ===============================
-- 4. USES TABLE (M:N)
-- ===============================
CREATE TABLE Uses (
  Employee_Id INT,
  Equipment_Name VARCHAR(50),
  Calibration_Standard VARCHAR(50),

  PRIMARY KEY (Employee_Id, Equipment_Name, Calibration_Standard),

  CONSTRAINT fk_uses_researcher
    FOREIGN KEY (Employee_Id)
    REFERENCES Researcher(Employee_Id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  CONSTRAINT fk_uses_equipment
    FOREIGN KEY (Equipment_Name, Calibration_Standard)
    REFERENCES Lab_Equipment(Name, Calibration_Standard)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- ===============================
-- 5. JOURNAL_ISSUE TABLE
-- Each issue has exactly one Editor-in-Chief
-- ===============================
CREATE TABLE Journal_Issue (
  Volume_Id INT,
  Title VARCHAR(100),
  Publication_Date DATE NOT NULL,
  Format VARCHAR(50) NOT NULL,
  Editor_In_Chief INT NOT NULL,

  PRIMARY KEY (Volume_Id, Title),

  CONSTRAINT fk_journal_editor
    FOREIGN KEY (Editor_In_Chief)
    REFERENCES Researcher(Employee_Id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- ===============================
-- 6. RESEARCH_PAPER TABLE
-- ===============================
CREATE TABLE Research_Paper (
  Paper_Id INT PRIMARY KEY,
  Title VARCHAR(100) NOT NULL,
  Lead_Author INT NOT NULL,
  Volume_Id INT NOT NULL,
  Journal_Title VARCHAR(100) NOT NULL,

  CONSTRAINT fk_paper_lead_author
    FOREIGN KEY (Lead_Author)
    REFERENCES Researcher(Employee_Id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  CONSTRAINT fk_paper_journal
    FOREIGN KEY (Volume_Id, Journal_Title)
    REFERENCES Journal_Issue(Volume_Id, Title)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- ===============================
-- 7. AUTHORS TABLE (M:N)
-- ===============================
CREATE TABLE Authors (
  Employee_Id INT,
  Paper_Id INT,

  PRIMARY KEY (Employee_Id, Paper_Id),

  CONSTRAINT fk_authors_researcher
    FOREIGN KEY (Employee_Id)
    REFERENCES Researcher(Employee_Id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  CONSTRAINT fk_authors_paper
    FOREIGN KEY (Paper_Id)
    REFERENCES Research_Paper(Paper_Id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);




/* =====================================================
   INSERT DATA (AFTER ALL TABLES ARE CREATED)
   ===================================================== */

-- ===============================
-- OFFICE DATA
-- ===============================
INSERT INTO Office VALUES
('A-101', '1010'),
('A-102', '1011'),
('B-201', '1012'),
('B-202', '1013'),
('C-301', '1014'),
('C-302', '1015'),
('D-401', '1016'),
('E-501', '1018'),
('E-502', '1019');

-- ===============================
-- RESEARCHER DATA
-- ===============================
INSERT INTO Researcher VALUES
(1, 'Amit Kumar', 'A-101'),
(2, 'Nidhi Sharma', 'A-102'),
(3, 'Ravi Patel', 'B-201'),
(4, 'Sunita Rao', 'B-202'),
(5, 'Prakash Singh', 'C-301'),
(6, 'Meena John', 'C-302'),
(7, 'Rahul Jain', 'D-401'),
(8, 'Priya Roy', 'D-401'),
(9, 'Ashok Mehra', 'E-501'),
(10, 'Divya Gupta', 'E-502');

-- ===============================
-- LAB EQUIPMENT DATA
-- ===============================
INSERT INTO Lab_Equipment VALUES
('Microscope', 'ISO-9001'),
('Centrifuge', 'ISO-13485'),
('Spectrometer', 'ISO-17025'),
('pH Meter', 'ISO-9001'),
('Oven', 'ISO-13485'),
('Freezer', 'ISO-17025'),
('Balance', 'ISO-9001'),
('Incubator', 'ISO-13485'),
('Hot Plate', 'ISO-17025'),
('Water Bath', 'ISO-9001');

-- ===============================
-- USES DATA
-- ===============================
INSERT INTO Uses VALUES
(1, 'Microscope', 'ISO-9001'),
(2, 'Centrifuge', 'ISO-13485'),
(3, 'Spectrometer', 'ISO-17025'),
(4, 'pH Meter', 'ISO-9001'),
(5, 'Oven', 'ISO-13485'),
(6, 'Freezer', 'ISO-17025'),
(7, 'Balance', 'ISO-9001'),
(8, 'Incubator', 'ISO-13485'),
(9, 'Hot Plate', 'ISO-17025'),
(10, 'Water Bath', 'ISO-9001');

-- ===============================
-- JOURNAL ISSUE DATA
-- ===============================
INSERT INTO Journal_Issue VALUES
(101, 'Science Monthly', '2025-01-01', 'Print', 1),
(102, 'Physics Update', '2025-01-15', 'Online', 2),
(103, 'Chem Research', '2025-02-01', 'Print', 3),
(104, 'Lab Innovations', '2025-02-15', 'Print', 4),
(105, 'Materials Review', '2025-03-01', 'Online', 5),
(106, 'Genetics Monthly', '2025-03-15', 'Print', 6),
(107, 'Medical Journal', '2025-04-01', 'Online', 7),
(108, 'Environmental Science', '2025-04-15', 'Print', 8),
(109, 'Nano Letters', '2025-05-01', 'Online', 9),
(110, 'Biology Today', '2025-05-15', 'Print', 10);

-- ===============================
-- RESEARCH PAPER DATA
-- ===============================
INSERT INTO Research_Paper VALUES
(201, 'Microbial Genetics', 1, 101, 'Science Monthly'),
(202, 'Quantum Effects', 2, 102, 'Physics Update'),
(203, 'Bioinformatics', 3, 103, 'Chem Research'),
(204, 'Chemical Sensors', 4, 104, 'Lab Innovations'),
(205, 'Nanomaterials', 5, 105, 'Materials Review'),
(206, 'Genome Mapping', 6, 106, 'Genetics Monthly'),
(207, 'Heart Disease', 7, 107, 'Medical Journal'),
(208, 'Plastic Pollution', 8, 108, 'Environmental Science'),
(209, 'Battery Tech', 9, 109, 'Nano Letters'),
(210, 'Nano Drug Delivery', 10, 110, 'Biology Today');

-- ===============================
-- AUTHORS DATA
-- ===============================
INSERT INTO Authors VALUES
(1, 201), (2, 201),
(2, 202), (3, 202),
(3, 203), (4, 203),
(4, 204), (5, 204),
(5, 205), (6, 205),
(6, 206), (7, 206),
(7, 207), (8, 207),
(8, 208), (9, 208),
(9, 209), (10, 209),
(10, 210), (1, 210);
