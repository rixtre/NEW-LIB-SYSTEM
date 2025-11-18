// Application state
let currentUser = null;
let appData = {
    users: [],
    transactions: [],
    penalties: [],
    books: []
};

// Sample book database
const sampleBooks = [
    {
        code: "CS101",
        title: "Introduction to Computer Science",
        versions: [
            { version: "1st Edition", copies: 5, available: 5 },
            { version: "2nd Edition", copies: 3, available: 3 },
            { version: "3rd Edition", copies: 2, available: 2 }
        ],
        author: "John Smith",
        category: "Computer Science"
    },
    {
        code: "MATH201",
        title: "Advanced Calculus",
        versions: [
            { version: "1st Edition", copies: 4, available: 4 },
            { version: "2nd Edition", copies: 2, available: 1 }
        ],
        author: "Maria Garcia",
        category: "Mathematics"
    },
    {
        code: "PHY301",
        title: "Modern Physics",
        versions: [
            { version: "1st Edition", copies: 3, available: 0 },
            { version: "2nd Edition", copies: 4, available: 4 }
        ],
        author: "Robert Johnson",
        category: "Physics"
    },
    {
        code: "ENG401",
        title: "English Literature",
        versions: [
            { version: "1st Edition", copies: 6, available: 6 }
        ],
        author: "Sarah Williams",
        category: "Literature"
    },
    {
        code: "BIO501",
        title: "Cell Biology",
        versions: [
            { version: "1st Edition", copies: 3, available: 2 },
            { version: "2nd Edition", copies: 5, available: 5 }
        ],
        author: "David Brown",
        category: "Biology"
    }
];

// DOM Elements
const screens = {
    login: document.getElementById('loginScreen'),
    admin: document.getElementById('adminDashboard'),
    librarian: document.getElementById('librarianDashboard'),
    student: document.getElementById('studentDashboard'),
    addLibrarian: document.getElementById('addLibrarianScreen'),
    addStudent: document.getElementById('addStudentScreen'),
    createStudentAccount: document.getElementById('createStudentAccountScreen'),
    manageUsers: document.getElementById('manageUsersScreen'),
    borrowBook: document.getElementById('borrowBookScreen'),
    returnBook: document.getElementById('returnBookScreen'),
    changePassword: document.getElementById('changePasswordScreen'),
    viewTransactions: document.getElementById('viewTransactionsScreen'),
    viewLogs: document.getElementById('viewLogsScreen')
};

const modals = {
    resetPassword: document.getElementById('resetPasswordModal'),
    deleteUser: document.getElementById('deleteUserModal'),
    success: document.getElementById('successModal'),
    error: document.getElementById('errorModal')
};

let userToDelete = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadData();
    setupEventListeners();
    setupLoginTabs();
    showScreen('login');
}

function setupLoginTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update tabs
            tabBtns.forEach(tb => tb.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabId + 'Tab').classList.add('active');
        });
    });
}

function loadData() {
    const savedData = localStorage.getItem('libraryData');
    if (savedData) {
        appData = JSON.parse(savedData);
        // Ensure books data exists
        if (!appData.books || appData.books.length === 0) {
            appData.books = JSON.parse(JSON.stringify(sampleBooks));
        }
    } else {
        initializeDefaultData();
    }
}

function saveData() {
    localStorage.setItem('libraryData', JSON.stringify(appData));
}

function initializeDefaultData() {
    appData = {
        users: [
            {
                id: 1,
                username: 'admin',
                password: 'admin123',
                role: 'admin',
                rfid_tag: '3235673260',
                name: 'System Administrator',
                gender: 'male',
                active: true
            },
            {
                id: 2,
                username: 'librarian1',
                password: 'lib123',
                role: 'librarian',
                rfid_tag: '1122334455',
                name: 'Jane Librarian',
                gender: 'female',
                active: true
            },
            {
                id: 3,
                username: 'juancruz',
                password: 'student123',
                role: 'student',
                rfid_tag: '9988776655',
                name: 'Juan Cruz',
                gender: 'male',
                active: true
            }
        ],
        transactions: [],
        penalties: [],
        books: JSON.parse(JSON.stringify(sampleBooks))
    };
    saveData();
}

