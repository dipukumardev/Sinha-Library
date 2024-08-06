document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseTableBody = document.querySelector('#expense-table tbody');
    const totalAmountSpan = document.getElementById('total-amount');
    let totalAmount = 0;
    let serialNo = 1;

    // Load expenses from local storage
    const loadExpenses = () => {
        const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        storedExpenses.forEach(expense => {
            addExpenseToTable(expense.serialNo, expense.date, expense.name, expense.amount);
            totalAmount += parseFloat(expense.amount);
        });
        totalAmountSpan.textContent = totalAmount.toFixed(2);
        serialNo = storedExpenses.length ? storedExpenses[storedExpenses.length - 1].serialNo + 1 : 1;
    };

    // Save expenses to local storage
    const saveExpenses = () => {
        const expenses = [];
        expenseTableBody.querySelectorAll('tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            const serialNo = cells[0].textContent;
            const date = cells[1].textContent;
            const name = cells[2].textContent;
            const amount = cells[3].textContent.replace('$', '');
            expenses.push({ serialNo, date, name, amount });
        });
        localStorage.setItem('expenses', JSON.stringify(expenses));
    };

    // Add expense to the table
    const addExpenseToTable = (serialNo, date, name, amount) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${serialNo}</td>
            <td>${date}</td>
            <td>${name}</td>
            <td>${parseFloat(amount).toFixed(2)}</td>
        `;
        expenseTableBody.appendChild(row);
    };

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const expenseName = document.getElementById('expense-name').value;
        const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
        const expenseDate = document.getElementById('expense-date').value;

        addExpenseToTable(serialNo++, expenseDate, expenseName, expenseAmount);

        totalAmount += expenseAmount;
        totalAmountSpan.textContent = totalAmount.toFixed(2);

        saveExpenses();

        expenseForm.reset();
    });

    document.getElementById('clear-expenses').addEventListener('click', () => {
        expenseTableBody.innerHTML = '';
        totalAmount = 0;
        totalAmountSpan.textContent = totalAmount.toFixed(2);
        localStorage.removeItem('expenses');
        serialNo = 1;
    });

    document.getElementById('download-expenses').addEventListener('click', () => {
        const expenses = [];
        expenseTableBody.querySelectorAll('tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            const serialNo = cells[0].textContent;
            const date = cells[1].textContent;
            const name = cells[2].textContent;
            const amount = cells[3].textContent;
            expenses.push({ serialNo, date, name, amount });
        });

        let table = '<table border="1"><tr><th>Serial No.</th><th>Date</th><th>Name of Expense</th><th>Amount</th></tr>';
        expenses.forEach(expense => {
            table += `<tr><td>${expense.serialNo}</td><td>${expense.date}</td><td>${expense.name}</td><td>${expense.amount}</td></tr>`;
        });
        table += '</table>';

        const blob = new Blob([table], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'expenses.html';
        a.click();
        URL.revokeObjectURL(url);
    });

    loadExpenses();
});
