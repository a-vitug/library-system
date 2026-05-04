function renderOrders(books) {
    const container = document.getElementById("ordersContainer");

    container.innerHTML = "";

    if (!books.length) {
        container.innerHTML = "<p>No borrowed books.</p>";
        return;
    }

    books.forEach(book => {
        const div = document.createElement("div");
        div.className = "book-item";

        if (new Date(book.dueDate) < new Date()) {
            div.classList.add("overdue");
        }

        div.innerHTML = `
            <div class="book-item-cover book-item-placeholder"></div>

            <div class="book-item-info">
                <p class="book-item-title">${book.title}</p>

                <p class="book-item-author">
                    ${book.authors?.join(', ') || book.author || "Unknown Author"}
                </p>

                ${
                    book.dueDate
                    ? `<span class="status-badge">Due: ${new Date(book.dueDate).toLocaleDateString()}</span>`
                    : ''
                }
            </div>

            <button class="remove-btn" onclick="returnBook('${book._id}')">
                Return
            </button>
        `;

        container.appendChild(div);
    });
};

async function loadOrders() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/log-in";
        return;
    }

    try {
        const res = await fetch('/api/user/orders', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) {
            throw new Error("Failed to load orders");
        }

        const books = await res.json();

        renderOrders(books);

    } catch (err) {
        console.error(err);
        document.getElementById("ordersContainer").innerHTML = "<p>Failed to load orders.</p>";
    }
};

async function returnBook(id) {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`/books/return/${id}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) {
            throw new Error("Return failed");
        }

        loadOrders();

    } catch (err) {
        console.error(err);
        alert("Error returning book");
    }
};

loadOrders();