function setupEventListeners() {
    // Login
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('createStudentAccountBtn').addEventListener('click', () => showScreen('createStudentAccount'));
    document.getElementById('createStudentAccountForm').addEventListener('submit', handleCreateStudentAccount);
    document.getElementById('backFromCreateStudent').addEventListener('click', () => showScreen('login'));
    
    // Logout
    document.getElementById('adminLogout').addEventListener('click', logout);
    document.getElementById('librarianLogout').addEventListener('click', logout);
    document.getElementById('studentLogout').addEventListener('click', logout);
    
    // Admin Dashboard
    document.getElementById('addLibrarianBtn').addEventListener('click', () => showScreen('addLibrarian'));
    document.getElementById('resetPasswordBtn').addEventListener('click', showResetPasswordModal);
    document.getElementById('manageUsersBtn').addEventListener('click', () => {
        loadUsersTable();
        showScreen('manageUsers');
    });
    document.getElementById('viewTransactionsBtn').addEventListener('click', () => {
        loadTransactionsTable();
        showScreen('viewTransactions');
    });
    document.getElementById('viewLogsBtn').addEventListener('click', () => {
        loadLogsTable();
        showScreen('viewLogs');
    });
    
    // Librarian Dashboard
    document.getElementById('addStudentBtn').addEventListener('click', () => showScreen('addStudent'));
    document.getElementById('borrowBookBtn').addEventListener('click', () => {
        resetBorrowForm();
        showScreen('borrowBook');
    });
    document.getElementById('returnBookBtn').addEventListener('click', () => showScreen('returnBook'));
    document.getElementById('changePasswordBtn').addEventListener('click', () => showScreen('changePassword'));
    document.getElementById('viewLibrarianTransactionsBtn').addEventListener('click', () => {
        loadTransactionsTable();
        showScreen('viewTransactions');
    });
    
    // Book Search
    document.getElementById('searchBookBtn').addEventListener('click', searchBook);
    
    // Back buttons
    document.getElementById('backFromAddLibrarian').addEventListener('click', () => showScreen('admin'));
    document.getElementById('backFromAddStudent').addEventListener('click', () => showScreen('librarian'));
    document.getElementById('backFromManageUsers').addEventListener('click', () => showScreen('admin'));
    document.getElementById('backFromBorrow').addEventListener('click', () => showScreen('librarian'));
    document.getElementById('backFromReturn').addEventListener('click', () => showScreen('librarian'));
    document.getElementById('backFromChangePassword').addEventListener('click', () => showScreen('librarian'));
    document.getElementById('backFromTransactions').addEventListener('click', handleBackFromTransactions);
    document.getElementById('backFromLogs').addEventListener('click', () => showScreen('admin'));
    
    // Forms
    document.getElementById('addLibrarianForm').addEventListener('submit', handleAddLibrarian);
    document.getElementById('addStudentForm').addEventListener('submit', handleAddStudent);
    document.getElementById('borrowBookForm').addEventListener('submit', handleBorrowBook);
    document.getElementById('returnBookForm').addEventListener('submit', handleReturnBook);
    document.getElementById('changePasswordForm').addEventListener('submit', handleChangePassword);
    
    // Filters
    document.getElementById('roleFilter').addEventListener('change', loadUsersTable);
    document.getElementById('userSearch').addEventListener('input', loadUsersTable);
    document.getElementById('statusFilter').addEventListener('change', loadTransactionsTable);
    document.getElementById('transactionSearch').addEventListener('input', loadTransactionsTable);
    
    // Modals
    document.getElementById('cancelReset').addEventListener('click', () => hideModal('resetPassword'));
    document.getElementById('confirmReset').addEventListener('click', handleResetPassword);
    document.getElementById('cancelDelete').addEventListener('click', () => hideModal('deleteUser'));
    document.getElementById('confirmDelete').addEventListener('click', handleDeleteUser);
    document.getElementById('successOk').addEventListener('click', () => hideModal('success'));
    document.getElementById('errorOk').addEventListener('click', () => hideModal('error'));
}

function resetBorrowForm() {
    document.getElementById('borrowBookForm').reset();
    document.getElementById('borrowBookTitle').value = '';
    document.getElementById('bookVersion').innerHTML = '<option value="">Select Version</option>';
    document.getElementById('bookAvailability').innerHTML = '';
    document.getElementById('bookAvailability').className = 'book-availability';
}

