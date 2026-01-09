-- Academic_Department Table
CREATE TABLE Academic_Department (
  Name VARCHAR(50) PRIMARY KEY,
  Location VARCHAR(100)
);

INSERT INTO Academic_Department VALUES
('Physics', 'Bldg A'),
('Chemistry', 'Bldg B'),
('Mathematics', 'Bldg C'),
('Biology', 'Bldg D'),
('Computer Science', 'Bldg E'),
('Mechanical Eng', 'Bldg F'),
('Electrical Eng', 'Bldg G'),
('Civil Eng', 'Bldg H'),
('Economics', 'Bldg I'),
('Psychology', 'Bldg J'),
('History', 'Bldg K'),
('Philosophy', 'Bldg L');

-- Course Table
CREATE TABLE Course (
  Title VARCHAR(50),
  Year INT,
  Duration INT,
  Syllabus TEXT,
  Department_Name VARCHAR(50) NOT NULL,
  PRIMARY KEY (Title, Year),
  FOREIGN KEY (Department_Name) REFERENCES Academic_Department(Name)
);

INSERT INTO Course VALUES
('Quantum Mechanics', 2022, 1, 'Wave functions, uncertainty, operators', 'Physics'),
('Organic Chemistry', 2022, 1, 'Hydrocarbons, reactions, spectroscopy', 'Chemistry'),
('Calculus I', 2022, 1, 'Limits, derivatives, integrals', 'Mathematics'),
('Cell Biology', 2022, 1, 'Cell structure, function, genetics', 'Biology'),
('Data Structures', 2022, 1, 'Arrays, lists, trees, graphs', 'Computer Science'),
('Thermodynamics', 2022, 1, 'Heat, energy, entropy, cycles', 'Mechanical Eng'),
('Circuits', 2022, 1, 'Resistors, capacitors, inductors', 'Electrical Eng'),
('Structural Analysis', 2022, 1, 'Beams, frames, load analysis', 'Civil Eng'),
('Microeconomics', 2022, 1, 'Supply, demand, markets', 'Economics'),
('Social Psychology', 2022, 1, 'Group dynamics, attitudes, behavior', 'Psychology'),
('World History', 2022, 1, 'Civilizations, revolutions, cultures', 'History'),
('Logic', 2022, 1, 'Propositions, arguments, proofs', 'Philosophy');

-- Subject_Area Table
CREATE TABLE Subject_Area (
  Name VARCHAR(50) PRIMARY KEY
);

INSERT INTO Subject_Area VALUES
('Quantum Physics'),
('Organic Chemistry'),
('Differential Calculus'),
('Cellular Biology'),
('Algorithms'),
('Heat Engines'),
('Electronic Systems'),
('Structural Engineering'),
('Market Theory'),
('Behavioral Science'),
('Ancient Civilizations'),
('Formal Logic');

-- Classified_Under Table
CREATE TABLE Classified_Under (
  Title VARCHAR(50),
  Year INT,
  Name VARCHAR(50),
  PRIMARY KEY (Title, Year, Name),
  FOREIGN KEY (Title, Year) REFERENCES Course(Title, Year),
  FOREIGN KEY (Name) REFERENCES Subject_Area(Name)
);

INSERT INTO Classified_Under VALUES
('Quantum Mechanics', 2022, 'Quantum Physics'),
('Organic Chemistry', 2022, 'Organic Chemistry'),
('Calculus I', 2022, 'Differential Calculus'),
('Cell Biology', 2022, 'Cellular Biology'),
('Data Structures', 2022, 'Algorithms'),
('Thermodynamics', 2022, 'Heat Engines'),
('Circuits', 2022, 'Electronic Systems'),
('Structural Analysis', 2022, 'Structural Engineering'),
('Microeconomics', 2022, 'Market Theory'),
('Social Psychology', 2022, 'Behavioral Science'),
('World History', 2022, 'Ancient Civilizations'),
('Logic', 2022, 'Formal Logic');

-- Instructor Table
CREATE TABLE Instructor (
  DOB DATE,
  Name VARCHAR(50),
  PRIMARY KEY (DOB, Name)
);

INSERT INTO Instructor VALUES
('1975-03-15', 'Mohan Gupta'),
('1980-04-26', 'Priya Sharma'),
('1983-07-11', 'Rahul Bose'),
('1978-12-03', 'Anjali Sinha'),
('1985-09-19', 'Nitin Saxena'),
('1972-08-02', 'Seema Nair'),
('1986-06-17', 'Aashish Roy'),
('1974-10-28', 'Poonam Verma'),
('1979-11-12', 'Omprakash Mishra'),
('1982-05-06', 'Sneha Sen'),
('1977-02-01', 'Suresh Chavan'),
('1981-12-20', 'Kavita Rao');

-- Taught_By Table
CREATE TABLE Taught_By (
  Name VARCHAR(50),
  DOB DATE,
  Title VARCHAR(50),
  Year INT,
  PRIMARY KEY (Name, DOB, Title, Year),
  FOREIGN KEY (DOB, Name) REFERENCES Instructor(DOB, Name),
  FOREIGN KEY (Title, Year) REFERENCES Course(Title, Year)
);

