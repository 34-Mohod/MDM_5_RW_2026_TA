const API_URL = "/api/students";

const form = document.getElementById("tenantForm");
const tableBody = document.getElementById("tenantTableBody");
const searchInput = document.getElementById("searchInput");
const message = document.getElementById("message");

let editingId = null;


/* =========================
   LOAD TENANTS
========================= */

async function loadTenants(search = "") {
    try {
        const url = search
            ? `${API_URL}?search=${encodeURIComponent(search)}`
            : API_URL;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to load records");
        }

        const tenants = await response.json();

        renderTenants(tenants);
        updateDashboard(tenants);

    } catch (error) {
        console.error(error);
        showMessage("Unable to load tenant records.", true);
    }
}


/* =========================
   DISPLAY TENANTS
========================= */

function renderTenants(tenants) {

    tableBody.innerHTML = "";

    if (!tenants.length) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    No tenant records available.
                </td>
            </tr>
        `;
        return;
    }

    tenants.forEach(tenant => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(tenant.name || "-")}</td>

            <td>
                ${escapeHTML(tenant.class_name || "-")}
            </td>

            <td>
                ₹${Number(tenant.marks || 0).toLocaleString("en-IN")}
            </td>

            <td>-</td>

            <td>
                ${escapeHTML(tenant.contact || "-")}
            </td>

            <td>
                <span>Active</span>
            </td>

            <td>
                <button onclick="editTenant(${tenant.id})">
                    Edit
                </button>

                <button onclick="deleteTenant(${tenant.id})">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}


/* =========================
   ADD TENANT
========================= */

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const formData = new FormData(form);

    const data = {
        name: formData.get("name"),
        roll_no: formData.get("property"),
        class_name: formData.get("room"),
        marks: Number(formData.get("rent")),
        contact: formData.get("contact")
    };

    try {

        let response;

        if (editingId) {

            response = await fetch(`${API_URL}/${editingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

        } else {

            response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
        }

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Operation failed");
        }

        showMessage(
            editingId
                ? "Tenant updated successfully."
                : "Tenant added successfully."
        );

        editingId = null;

        form.reset();

        await loadTenants();

    } catch (error) {

        console.error(error);
        showMessage(error.message, true);
    }
});


/* =========================
   EDIT TENANT
========================= */

async function editTenant(id) {

    try {

        const response = await fetch(API_URL);

        const tenants = await response.json();

        const tenant = tenants.find(t => t.id === id);

        if (!tenant) {
            showMessage("Tenant not found.", true);
            return;
        }

        editingId = id;

        document.querySelector('[name="name"]').value =
            tenant.name || "";

        document.querySelector('[name="property"]').value =
            tenant.roll_no || "";

        document.querySelector('[name="room"]').value =
            tenant.class_name || "";

        document.querySelector('[name="rent"]').value =
            tenant.marks || "";

        document.querySelector('[name="contact"]').value =
            tenant.contact || "";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {
        console.error(error);
        showMessage("Unable to edit tenant.", true);
    }
}


/* =========================
   DELETE TENANT
========================= */

async function deleteTenant(id) {

    if (!confirm("Delete this tenant record?")) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Delete failed");
        }

        showMessage("Tenant deleted successfully.");

        await loadTenants();

    } catch (error) {

        console.error(error);
        showMessage(error.message, true);
    }
}


/* =========================
   SEARCH
========================= */

searchInput.addEventListener("input", function() {

    loadTenants(this.value.trim());

});


/* =========================
   DASHBOARD
========================= */

function updateDashboard(tenants) {

    const totalElement =
        document.getElementById("totalTenants");

    const rentElement =
        document.getElementById("totalRent");

    const activeElement =
        document.getElementById("activeTenants");

    if (totalElement) {
        totalElement.textContent = tenants.length;
    }

    if (activeElement) {
        activeElement.textContent = tenants.length;
    }

    if (rentElement) {

        const total = tenants.reduce(
            (sum, tenant) =>
                sum + Number(tenant.marks || 0),
            0
        );

        rentElement.textContent =
            "₹" + total.toLocaleString("en-IN");
    }
}


/* =========================
   MESSAGE
========================= */

function showMessage(text, error = false) {

    if (!message) return;

    message.textContent = text;

    message.style.color =
        error ? "#dc2626" : "#16a34a";

    setTimeout(() => {
        message.textContent = "";
    }, 3000);
}


/* =========================
   SECURITY
========================= */

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


/* =========================
   INITIAL LOAD
========================= */

loadTenants();