function searchBook() {
    const bookCode = document.getElementById('bookCode').value.trim().toUpperCase();
    const book = appData.books.find(b => b.code === bookCode);
    
    if (!book) {
        showError('Book not found. Please check the book code.');
        document.getElementById('borrowBookTitle').value = '';
        document.getElementById('bookVersion').innerHTML = '<option value="">Select Version</option>';
        document.getElementById('bookAvailability').innerHTML = '';
        document.getElementById('bookAvailability').className = 'book-availability';
        return;
    }
    
    // Update book title
    document.getElementById('borrowBookTitle').value = book.title;
    
    // Update version dropdown
    const versionSelect = document.getElementById('bookVersion');
    versionSelect.innerHTML = '<option value="">Select Version</option>';
    
    book.versions.forEach(version => {
        const option = document.createElement('option');
        option.value = version.version;
        option.textContent = `${version.version} (${version.available}/${version.copies} available)`;
        option.disabled = version.available === 0;
        versionSelect.appendChild(option);
    });
    
    // Update availability info
    const availabilityDiv = document.getElementById('bookAvailability');
    const totalAvailable = book.versions.reduce((sum, v) => sum + v.available, 0);
    
    if (totalAvailable > 0) {
        availabilityDiv.className = 'book-availability available';
        availabilityDiv.innerHTML = `
            <div class="availability-info"><strong>✓ Available:</strong> ${totalAvailable} copy/copies total</div>
            <div class="availability-info"><strong>Author:</strong> ${book.author}</div>
            <div class="availability-info"><strong>Category:</strong> ${book.category}</div>
            <div class="availability-info"><strong>Available Versions:</strong></div>
            ${book.versions.map(v => `
                <div class="version-option ${v.available > 0 ? 'version-available' : 'version-unavailable'}">
                    <span>${v.version}</span>
                    <span>${v.available}/${v.copies} available</span>
                </div>
            `).join('')}
        `;
    } else {
        availabilityDiv.className = 'book-availability unavailable';
        availabilityDiv.innerHTML = `
            <div class="availability-info"><strong>✗ Not Available:</strong> All copies are currently borrowed</div>
            <div class="availability-info"><strong>Author:</strong> ${book.author}</div>
            <div class="availability-info"><strong>Category:</strong> ${book.category}</div>
        `;
    }
}

function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        if (screen) screen.classList.remove('active');
    });
    
    if (screens[screenName]) {
        screens[screenName].classList.add('active');
        
        if (screenName === 'student') {
            loadStudentData();
        } else if (screenName === 'admin') {
            loadLibrarianSelect();
        }
    }
}

function showModal(modalName) {
    if (modals[modalName]) {
        modals[modalName].classList.add('active');
    }
}

function hideModal(modalName) {
    if (modals[modalName]) {
        modals[modalName].classList.remove('active');
    }
}

function showSuccess(message) {
    document.getElementById('successMessage').textContent = message;
    showModal('success');
}

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    showModal('error');
}

function handleLogin(e) {
    e.preventDefault();
    
    const isRfidTab = document.getElementById('rfidTab').classList.contains('active');
    let user = null;
    
    if (isRfidTab) {
        const rfid = document.getElementById('rfidInput').value.trim();
        if (!rfid) {
            showError('Please enter RFID');
            return;
        }
        user = appData.users.find(u => u.active && u.rfid_tag === rfid);
    } else {
        const username = document.getElementById('usernameInput').value.trim();
        const password = document.getElementById('passwordInput').value;
        
        if (!username || !password) {
            showError('Please enter both username and password');
            return;
        }
        user = appData.users.find(u => u.active && u.username === username && u.password === password);
    }
    
    if (user) {
        currentUser = user;
        updateDashboardHeader(user);
        redirectToDashboard(user.role);
        document.getElementById('loginForm').reset();
    } else {
        showError('Invalid login credentials');
    }
}

function updateDashboardHeader(user) {
    const header = document.querySelector(`#${user.role}Dashboard .header-content h1`);
    if (header) {
        header.textContent = `Welcome, ${user.name || user.username}`;
    }
}

