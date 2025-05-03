Neutralino.init();

// Pseudo data simulating posts by category
const pseudoData = [
    { id: 1, category: "Tech", title: "AI Innovations", body: "Exploring advancements in artificial intelligence." },
    { id: 2, category: "Lifestyle", title: "Wellness Trends", body: "Tips for a healthier lifestyle in 2025." },
    { id: 3, category: "News", title: "World Events", body: "Key global news updates." },
    { id: 4, category: "Tech", title: "Quantum Computing", body: "The future of computing technology." },
    { id: 5, category: "Lifestyle", title: "Minimalist Living", body: "Benefits of a minimalist lifestyle." },
    { id: 6, category: "News", title: "Economic Trends", body: "Analysis of current market trends." }
];

function fetchPosts() {
    try {
        Neutralino.os.showNotification('Success', 'Pseudo data loaded successfully!');
        displayData(pseudoData);
    } catch (error) {
        Neutralino.os.showMessageBox('Error', 'Failed to load data: ' + error.message, 'OK', 'ERROR');
    }
}

function displayData(data) {
    // Update summary
    const summary = document.getElementById('summary');
    if (summary) {
        const uniqueCategories = [...new Set(data.map(post => post.category))].length;
        summary.textContent = `Total Posts: ${data.length} | Unique Categories: ${uniqueCategories}`;
    }

    // Update table
    const tableBody = document.getElementById('tableBody');
    if (tableBody) {
        tableBody.innerHTML = '';
        data.forEach(post => {
            const row = document.createElement('tr');
            row.className = 'border-b';
            row.innerHTML = `
                <td class="p-3">${post.id}</td>
                <td class="p-3">${post.title}</td>
                <td class="p-3">${post.category}</td>
            `;
            row.addEventListener('click', () => showPostDetails(post));
            tableBody.appendChild(row);
        });
    }
}

function showPostDetails(post) {
    const details = document.getElementById('postDetails');
    document.getElementById('postTitle').textContent = post.title;
    document.getElementById('postBody').textContent = post.body;
    details.classList.remove('hidden');
}

document.getElementById('fetchPosts').addEventListener('click', fetchPosts);

document.getElementById('closeDetails').addEventListener('click', () => {
    document.getElementById('postDetails').classList.add('hidden');
});

Neutralino.events.on('windowClose', () => {
    Neutralino.app.exit();
});