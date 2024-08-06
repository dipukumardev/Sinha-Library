document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const todoList = document.getElementById('todo-list');
    const clearButton = document.getElementById('clear-button');
    const downloadButton = document.getElementById('download-button');
    const totalAmountElem = document.getElementById('total-amount');
    const dataTableBody = document.querySelector('#data-table tbody');
    let totalAmount = 0;

    // Load existing items from localStorage
    const loadItems = () => {
        const items = JSON.parse(localStorage.getItem('todoList')) || [];
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.text;
            todoList.appendChild(li);

            // Append data to the table
            const row = document.createElement('tr');
            row.innerHTML = `<td>${item.memberId}</td><td>${item.name}</td><td>${item.amount.toFixed(2)}</td><td>${item.registrationDate}</td>`;
            dataTableBody.appendChild(row);

            totalAmount += item.amount;
        });
        totalAmountElem.textContent = totalAmount.toFixed(2); // Ensure 2 decimal places
    };

    loadItems();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const memberId = document.getElementById('member_id').value;
        const name = document.getElementById('name').value;
        const amount = parseFloat(document.getElementById('amount').value); // Ensure parsing as float
        const registrationDate = document.getElementById('registration_date').value;

        if (isNaN(amount)) {
            alert("Please enter a valid number for the amount.");
            return;
        }

        const todoItem = `Member ID: ${memberId}, Name: ${name}, Amount: ${amount.toFixed(2)}, Registration Date: ${registrationDate}`;

        // Create a new list item
        const li = document.createElement('li');
        li.textContent = todoItem;
        todoList.appendChild(li);

        // Append data to the table
        const row = document.createElement('tr');
        row.innerHTML = `<td>${memberId}</td><td>${name}</td><td>${amount.toFixed(2)}</td><td>${registrationDate}</td>`;
        dataTableBody.appendChild(row);

        // Save to localStorage
        const items = JSON.parse(localStorage.getItem('todoList')) || [];
        items.push({ text: todoItem, memberId, name, amount, registrationDate });
        localStorage.setItem('todoList', JSON.stringify(items));

        // Update the total amount
        totalAmount += amount;
        totalAmountElem.textContent = totalAmount.toFixed(2); // Ensure 2 decimal places

        form.reset();
    });

    clearButton.addEventListener('click', () => {
        todoList.innerHTML = '';
        dataTableBody.innerHTML = '';
        localStorage.removeItem('todoList');
        totalAmount = 0;
        totalAmountElem.textContent = totalAmount.toFixed(2); // Ensure 2 decimal places
    });

    downloadButton.addEventListener('click', () => {
        const data = [];
        todoList.querySelectorAll('li').forEach((li) => {
            data.push(li.textContent);
        });
        const blob = new Blob([data.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'todo-list.txt';
        a.click();
        URL.revokeObjectURL(url);
    });
});