function redirectToDashboard(role) {
    switch(role) {
        case 'admin':
            showScreen('admin');
            break;
        case 'librarian':
            showScreen('librarian');
            break;
        case 'student':
            showScreen('student');
            break;
        default:
            showError('Unknown user role');
    }
}

function handleCreateStudentAccount(e) {
    e.preventDefault();
    
    const name = document.getElementById('newStudentName').value.trim();
    const studentId = document.getElementById('newStudentId').value.trim();
    const gender = document.getElementById('newStudentGender').value;
    const rfid = document.getElementById('newStudentRfid').value.trim();
    const password = document.getElementById('newStudentPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    if (password.length < 4) {
        showError('Password must be at least 4 characters long');
        return;
    }
    
    if (appData.users.find(u => u.active && u.username === studentId)) {
        showError('Student ID already exists');
        return;
    }
    
    if (rfid && appData.users.find(u => u.active && u.rfid_tag === rfid)) {
        showError('RFID already registered');
        return;
    }
    
    const newStudent = {
        id: Date.now(),
        username: studentId,
        password: password,
        role: 'student',
        rfid_tag: rfid || '',
        name: name,
        gender: gender,
        active: true
    };
    
    appData.users.push(newStudent);
    saveData();
    showSuccess('Student account created successfully!');
    document.getElementById('createStudentAccountForm').reset();
    showScreen('login');
}

function logout() {
    currentUser = null;
    showScreen('login');
}

function handleAddLibrarian(e) {
    e.preventDefault();
    
    const employeeId = document.getElementById('employeeId').value.trim();
    const name = document.getElementById('librarianName').value.trim();
    const gender = document.getElementById('librarianGender').value;
    const rfid = document.getElementById('librarianRfid').value.trim();
    
    if (appData.users.find(u => u.active && (u.username === employeeId || u.rfid_tag === rfid))) {
        showError('Employee ID or RFID already exists');
        return;
    }
    
    const newLibrarian = {
        id: Date.now(),
        username: employeeId,
        password: 'lib123',
        role: 'librarian',
        rfid_tag: rfid,
        name: name,
        gender: gender,
        active: true
    };
    
    appData.users.push(newLibrarian);
    saveData();
    showSuccess(`Librarian ${name} added successfully!`);
    document.getElementById('addLibrarianForm').reset();
    showScreen('admin');
}

function handleAddStudent(e) {
    e.preventDefault();
    
    const name = document.getElementById('studentName').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const gender = document.getElementById('studentGender').value;
    const rfid = document.getElementById('studentRfid').value.trim();
    
    if (appData.users.find(u => u.active && (u.username === studentId || u.rfid_tag === rfid))) {
        showError('Student ID or RFID already exists');
        return;
    }
    
    const newStudent = {
        id: Date.now(),
        username: studentId,
        password: studentId,
        role: 'student',
        rfid_tag: rfid,
        name: name,
        gender: gender,
        active: true
    };
    
    appData.users.push(newStudent);
    saveData();
    showSuccess(`Student ${name} added successfully!`);
    document.getElementById('addStudentForm').reset();
    showScreen('librarian');
}

function handleBorrowBook(e) {
    e.preventDefault();
    
    const studentRfid = document.getElementById('borrowRfid').value.trim();
    const bookCode = document.getElementById('bookCode').value.trim().toUpperCase();
    const bookVersion = document.getElementById('bookVersion').value;
    
    const student = appData.users.find(u => u.active && u.rfid_tag === studentRfid && u.role === 'student');
    if (!student) {
        showError('Student not found');
        return;
    }
    
    const book = appData.books.find(b => b.code === bookCode);
    if (!book) {
        showError('Book not found');
        return;
    }
    
    const version = book.versions.find(v => v.version === bookVersion);
    if (!version) {
        showError('Please select a valid book version');
        return;
    }
    
    if (version.available === 0) {
        showError('Selected version is not available');
        return;
    }
    
    // Decrease available count
    version.available--;
    
    const borrowDate = new Date();
    const returnDue = new Date(borrowDate);
    returnDue.setDate(returnDue.getDate() + 3);
    
    const newTransaction = {
        id: Date.now(),
        student_rfid: studentRfid,
        book_code: bookCode,
        book_title: book.title,
        book_version: bookVersion,
        borrow_date: borrowDate.toISOString(),
        return_due: returnDue.toISOString(),
        return_date: null,
        status: 'Borrowed',
        penalty: 0
    };
    
    appData.transactions.push(newTransaction);
    saveData();
    showSuccess(`Book "${book.title}" (${bookVersion}) borrowed successfully!`);
    resetBorrowForm();
    showScreen('librarian');
}

