CREATE TABLE IF NOT EXISTS courses(
    course_id VARCHAR(20) PRIMARY KEY,
    course_title VARCHAR(255) NOT NULL,
    course_description TEXT,
    classroom_number VARCHAR(50),
    capacity INT,
    credit_hours INT,
    tuition_cost DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS students(
    student_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(25),
    address TEXT,
    enrolled_cohort_ids INT[],
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    birth_date DATE
);

CREATE TABLE IF NOT EXISTS staff(
    staff_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(25),
    address TEXT,
    access_level INT NOT NULL CHECK (access_level BETWEEN 0 AND 3),
    assigned_cohort_ids INT[],
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    birth_date DATE,
    position VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS users(
    user_id SERIAL PRIMARY KEY,
    staff_id INT REFERENCES staff(staff_id),
    student_id INT REFERENCES students(student_id),
    CONSTRAINT users_exactly_one_role CHECK (num_nonnulls(staff_id, student_id) = 1),
    CONSTRAINT users_unique_staff_id UNIQUE (staff_id),
    CONSTRAINT users_unique_student_id UNIQUE (student_id)
);

CREATE TABLE IF NOT EXISTS cohorts(
    cohort_id SERIAL PRIMARY KEY,
    course_id VARCHAR(20) NOT NULL REFERENCES courses(course_id),
    cohort_name VARCHAR(255) NOT NULL,
    starting_date DATE,
    ending_date DATE,
    student_ids INT[],
    teacher_ids INT[]
);

CREATE TABLE IF NOT EXISTS token_blacklist (
    token TEXT PRIMARY KEY,
    blacklisted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

INSERT INTO courses (course_id, course_title, course_description, classroom_number, capacity, credit_hours, tuition_cost) VALUES
('CSCI-1001', 'Introduction to Computer Science', 'This course will introduce students to the fundamental concepts behind computers and computer programming. Topics covered include basic programming logic, algorithm development, computer architecture, and software engineering.', 'LAB-123', 30, 3, 900.00),
('CSCI-2001', 'Data Structures', 'This course will cover the basics of data structures, algorithms, and data manipulation. Topics covered include linked lists, stacks, queues, trees, and hash tables. Students will also learn algorithms for sorting and searching data.', 'LAB-456', 30, 3, 900.00),
('CSCI-2003', 'Computer Architecture', 'This course will provide an overview of the components and design of modern computer systems. Topics covered include assembly language, memory, CPU, and input/output devices. Students will learn how to design and implement basic computer architectures.', 'LAB-789', 20, 3, 900.00),
('CSCI-2005', 'Advanced Algorithms', 'This course will cover advanced algorithms and techniques for problem solving. Topics covered include graph theory, dynamic programming, and machine learning. Students will also learn how to analyze algorithms for efficiency and accuracy.', 'LAB-1011', 30, 3, 900.00),
('CSCI-2007', 'Networking & Security', 'This course introduces basic networking concepts and the underlying principles of network security. Topics include network topologies, protocols, and methods of network security including encryption and authentication. Additionally, the course covers network intrusion detection and prevention, network management and diagnostics, and network security policies.', 'LAB-1213', 30, 3, 900.00),
('CSCI-2009', 'Object-Oriented Programming', 'This course provides an introduction to the fundamentals of object-oriented programming. The course covers the basics of object-oriented programming, including classes and objects, inheritance, polymorphism, exception handling, and data structures. The course also covers the fundamentals of graphical user interface (GUI) programming using a popular object-oriented programming language, such as Java or C++.', 'LAB-1415', 25, 3, 900.00),
('CSCI-2011', 'Database Design & Management', 'This course provides an introduction to relational database design and management. Topics covered include database architecture, query languages, data modeling, normalization, database security, and database administration. The course also covers various tools and techniques for designing and managing databases, such as SQL, Oracle, and Access.', 'LAB-1617', 30, 3, 900.00),
('CSCI-2013', 'Software Engineering', 'This course provides an introduction to the fundamentals of software engineering. Topics covered include software development processes, requirements engineering, software design, testing, and maintenance. The course also covers various tools and techniques for software engineering, such as software project management, version control, refactoring, and software metrics. Students will have the opportunity to apply software engineering principles in the development of a software project.', 'LAB-1819', 30, 4, 1200.00),
('CSCI-2015', 'Operating Systems', 'This course will provide an overview of operating systems and their components. Topics covered will include processes, threads, memory management, file systems, and virtual memory. The course will also cover advanced topics such as distributed systems, real-time systems, and security.', 'LAB-2021', 15, 4, 1200.00),
('CSCI-5001', 'Computer Graphics', 'This course will cover the fundamentals of computer graphics, including 2D and 3D graphics algorithms and techniques. Topics discussed may include interactive 3D graphics, 3D rendering, texture mapping, lighting, and shading.', 'LAB-2223', 13, 3, 900.00),
('CSCI-2101', 'Software Testing & Verification', 'This course will provide an overview of software testing and verification techniques. Topics discussed may include software design and architecture, test planning, testing strategies, debugging, and documentation. The course will also cover topics such as reliability, safety, security, usability, and maintainability.', 'LAB-2425', 15, 3, 900.00),
('CSCI-2201', 'Compiler Design', 'Compiler Design is a course that introduces students to the fundamental concepts and principles of building a compiler. Topics covered include language parsing, lexical analysis, code generation, optimization, and error handling. This course also covers the development of a compiler from a high-level language to a low-level language, and techniques for optimization and code generation.', 'LAB-2627', 13, 4, 1200.00),
('CSCI-2301', 'Artificial Intelligence', 'Artificial Intelligence is a course that introduces students to the field of artificial intelligence. Topics covered include search algorithms, knowledge representation, reasoning, decision-making, and machine learning. This course also covers the development of intelligent agents and their use in problem solving.', 'LAB-2829', 30, 4, 1200.00),
('CSCI-2401', 'Computer Vision', 'Computer Vision is a course that introduces students to the field of computer vision. Topics covered include image processing, object recognition, and 3D reconstruction. This course also covers the development of computer vision systems, their application in robotics, and their use in autonomous navigation.', 'LAB-3031', 30, 3, 900.00),
('CSCI-2501', 'Systems Programming', 'This course covers the fundamentals of computer systems programming, with an emphasis on writing efficient, robust, and maintainable code. Topics include memory management, data structures, algorithms, system calls, I/O, data compression, language bindings, and debugging. Students will gain a deep understanding of the inner workings of computer systems and develop the skills to write powerful, reliable code.', 'LAB-3233', 25, 4, 1200.00),
('CSCI-2601', 'Machine Learning', 'This course provides an introduction to machine learning, covering a variety of topics including supervised learning, unsupervised learning, reinforcement learning, and deep learning. Students will learn how to apply machine learning algorithms to real-world problems and develop the skills to evaluate the effectiveness of various models.', 'LAB-3435', 30, 4, 1200.00),
('CSCI-2701', 'Parallel Computing ', 'This course covers the fundamentals of parallel computing, with an emphasis on multi-core architectures. Topics include threading, communication, synchronization, data structures, and optimization. Students will gain a deep understanding of how to utilize multiple cores to speed up computations and develop the skills to write efficient, scalable code.', 'LAB-3905', 30, 4, 1200.00),
('ISYS-1002', 'Introduction to Information Systems', 'This course introduces students to the basics of Information Systems, including their components and the processes used to manage them. Students will learn about computer hardware and software, different types of networks, and the use of data for decision making. Topics include system planning, system development, data modeling, and user interface design.', 'LAB-3031', 30, 3, 900.00),
('ISYS-1003', 'Computer Networking', 'This course explores the fundamentals of computer networking, including both wired and wireless systems. Topics include network design, architecture, protocols, and topologies. Students will learn about LANs, WANs, and the Internet, as well as security considerations when networking.', 'LAB-3233', 15, 3, 900.00),
('ISYS-2000', 'Database Design and Management', 'This course covers the concepts and principles of database design and management. Students will learn how to create and manage databases using Structured Query Language (SQL). Topics include entity-relationship modeling, normalization, data integrity, and database security.', 'LAB-3435', 13, 3, 900.00),
('CSCI-2300', 'Web Design and Development', 'This course provides a comprehensive overview of the concepts, principles, and techniques used to create effective web designs. The course covers topics such as web page layout and design, navigation, user interface design, multimedia, scripting, and web standards. Students will learn how to create visually appealing webpages that are optimized for the web. The course will also discuss the importance of accessibility and usability in web design.', 'LAB-3905', 15, 3, 900.00),
('CSCI-2400', 'Systems Analysis and Design', 'This course provides an introduction to systems analysis and design (SA&D) techniques and tools. It covers topics such as requirements gathering, system design, prototyping, testing, implementation, and maintenance. Students will learn the fundamentals of SA&D such as project planning, data modeling, process modeling, and system architecture. They will also gain practical experience in the use of software development tools and techniques. Additionally, the course will discuss best practices related to the development of robust, maintainable, and secure systems.', 'LAB-3031', 30, 3, 900.00)
ON CONFLICT (course_id) DO NOTHING;

INSERT INTO students (student_id, username, email, password, phone_number, address, enrolled_cohort_ids, first_name, middle_name, last_name, birth_date) VALUES
(1, 'alice.johnson', 'alice.johnson@school.edu', 'Passw0rd!', '555-0101', '101 Main St, Springfield, ST 12345', ARRAY[1,2], 'Alice', NULL, 'Johnson', '2002-03-12'),
(2, 'ben.carter', 'ben.carter@school.edu', 'Passw0rd!', '555-0102', '202 Oak Ave, Springfield, ST 12345', ARRAY[1], 'Ben', 'M', 'Carter', '2001-07-21'),
(3, 'chloe.nguyen', 'chloe.nguyen@school.edu', 'Passw0rd!', '555-0103', '303 Pine Rd, Springfield, ST 12345', ARRAY[2], 'Chloe', NULL, 'Nguyen', '2003-11-05'),
(4, 'david.lee', 'david.lee@school.edu', 'Passw0rd!', '555-0104', '404 Cedar Ln, Springfield, ST 12345', ARRAY[3], 'David', NULL, 'Lee', '2000-01-19'),
(5, 'emma.smith', 'emma.smith@school.edu', 'Passw0rd!', '555-0105', '505 Birch Blvd, Springfield, ST 12345', ARRAY[3], 'Emma', 'R', 'Smith', '2002-09-28')
ON CONFLICT (student_id) DO NOTHING;

INSERT INTO staff (staff_id, username, email, password, phone_number, address, access_level, assigned_cohort_ids, first_name, middle_name, last_name, birth_date, position) VALUES
(1, 'maya.rivera', 'maya.rivera@school.edu', 'AdminPass1!', '555-0201', '10 Faculty Way, Springfield, ST 12345', 3, ARRAY[1,2,3], 'Maya', NULL, 'Rivera', '1988-04-10', 'Program Director'),
(2, 'oliver.brown', 'oliver.brown@school.edu', 'TeachPass1!', '555-0202', '20 Faculty Way, Springfield, ST 12345', 2, ARRAY[1,2], 'Oliver', NULL, 'Brown', '1990-08-14', 'Instructor'),
(3, 'sophia.davis', 'sophia.davis@school.edu', 'Support1!', '555-0203', '30 Faculty Way, Springfield, ST 12345', 1, ARRAY[3], 'Sophia', 'L', 'Davis', '1992-12-02', 'Student Support')
ON CONFLICT (staff_id) DO NOTHING;

INSERT INTO users (student_id)
SELECT s.student_id
FROM students s
WHERE NOT EXISTS (
    SELECT 1 FROM users u WHERE u.student_id = s.student_id
);

INSERT INTO users (staff_id)
SELECT st.staff_id
FROM staff st
WHERE NOT EXISTS (
    SELECT 1 FROM users u WHERE u.staff_id = st.staff_id
);

UPDATE students s
SET user_id = u.user_id
FROM users u
WHERE u.student_id = s.student_id;

UPDATE staff st
SET user_id = u.user_id
FROM users u
WHERE u.staff_id = st.staff_id;

ALTER TABLE students
ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE staff
ALTER COLUMN user_id SET NOT NULL;

INSERT INTO cohorts (cohort_id, course_id, cohort_name, starting_date, ending_date, student_ids, teacher_ids) VALUES
(1, 'CSCI-1001', 'CSCI-1001 Fall 2026', '2026-09-01', '2026-12-15', ARRAY[1,2], ARRAY[2]),
(2, 'CSCI-2001', 'CSCI-2001 Fall 2026', '2026-09-01', '2026-12-15', ARRAY[1,3], ARRAY[2]),
(3, 'ISYS-1002', 'ISYS-1002 Fall 2026', '2026-09-01', '2026-12-15', ARRAY[4,5], ARRAY[3])
ON CONFLICT (cohort_id) DO NOTHING;