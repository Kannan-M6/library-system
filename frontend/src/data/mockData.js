/**
 * src/data/mockData.js
 * Central mock data store used by all pages.
 * Replace with real API calls once the backend is fully running.
 */

// ─── Categories ─────────────────────────────────────────────────────────────
export const BOOK_CATEGORIES = [
  'All',
  'AI & ML',
  'Data Science',
  'Web Development',
  'Computer Networks',
  'Operating Systems',
  'Database Systems',
  'Software Engineering',
  'Mathematics',
  'Physics',
  'Literature',
];

// ─── Books ───────────────────────────────────────────────────────────────────
export const MOCK_BOOKS = [
  { id:1,  title:'Deep Learning',                          author:'Ian Goodfellow',      isbn:'978-0262035613', category:'AI & ML',           totalCopies:4, availableCopies:0, shelf:'A-01', accentColor:'#c084fc', description:'The definitive textbook on deep learning by the pioneers of the field.', ebookUrl:'https://www.deeplearningbook.org/', ebookSource:'deeplearningbook.org', ebookFree:true },
  { id:2,  title:'Python Machine Learning',                author:'Sebastian Raschka',   isbn:'978-1787125933', category:'AI & ML',           totalCopies:3, availableCopies:1, shelf:'A-02', accentColor:'#818cf8', description:'Practical machine learning with Python, scikit-learn, and TensorFlow.', ebookUrl:'https://archive.org/details/python-machine-learning-3rd-edition', ebookSource:'Open Library', ebookFree:true },
  { id:3,  title:'Hands-On Machine Learning',              author:'Aurélien Géron',      isbn:'978-1492032649', category:'AI & ML',           totalCopies:5, availableCopies:3, shelf:'A-03', accentColor:'#c084fc', description:'Covers ML concepts using Scikit-Learn, Keras, and TensorFlow.', ebookUrl:'https://openlibrary.org/isbn/9781492032649', ebookSource:'Open Library', ebookFree:true },
  { id:4,  title:'The Hundred-Page Machine Learning Book', author:'Andriy Burkov',       isbn:'978-1999579500', category:'AI & ML',           totalCopies:2, availableCopies:0, shelf:'A-04', accentColor:'#a78bfa', description:'A concise yet comprehensive introduction to ML.', ebookUrl:'http://themlbook.com/', ebookSource:'themlbook.com', ebookFree:true },
  { id:5,  title:'Data Science from Scratch',              author:'Joel Grus',           isbn:'978-1492041139', category:'Data Science',       totalCopies:3, availableCopies:2, shelf:'B-01', accentColor:'#7dd3fc', description:'Fundamentals of Data Science using Python from first principles.', ebookUrl:'https://openlibrary.org/isbn/9781492041139', ebookSource:'Open Library', ebookFree:true },
  { id:6,  title:'Python for Data Analysis',               author:'Wes McKinney',        isbn:'978-1491957660', category:'Data Science',       totalCopies:4, availableCopies:1, shelf:'B-02', accentColor:'#38bdf8', description:'Data wrangling with Pandas, NumPy, and IPython.', ebookUrl:'https://wesmckinney.com/book/', ebookSource:'wesmckinney.com', ebookFree:true },
  { id:7,  title:'Learning Web Design',                    author:'Jennifer Robbins',    isbn:'978-1491960196', category:'Web Development',    totalCopies:3, availableCopies:3, shelf:'C-01', accentColor:'#86efac', description:'A beginner\'s guide to HTML, CSS, JavaScript, and web graphics.', ebookUrl:'https://openlibrary.org/isbn/9781491960196', ebookSource:'Open Library', ebookFree:true },
  { id:8,  title:'JavaScript: The Good Parts',             author:'Douglas Crockford',   isbn:'978-0596517748', category:'Web Development',    totalCopies:2, availableCopies:0, shelf:'C-02', accentColor:'#4ade80', description:'Highlights the best features of JavaScript.', ebookUrl:'https://archive.org/details/javascriptgoodpa00crock', ebookSource:'Internet Archive', ebookFree:true },
  { id:9,  title:'React - Up & Running',                   author:'Stoyan Stefanov',     isbn:'978-1492051459', category:'Web Development',    totalCopies:3, availableCopies:1, shelf:'C-03', accentColor:'#86efac', description:'Building web applications with ReactJS.', ebookUrl:'https://openlibrary.org/isbn/9781492051459', ebookSource:'Open Library', ebookFree:true },
  { id:10, title:'Computer Networks',                      author:'Andrew Tanenbaum',    isbn:'978-0133594140', category:'Computer Networks',  totalCopies:6, availableCopies:4, shelf:'D-01', accentColor:'#fbbf24', description:'A comprehensive textbook on computer networking fundamentals.', ebookUrl:'https://archive.org/details/computernetworks0000tane_k7k2', ebookSource:'Internet Archive', ebookFree:true },
  { id:11, title:'Operating System Concepts',              author:'Abraham Silberschatz', isbn:'978-1119800330', category:'Operating Systems', totalCopies:5, availableCopies:2, shelf:'E-01', accentColor:'#f9a8d4', description:'The classic "Dinosaur book" on operating systems.', ebookUrl:'https://openlibrary.org/isbn/9781119800330', ebookSource:'Open Library', ebookFree:true },
  { id:12, title:'Database System Concepts',               author:'Abraham Silberschatz', isbn:'978-0078022159', category:'Database Systems',  totalCopies:4, availableCopies:0, shelf:'F-01', accentColor:'#fb923c', description:'Comprehensive treatment of database systems design and implementation.', ebookUrl:'https://db-book.com/', ebookSource:'db-book.com', ebookFree:true },
  { id:13, title:'Clean Code',                             author:'Robert C. Martin',    isbn:'978-0132350884', category:'Software Engineering',totalCopies:5, availableCopies:4, shelf:'G-01', accentColor:'#34d399', description:'A handbook of agile software craftsmanship.', ebookUrl:'https://archive.org/details/clean-code-a-handbook-of-agile-software-craftsmanship', ebookSource:'Internet Archive', ebookFree:true },
  { id:14, title:'The Pragmatic Programmer',               author:'David Thomas',        isbn:'978-0135957059', category:'Software Engineering',totalCopies:3, availableCopies:3, shelf:'G-02', accentColor:'#6ee7b7', description:'From journeyman to master — timeless advice for developers.', ebookUrl:'https://openlibrary.org/isbn/9780135957059', ebookSource:'Open Library', ebookFree:true },
  { id:15, title:'Introduction to Algorithms',             author:'Thomas H. Cormen',    isbn:'978-0262033848', category:'Mathematics',         totalCopies:7, availableCopies:5, shelf:'H-01', accentColor:'#fde68a', description:'The definitive guide to algorithms, commonly called CLRS.', ebookUrl:'https://archive.org/details/introduction-to-algorithms-3rd-edition', ebookSource:'Internet Archive', ebookFree:true },
  { id:16, title:'Discrete Mathematics',                   author:'Kenneth Rosen',       isbn:'978-0073383095', category:'Mathematics',         totalCopies:4, availableCopies:0, shelf:'H-02', accentColor:'#fcd34d', description:'Discrete mathematics and its applications to CS.', ebookUrl:'https://openlibrary.org/isbn/9780073383095', ebookSource:'Open Library', ebookFree:true },
  { id:17, title:'University Physics',                     author:'Hugh D. Young',       isbn:'978-0134202709', category:'Physics',             totalCopies:5, availableCopies:5, shelf:'I-01', accentColor:'#a5b4fc', description:'Comprehensive physics for science and engineering.', ebookUrl:'https://openlibrary.org/isbn/9780134202709', ebookSource:'Open Library', ebookFree:true },
  { id:18, title:'To Kill a Mockingbird',                  author:'Harper Lee',          isbn:'978-0061935466', category:'Literature',          totalCopies:3, availableCopies:0, shelf:'J-01', accentColor:'#f472b6', description:'A classic novel about racial injustice in the American South.', ebookUrl:'https://archive.org/details/tokillamockingbi00harple', ebookSource:'Internet Archive', ebookFree:true },
];