function handleReturnBook(e) {
    e.preventDefault();
    
    const studentRfid = document.getElementById('returnRfid').value.trim();
    const bookCode = document.getElementById('returnBookCode').value.trim().toUpperCase();
    const bookTitle = document.getElementById('returnBookTitle').value.trim();
    
    const transaction = appData.transactions.find(t => 
        t.student_rfid === studentRfid && 
        t.book_code === bookCode && 
        t.status === 'Borrowed'
    );
    
    if (!transaction) {
        showError('No matching borrow record found');
        return;
    }
    
    const book = appData.books.find(b => b.code === bookCode);
    if (book) {
        const version = book.versions.find(v => v.version === transaction.book_version);
        if (version) {
            version.available++;
        }
    }
    
    const returnDate = new Date();
    transaction.return_date = returnDate.toISOString();
    
    const dueDate = new Date(transaction.return_due);
    if (returnDate > dueDate) {
        const penaltyAmount = 50;
        transaction.penalty = penaltyAmount;
        transaction.status = 'Late';
        
        const newPenalty = {
            id: Date.now(),
            student_rfid: studentRfid,
            penalty_amount: penaltyAmount,
            book_title: bookTitle,
            date_recorded: returnDate.toISOString()
        };
        
        appData.penalties.push(newPenalty);
        showSuccess(`Book returned late! ₱${penaltyAmount} penalty imposed.`);
    } else {
        transaction.status = 'Returned';
        showSuccess('Book returned successfully!');
    }
    
    saveData();
    document.getElementById('returnBookForm').reset();
    showScreen('librarian');
}

function handleChangePassword(e) {
    e.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    
    if (newPassword.length < 4) {
        showError('Password must be at least 4 characters long');
        return;
    }
    
    const userIndex = appData.users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        appData.users[userIndex].password = newPassword;
        saveData();
        showSuccess('Password updated successfully!');
        document.getElementById('changePasswordForm').reset();
        showScreen('librarian');
    }
}

function showResetPasswordModal() {
    loadLibrarianSelect();
    showModal('resetPassword');
}

function loadLibrarianSelect() {
    const select = document.getElementById('librarianSelect');
    select.innerHTML = '<option value="">-- select librarian --</option>';
    
    const librarians = appData.users.filter(u => u.role === 'librarian' && u.active);
    librarians.forEach(lib => {
        const option = document.createElement('option');
        option.value = lib.username;
        option.textContent = lib.name ? `${lib.name} (${lib.username})` : lib.username;
        select.appendChild(option);
    });
}

function handleResetPassword() {
    const librarianUsername = document.getElementById('librarianSelect').value;
    
    if (!librarianUsername) {
        showError('Please select a librarian');
        return;
    }
    
    const userIndex = appData.users.findIndex(u => 
        u.active && u.username === librarianUsername && u.role === 'librarian'
    );
    
    if (userIndex !== -1) {
        appData.users[userIndex].password = 'lib123';
        saveData();
        const librarian = appData.users[userIndex];
        showSuccess(`Password for ${librarian.name || librarian.username} reset to: lib123`);
        hideModal('resetPassword');
    }
}

