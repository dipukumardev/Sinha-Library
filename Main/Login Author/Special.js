document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const specialKey = document.getElementById('specialKey').value;
    const correctKey = ''; // Replace with your actual special key

    if (specialKey === correctKey) {
        window.location.href = 'Webpage.html';
    } else {
        document.getElementById('error').textContent = 'Incorrect special key. Please try again.';
    }
});