// ─── Students ─────────────────────────────────────────────────────────────────
export const MOCK_STUDENTS = [
  { id:1, name:'Arjun Sharma',   rollNo:'CS2021001', department:'Computer Science', year:3, email:'arjun@college.edu',   phone:'9876543210' },
  { id:2, name:'Priya Nair',     rollNo:'CS2021002', department:'Computer Science', year:3, email:'priya@college.edu',   phone:'9876543211' },
  { id:3, name:'Rahul Verma',    rollNo:'IT2022010', department:'Information Tech',  year:2, email:'rahul@college.edu',   phone:'9876543212' },
  { id:4, name:'Sneha Reddy',    rollNo:'EC2020005', department:'Electronics',       year:4, email:'sneha@college.edu',   phone:'9876543213' },
  { id:5, name:'Mohammed Khan',  rollNo:'ME2023015', department:'Mechanical Engg',   year:1, email:'mkhan@college.edu',   phone:'9876543214' },
  { id:6, name:'Divya Menon',    rollNo:'CS2021008', department:'Computer Science', year:3, email:'divya@college.edu',   phone:'9876543215' },
  { id:7, name:'Karthik Iyer',   rollNo:'AI2022020', department:'AI & Data Science', year:2, email:'karthik@college.edu', phone:'9876543216' },
  { id:8, name:'Anjali Patel',   rollNo:'CS2023030', department:'Computer Science', year:1, email:'anjali@college.edu',  phone:'9876543217' },
];