function loadUsersTable() {
    const container = document.getElementById('usersTable');
    const roleFilter = document.getElementById('roleFilter').value;
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    
    let filteredUsers = appData.users.filter(user => user.active);
    
    if (roleFilter !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
    }
    
    if (searchTerm) {
        filteredUsers = filteredUsers.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.username.toLowerCase().includes(searchTerm) ||
            user.rfid_tag.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filteredUsers.length > 0) {
        let html = `
            <table>
                <tr>
                    <th>Name</th>
                    <th>Username/ID</th>
                    <th>Role</th>
                    <th>RFID</th>
                    <th>Gender</th>
                    <th>Actions</th>
                </tr>
        `;
        
        filteredUsers.forEach(user => {
            const isCurrentUser = currentUser && user.id === currentUser.id;
            const adminCount = appData.users.filter(u => u.role === 'admin' && u.active).length;
            const isLastAdmin = user.role === 'admin' && adminCount === 1;
            
            html += `
                <tr>
                    <td>${user.name || 'N/A'}</td>
                    <td>${user.username}</td>
                    <td><span class="status-badge status-active">${user.role}</span></td>
                    <td>${user.rfid_tag || 'No RFID'}</td>
                    <td>${user.gender || 'N/A'}</td>
                    <td class="action-buttons">
                        ${!isCurrentUser && !isLastAdmin ? 
                            `<button class="btn btn-danger" onclick="confirmDeleteUser(${user.id})">Delete</button>` : 
                            `<button class="btn btn-back" disabled>Cannot Delete</button>`
                        }
                    </td>
                </tr>
            `;
        });
        
        html += '</table>';
        container.innerHTML = html;
    } else {
        container.innerHTML = '<p>No users found</p>';
    }
}

function confirmDeleteUser(userId) {
    userToDelete = appData.users.find(user => user.id === userId);
    
    if (!userToDelete) {
        showError('User not found');
        return;
    }
    
    const activeTransactions = appData.transactions.filter(
        t => t.student_rfid === userToDelete.rfid_tag && t.status === 'Borrowed'
    );
    
    let warningMessage = `Delete user "${userToDelete.name}"?`;
    if (activeTransactions.length > 0) {
        warningMessage += `<br><br>Warning: ${activeTransactions.length} active transaction(s).`;
    }
    
    document.getElementById('deleteUserMessage').innerHTML = warningMessage;
    document.getElementById('deleteUserDetails').innerHTML = `
        <p><strong>Username:</strong> ${userToDelete.username}</p>
        <p><strong>Role:</strong> ${userToDelete.role}</p>
        <p><strong>RFID:</strong> ${userToDelete.rfid_tag || 'No RFID'}</p>
    `;
    
    showModal('deleteUser');
}

function handleDeleteUser() {
    if (!userToDelete) return;
    
    const userIndex = appData.users.findIndex(user => user.id === userToDelete.id);
    if (userIndex !== -1) {
        appData.users[userIndex].active = false;
        saveData();
        showSuccess(`User "${userToDelete.name}" deleted successfully.`);
        hideModal('deleteUser');
        loadUsersTable();
    }
    
    userToDelete = null;
}

function loadStudentData() {
    if (!currentUser || currentUser.role !== 'student') return;
    
    const studentTransactions = appData.transactions.filter(t => t.student_rfid === currentUser.rfid_tag);
    const transactionsContainer = document.getElementById('studentTransactions');
    
    if (studentTransactions.length > 0) {
        let html = `
            <table>
                <tr>
                    <th>Book Title</th>
                    <th>Version</th>
                    <th>Status</th>
                    <th>Borrowed On</th>
                    <th>Returned On</th>
                </tr>
        `;
        
        studentTransactions.forEach(t => {
            html += `
                <tr>
                    <td>${t.book_title}</td>
                    <td>${t.book_version}</td>
                    <td>${t.status}</td>
                    <td>${formatDate(t.borrow_date)}</td>
                    <td>${t.return_date ? formatDate(t.return_date) : 'Not returned'}</td>
                </tr>
            `;
        });
        
        html += '</table>';
        transactionsContainer.innerHTML = html;
    } else {
        transactionsContainer.innerHTML = '<p>No borrow history</p>';
    }
    
    const studentPenalties = appData.penalties.filter(p => p.student_rfid === currentUser.rfid_tag);
    const penaltiesContainer = document.getElementById('studentPenalties');
    
    if (studentPenalties.length > 0) {
        let html = `
            <table>
                <tr>
                    <th>Amount (PHP)</th>
                    <th>Book Title</th>
                    <th>Date Recorded</th>
                </tr>
        `;
        
        studentPenalties.forEach(p => {
            html += `
                <tr>
                    <td>₱${p.penalty_amount.toFixed(2)}</td>
                    <td>${p.book_title}</td>
                    <td>${formatDate(p.date_recorded)}</td>
                </tr>
            `;
        });
        
        html += '</table>';
        penaltiesContainer.innerHTML = html;
    } else {
        penaltiesContainer.innerHTML = '<p>No pending penalties</p>';
    }
}