INSERT INTO Taught_By VALUES
('Mohan Gupta', '1975-03-15', 'Quantum Mechanics', 2022),
('Priya Sharma', '1980-04-26', 'Organic Chemistry', 2022),
('Rahul Bose', '1983-07-11', 'Calculus I', 2022),
('Anjali Sinha', '1978-12-03', 'Cell Biology', 2022),
('Nitin Saxena', '1985-09-19', 'Data Structures', 2022),
('Seema Nair', '1972-08-02', 'Thermodynamics', 2022),
('Aashish Roy', '1986-06-17', 'Circuits', 2022),
('Poonam Verma', '1974-10-28', 'Structural Analysis', 2022),
('Omprakash Mishra', '1979-11-12', 'Microeconomics', 2022),
('Sneha Sen', '1982-05-06', 'Social Psychology', 2022),
('Suresh Chavan', '1977-02-01', 'World History', 2022),
('Kavita Rao', '1981-12-20', 'Logic', 2022);

-- Student Table
CREATE TABLE Student (
  Name VARCHAR(50),
  DOB DATE,
  PRIMARY KEY (Name, DOB)
);

INSERT INTO Student VALUES
('Ankit Jain', '2002-07-21'),
('Sneha Roy', '2001-09-30'),
('Harsh Gupta', '2002-01-12'),
('Riya Singh', '2001-11-05'),
('Arjun Mishra', '2002-04-19'),
('Kriti Sharma', '2001-08-22'),
('Naveen Kumar', '2002-05-31'),
('Tanya Paul', '2002-02-17'),
('Deepak Yadav', '2001-12-02'),
('Shikha Pathak', '2002-03-13'),
('Manav Joshi', '2001-06-11'),
('Isha Malhotra', '2002-09-10');


-- Enrolled_In Table
CREATE TABLE Enrolled_In (
  Name VARCHAR(50),
  DOB DATE,
  Title VARCHAR(50),
  Year INT,
  Grade CHAR(2),
  PRIMARY KEY (Name, DOB, Title, Year),
  FOREIGN KEY (Name, DOB) REFERENCES Student(Name, DOB),
  FOREIGN KEY (Title, Year) REFERENCES Course(Title, Year)
);

INSERT INTO Enrolled_In VALUES
('Ankit Jain', '2002-07-21', 'Quantum Mechanics', 2022, 'A'),
('Sneha Roy', '2001-09-30', 'Organic Chemistry', 2022, 'A'),
('Harsh Gupta', '2002-01-12', 'Calculus I', 2022, 'B'),
('Riya Singh', '2001-11-05', 'Cell Biology', 2022, 'A'),
('Arjun Mishra', '2002-04-19', 'Data Structures', 2022, 'A'),
('Kriti Sharma', '2001-08-22', 'Thermodynamics', 2022, 'B'),
('Naveen Kumar', '2002-05-31', 'Circuits', 2022, 'B'),
('Tanya Paul', '2002-02-17', 'Structural Analysis', 2022, 'A'),
('Deepak Yadav', '2001-12-02', 'Microeconomics', 2022, 'B'),
('Shikha Pathak', '2002-03-13', 'Social Psychology', 2022, 'A'),
('Manav Joshi', '2001-06-11', 'World History', 2022, 'B'),
('Isha Malhotra', '2002-09-10', 'Logic', 2022, 'A');

-- Final_Project_Student Table
CREATE TABLE Final_Project (
  PId VARCHAR(10) PRIMARY KEY,
  Name VARCHAR(50),
  SName VARCHAR(50) NOT NULL,
  DOB DATE NOT NULL,
  Title VARCHAR(50) NOT NULL,
  Year INT NOT NULL,
  FOREIGN KEY (SName,DOB,Title, Year) REFERENCES Enrolled_In(Name,DOB,Title, Year)
);

INSERT INTO Final_Project VALUES
('FP001', 'Quantum Simulation', 'Ankit Jain', '2002-07-21', 'Quantum Mechanics', 2022),
('FP002', 'Organic Synthesis Lab', 'Sneha Roy', '2001-09-30', 'Organic Chemistry', 2022),
('FP003', 'Calculus Modeling', 'Harsh Gupta', '2002-01-12', 'Calculus I', 2022),
('FP004', 'Cell Imaging', 'Riya Singh', '2001-11-05', 'Cell Biology', 2022),
('FP005', 'Algorithm Optimization', 'Arjun Mishra', '2002-04-19', 'Data Structures', 2022),
('FP006', 'Thermodynamics Experiment', 'Kriti Sharma', '2001-08-22', 'Thermodynamics', 2022),
('FP007', 'Circuit Design Project', 'Naveen Kumar', '2002-05-31', 'Circuits', 2022),
('FP008', 'Bridge Analysis', 'Tanya Paul', '2002-02-17', 'Structural Analysis', 2022),
('FP009', 'Market Research', 'Deepak Yadav', '2001-12-02', 'Microeconomics', 2022),
('FP010', 'Behavioral Study', 'Shikha Pathak', '2002-03-13', 'Social Psychology', 2022),
('FP011', 'Historical Survey', 'Manav Joshi', '2001-06-11', 'World History', 2022),
('FP012', 'Logic Puzzle Solver', 'Isha Malhotra', '2002-09-10', 'Logic', 2022);