// ─── Transactions ─────────────────────────────────────────────────────────────
// today = 2026-06-13
export const MOCK_TRANSACTIONS = [
  { id:'TXN001', bookId:1,  studentId:1, borrowDate:'2026-06-01', dueDate:'2026-06-15', returnDate:null,         returned:false, fine:0,  method:'scan',   notes:'' },
  { id:'TXN002', bookId:5,  studentId:2, borrowDate:'2026-05-20', dueDate:'2026-06-03', returnDate:null,         returned:false, fine:50, method:'manual', notes:'Scanner barcode torn' },
  { id:'TXN003', bookId:10, studentId:3, borrowDate:'2026-05-25', dueDate:'2026-06-08', returnDate:null,         returned:false, fine:25, method:'scan',   notes:'' },
  { id:'TXN004', bookId:2,  studentId:1, borrowDate:'2026-05-01', dueDate:'2026-05-15', returnDate:'2026-05-14', returned:true,  fine:0,  method:'scan',   notes:'' },
  { id:'TXN005', bookId:13, studentId:4, borrowDate:'2026-06-05', dueDate:'2026-06-19', returnDate:null,         returned:false, fine:0,  method:'scan',   notes:'' },
  { id:'TXN006', bookId:15, studentId:5, borrowDate:'2026-05-10', dueDate:'2026-05-24', returnDate:null,         returned:false, fine:100,method:'manual', notes:'Power failure at counter' },
  { id:'TXN007', bookId:7,  studentId:6, borrowDate:'2026-06-10', dueDate:'2026-06-24', returnDate:null,         returned:false, fine:0,  method:'scan',   notes:'' },
  { id:'TXN008', bookId:11, studentId:2, borrowDate:'2026-04-01', dueDate:'2026-04-15', returnDate:'2026-04-18', returned:true,  fine:15, method:'scan',   notes:'' },
  { id:'TXN009', bookId:3,  studentId:7, borrowDate:'2026-06-08', dueDate:'2026-06-22', returnDate:null,         returned:false, fine:0,  method:'scan',   notes:'' },
  { id:'TXN010', bookId:18, studentId:8, borrowDate:'2026-05-28', dueDate:'2026-06-11', returnDate:null,         returned:false, fine:10, method:'manual', notes:'Emergency lending — new book no barcode yet' },
  { id:'TXN011', bookId:6,  studentId:3, borrowDate:'2026-03-10', dueDate:'2026-03-24', returnDate:'2026-03-22', returned:true,  fine:0,  method:'scan',   notes:'' },
  { id:'TXN012', bookId:14, studentId:1, borrowDate:'2026-06-12', dueDate:'2026-06-26', returnDate:null,         returned:false, fine:0,  method:'scan',   notes:'' },
];

// ─── Helper functions ─────────────────────────────────────────────────────────
export function getBookById(id) {
  return MOCK_BOOKS.find(b => b.id === id) || null;
}