function loadTransactionsTable() {
    const container = document.getElementById('transactionsTable');
    const statusFilter = document.getElementById('statusFilter').value;
    const searchTerm = document.getElementById('transactionSearch').value.toLowerCase();
    
    let filteredTransactions = [...appData.transactions];
    
    if (statusFilter !== 'all') {
        if (statusFilter === 'Late') {
            filteredTransactions = filteredTransactions.filter(t => 
                t.status === 'Borrowed' && new Date() > new Date(t.return_due)
            );
        } else {
            filteredTransactions = filteredTransactions.filter(t => t.status === statusFilter);
        }
    }
    
    if (searchTerm) {
        filteredTransactions = filteredTransactions.filter(t => 
            t.student_rfid.toLowerCase().includes(searchTerm) ||
            t.book_title.toLowerCase().includes(searchTerm) ||
            t.book_code.toLowerCase().includes(searchTerm)
        );
    }
    
    filteredTransactions.sort((a, b) => new Date(b.borrow_date) - new Date(a.borrow_date));
    
    if (filteredTransactions.length > 0) {
        let html = `
            <table>
                <tr>
                    <th>Student RFID</th>
                    <th>Book Code</th>
                    <th>Book Title</th>
                    <th>Version</th>
                    <th>Borrow Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Status</th>
                    <th>Penalty</th>
                </tr>
        `;
        
        filteredTransactions.forEach(t => {
            const isLate = t.status === 'Borrowed' && new Date() > new Date(t.return_due);
            const displayStatus = isLate ? 'Late' : t.status;
            const rowClass = isLate ? 'class="late-row"' : '';
            
            html += `
                <tr ${rowClass}>
                    <td>${t.student_rfid}</td>
                    <td>${t.book_code}</td>
                    <td>${t.book_title}</td>
                    <td>${t.book_version}</td>
                    <td>${formatDate(t.borrow_date)}</td>
                    <td>${formatDate(t.return_due)}</td>
                    <td>${t.return_date ? formatDate(t.return_date) : 'Not returned'}</td>
                    <td>${displayStatus}</td>
                    <td>₱${t.penalty.toFixed(2)}</td>
                </tr>
            `;
        });
        
        html += '</table>';
        container.innerHTML = html;
    } else {
        container.innerHTML = '<p>No transactions found</p>';
    }
}

function loadLogsTable() {
    const container = document.getElementById('logsTable');
    
    if (appData.transactions.length > 0) {
        let html = `
            <table>
                <tr>
                    <th>Student RFID</th>
                    <th>Book Code</th>
                    <th>Book Title</th>
                    <th>Version</th>
                    <th>Borrowed On</th>
                    <th>Due Date</th>
                    <th>Returned On</th>
                    <th>Status</th>
                    <th>Penalty</th>
                </tr>
        `;
        
        const sortedTransactions = [...appData.transactions].sort((a, b) => 
            new Date(b.borrow_date) - new Date(a.borrow_date)
        );
        
        sortedTransactions.forEach(t => {
            const isLate = t.status === 'Borrowed' && new Date() > new Date(t.return_due);
            const displayStatus = isLate ? 'Late' : t.status;
            
            html += `
                <tr>
                    <td>${t.student_rfid}</td>
                    <td>${t.book_code}</td>
                    <td>${t.book_title}</td>
                    <td>${t.book_version}</td>
                    <td>${formatDate(t.borrow_date)}</td>
                    <td>${formatDate(t.return_due)}</td>
                    <td>${t.return_date ? formatDate(t.return_date) : 'N/A'}</td>
                    <td>${displayStatus}</td>
                    <td>₱${t.penalty.toFixed(2)}</td>
                </tr>
            `;
        });
        
        html += '</table>';
        container.innerHTML = html;
    } else {
        container.innerHTML = '<p>No transaction logs</p>';
    }
}

function handleBackFromTransactions() {
    if (currentUser.role === 'admin') {
        showScreen('admin');
    } else {
        showScreen('librarian');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}