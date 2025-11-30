const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();

const db = require("./database");

// Middleware parsing body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Proses Login
app.post('/login', async (req, res) => {
    const { user_name, password } = req.body;

    try {
        const result = await db.query(
            "SELECT * FROM users WHERE user_name = $1 AND password = $2",
            [user_name, password]
        );
        if (result.length > 0) {
            console.log("Login Berhasil!");
            res.redirect('/index.html');
        } else {
            console.log("Login Gagal: Data tidak cocok");
            res.send("Login gagal: Username atau password salah.");
        }

    } catch (err) {
        console.error("Database Error:", err);
        res.send("Terjadi error di server.");
    }
});

app.listen(3000, () => console.log("Server berjalan di http://localhost:3000/login"));