export function getStudentById(id) {
  return MOCK_STUDENTS.find(s => s.id === id) || null;
}

/**
 * Calculate fine for a transaction.
 * ₹5 per day after the due date.
 */
export function calcFine(dueDate) {
  if (!dueDate) return 0;
  const due = new Date(dueDate);
  const now = new Date();
  if (now <= due) return 0;
  const days = Math.floor((now - due) / 86_400_000);
  return days * 5;
}

// ─── Teachers / Staff ────────────────────────────────────────────────────────
export const MOCK_TEACHERS = [
  { id:101, name:'Dr. Kavitha R',       staffId:'STAFF001', department:'AI & Data Science',    designation:'Associate Professor', email:'kavitha@paavai.edu',  phone:'9876540001', specialization:'Machine Learning' },
  { id:102, name:'Prof. Suresh M',      staffId:'STAFF002', department:'Computer Science',     designation:'Assistant Professor', email:'suresh@paavai.edu',   phone:'9876540002', specialization:'Computer Networks' },
  { id:103, name:'Dr. Prabhakaran N',   staffId:'STAFF003', department:'Electronics',          designation:'Professor',           email:'prabha@paavai.edu',   phone:'9876540003', specialization:'VLSI Design' },
  { id:104, name:'Ms. Rashika A',       staffId:'STAFF004', department:'AI & Data Science',    designation:'Assistant Professor', email:'rashika@paavai.edu',  phone:'9876540004', specialization:'Deep Learning' },
  { id:105, name:'Mr. Afzal H',         staffId:'STAFF005', department:'Information Tech',     designation:'Lecturer',            email:'afzal@paavai.edu',    phone:'9876540005', specialization:'Web Technologies' },
];

// ─── Teacher Transactions (30-day loan period) ───────────────────────────────
export const MOCK_TEACHER_TRANSACTIONS = [
  { id:'TTXN001', bookId:3,  teacherId:101, borrowDate:'2026-05-15', dueDate:'2026-06-14', returnDate:null,         returned:false, loanDays:30, notes:'For AI course material' },
  { id:'TTXN002', bookId:10, teacherId:102, borrowDate:'2026-05-20', dueDate:'2026-06-19', returnDate:null,         returned:false, loanDays:30, notes:'Lab reference' },
  { id:'TTXN003', bookId:13, teacherId:105, borrowDate:'2026-04-01', dueDate:'2026-05-01', returnDate:'2026-04-28', returned:true,  loanDays:30, notes:'' },
  { id:'TTXN004', bookId:15, teacherId:101, borrowDate:'2026-06-01', dueDate:'2026-07-01', returnDate:null,         returned:false, loanDays:30, notes:'Algorithm course' },
  { id:'TTXN005', bookId:6,  teacherId:104, borrowDate:'2026-05-10', dueDate:'2026-06-09', returnDate:null,         returned:false, loanDays:30, notes:'Data Science seminar prep' },
];

// ─── Book Procurement Requests ────────────────────────────────────────────────
export const MOCK_BOOK_REQUESTS = [
  { id:'REQ001', teacherId:101, title:'Pattern Recognition and Machine Learning', author:'Christopher Bishop',  isbn:'978-0387310732', reason:'Core reference for ML course', urgency:'High',   status:'approved',  requestDate:'2026-06-01' },
  { id:'REQ002', teacherId:102, title:'TCP/IP Illustrated Vol. 1',                author:'W. Richard Stevens', isbn:'978-0201633467', reason:'Advanced Networks lab',        urgency:'Medium', status:'pending',   requestDate:'2026-06-10' },
  { id:'REQ003', teacherId:104, title:'Deep Learning with Python',                author:'François Chollet',   isbn:'978-1617294433', reason:'Keras practical sessions',      urgency:'High',   status:'pending',   requestDate:'2026-06-12' },
  { id:'REQ004', teacherId:105, title:'You Don\'t Know JS',                       author:'Kyle Simpson',       isbn:'978-1491924464', reason:'Web Dev elective',             urgency:'Low',    status:'rejected',  requestDate:'2026-05-20' },
];
