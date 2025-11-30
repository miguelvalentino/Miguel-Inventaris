let dataTable;

document.addEventListener('DOMContentLoaded', () => {
    initPage();
});

async function initPage() {
    await Promise.all([
        loadDropdown(),
        loadHistory()
    ]);
}

async function loadDropdown() {
    try {
        const response = await fetch('/api/items');
        const items = await response.json();

        const selectBarang = document.getElementById('selectBarang');
        selectBarang.innerHTML = '<option selected value="">Pilih barang</option>';

        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id_item;
            option.textContent = `${item.name_item} (Sisa Stok: ${item.total_item})`;
            selectBarang.appendChild(option);
        });
    } catch (error) {
        console.error('Gagal memuat dropdown:', error);
    }
}

async function loadHistory() {
    try {
        const response = await fetch('/api/items/out'); 
        const history = await response.json();

        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';

        if (history.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Belum ada barang keluar</td></tr>';
        } else {
            history.forEach((row, index) => {
                const date = new Date(row.date_exit).toLocaleDateString('id-ID'); 
                const itemName = row.name_item || 'Barang Dihapus';
                const tr = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${itemName}</td>
                        <td>${date}</td>
                        <td>${row.total_exit}</td> 
                        <td>${row.info_exit || '-'}</td>
                    </tr>
                `;
                tableBody.insertAdjacentHTML('beforeend', tr);
            });
        }

        const tableElement = document.getElementById('datatablesSimple');
        if (tableElement) {
            if (dataTable) dataTable.destroy();
            dataTable = new simpleDatatables.DataTable(tableElement);
        }
    } catch (error) {
        console.error('Gagal memuat tabel:', error);
    }
}

async function keluarBarang() {
    const idItem = document.getElementById('selectBarang').value;
    const totalExit = document.getElementById('outItem').value; // ID input jumlah disesuaikan
    const infoExit = document.getElementById('outInfo').value;  // ID input info disesuaikan

    if (!idItem) return alert("Pilih barang terlebih dahulu");
    if (!totalExit || totalExit <= 0) return alert("Jumlah barang harus lebih dari 0");

    try {
        const response = await fetch('/api/items/out', { // <--- POST ke endpoint OUT
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_item: parseInt(idItem),
                total_exit: parseInt(totalExit),
                info_exit: infoExit
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Berhasil mengeluarkan barang!");
            location.reload(); 
        } else {
            alert("Gagal: " + (result.error || "Terjadi kesalahan server"));
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Gagal menghubungi server");
    }
}