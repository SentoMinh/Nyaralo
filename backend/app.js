const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3");

// .env betöltése backend/.env vagy gyökér .env fájlból
const envFiles = [
    path.resolve(__dirname, ".env"),
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "backend/.env")
];
for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
        require("dotenv").config({ path: envFile });
        break;
    }
}

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/index.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/admin.html"));
});

// Adatbázis elérési útjának megbízható felderítése
function findDbPath() {
    const candidates = [
        process.env.DATABASE && path.isAbsolute(process.env.DATABASE) ? process.env.DATABASE : null,
        process.env.DATABASE ? path.resolve(__dirname, process.env.DATABASE) : null,
        process.env.DATABASE ? path.resolve(process.cwd(), process.env.DATABASE) : null,
        path.resolve(__dirname, "../database/nyaralo.db"),
        path.resolve(process.cwd(), "database/nyaralo.db"),
        path.resolve(process.cwd(), "nyaralo.db")
    ].filter(Boolean);

    for (const candidate of candidates) {
        if (fs.existsSync(candidate) && fs.statSync(candidate).size > 0) {
            return candidate;
        }
    }
    return path.resolve(__dirname, "../database/nyaralo.db");
}

const dbPath = findDbPath();

// Könyvtár biztosítása, ha nem létezik
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Adatbázis hiba:", err.message);
    }
});

// Automatikus séma- és tesztadat-inicializálás, ha a táblák nem léteznek
db.serialize(() => {
    const schemaCandidates = [
        path.resolve(__dirname, "../database/database.sql"),
        path.resolve(process.cwd(), "database/database.sql"),
        path.resolve(process.cwd(), "database.sql")
    ];
    const schemaFile = schemaCandidates.find(f => fs.existsSync(f));
    if (schemaFile) {
        const schemaSql = fs.readFileSync(schemaFile, "utf8");
        db.exec(schemaSql, (err) => {
            if (err) {
                console.error("Hiba az adatbázis séma létrehozásakor:", err.message);
            } else {
                // Ellenőrzés: ha üres a foglalasok tábla, töltsük be az alapértelmezett tesztadatokat
                db.get("SELECT COUNT(*) AS count FROM foglalasok", (countErr, row) => {
                    if (!countErr && row && row.count === 0) {
                        const seedCandidates = [
                            path.resolve(__dirname, "../database/tesztadatok.sql"),
                            path.resolve(process.cwd(), "database/tesztadatok.sql"),
                            path.resolve(process.cwd(), "tesztadatok.sql")
                        ];
                        const seedFile = seedCandidates.find(f => fs.existsSync(f));
                        if (seedFile) {
                            const seedSql = fs.readFileSync(seedFile, "utf8");
                            db.exec(seedSql, (seedErr) => {
                                if (!seedErr) {
                                    console.log("Alapértelmezett tesztadatok sikeresen betöltve.");
                                }
                            });
                        }
                    }
                });
            }
        });
    }
});

// token ellenőrzése middleware-rel (forma: Bearer token)
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.status(401).send({ message: "Azonosítás szükséges!" });
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err)
            return res.status(403).send({ message: "Nincs jogosultsága!" });
        req.user = user;
        next();
    });
}

app.route("/users")
    // adminok listája (védett, a jelszavakat nem küldjük el)
    .get(authenticateToken, function (req, res) {
        const q = "SELECT id, felhasznalonev FROM admin";
        db.all(q, function (error, results) {
            if (!error) {
                res.send(results);
            } else {
                res.status(500).send({ message: error.message });
            }
        });
    })
    // új admin regisztrációja (védett, csak bejelentkezett admin regisztrálhat)
    .post(authenticateToken, function (req, res) {
        const felhasznalonev = (req.body.felhasznalonev || "").trim();
        const jelszo = req.body.jelszo || "";
        if (felhasznalonev == "" || jelszo == "")
            return res.status(400).send({ message: "A felhasználónév és a jelszó megadása kötelező!" });
        if (jelszo.length < 6)
            return res.status(400).send({ message: "A jelszó legalább 6 karakter legyen!" });

        const q = "SELECT * FROM admin WHERE felhasznalonev = ?";
        db.get(q, [felhasznalonev], function (error, user) {
            if (error)
                return res.status(500).send({ message: error.message });
            if (user)
                return res.status(400).send({ message: "Már létezik ilyen nevű felhasználó!" });

            const hash = bcrypt.hashSync(jelszo, 10);
            const q2 = "INSERT INTO admin (felhasznalonev, jelszo) VALUES (?, ?)";
            db.run(q2, [felhasznalonev, hash], function (error) {
                if (!error) {
                    res.send({ message: "Felhasználó létrehozva." });
                } else {
                    res.status(500).send({ message: error.message });
                }
            });
        });
    });

// bejelentkezés
app.post("/users/login", function (req, res) {
    const felhasznalonev = (req.body.felhasznalonev || "").trim();
    const jelszo = req.body.jelszo || "";
    const q = "SELECT * FROM admin WHERE felhasznalonev = ?";
    db.get(q, [felhasznalonev], function (error, user) {
        if (error)
            return res.status(500).send({ message: error.message });
        if (!user)
            return res.status(401).send({ message: "Hibás felhasználónév vagy jelszó!" });
        if (!bcrypt.compareSync(jelszo, user.jelszo))
            return res.status(401).send({ message: "Hibás felhasználónév vagy jelszó!" });

        const token = jwt.sign(
            { id: user.id, felhasznalonev: user.felhasznalonev },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 });
        res.send({ token: token, message: "Sikeres bejelentkezés." });
    });
});

// az űrlap értékei -> az adatbázisban tárolt értékek
const FIZETESI_MODOK = { atutalas: 'Átutalás', keszpenz: 'Készpénz' };
const STATUSZOK = { fuggo: 'Függőben', elfogadva: 'Elfogadva', elutasitva: 'Elutasítva', lemondva: 'Lemondva' };
const FIZETESI_STATUSZOK = { nincs: 'Nincs fizetve', var: 'Fizetésre vár', fizetve: 'Fizetve' };
const DATUM_MINTA = /^\d{4}-\d{2}-\d{2}$/;

app.route("/api/bookings")
    // ?status=elfogadva: a foglalt időszakok a naptárhoz, egyébként az összes foglalás az admin oldalhoz
    .get(function (req, res) {
        let q = "SELECT erkezes, tavozas FROM foglalasok WHERE statusz = 'Elfogadva' ORDER BY erkezes";
        if (req.query.status != "elfogadva") {
            q = `SELECT id, nev, email, telefon, erkezes, tavozas, vendegek_szama AS vendegek,
                    fizetesi_mod, teljes_ar AS osszeg, letrehozva,
                    CASE statusz WHEN 'Függőben' THEN 'fuggo' WHEN 'Elfogadva' THEN 'elfogadva'
                        WHEN 'Elutasítva' THEN 'elutasitva' ELSE 'lemondva' END AS statusz,
                    CASE fizetesi_statusz WHEN 'Nincs fizetve' THEN 'nincs' WHEN 'Fizetésre vár' THEN 'var'
                        ELSE 'fizetve' END AS fizetes
                FROM foglalasok ORDER BY letrehozva DESC`;
        }
        db.all(q, function (error, results) {
            if (!error) {
                res.send(results);
            } else {
                res.status(500).send({ message: error.message });
            }
        });
    })
    // új foglalási kérelem (nyilvános, a státusz mindig 'Függőben' lesz)
    .post(function (req, res) {
        const nev = (req.body.nev || "").trim();
        const email = (req.body.email || "").trim();
        const telefon = (req.body.telefon || "").trim();
        const erkezes = req.body.erkezes || "";
        const tavozas = req.body.tavozas || "";
        const vendegek = parseInt(req.body.vendegek);
        const fizetesiMod = FIZETESI_MODOK[req.body.fizetesiMod];
        const osszeg = parseInt(req.body.osszeg);

        if (nev == "" || email == "" || telefon == "")
            return res.status(400).send({ message: "A név, az e-mail-cím és a telefonszám megadása kötelező!" });
        if (!DATUM_MINTA.test(erkezes) || !DATUM_MINTA.test(tavozas) || erkezes >= tavozas)
            return res.status(400).send({ message: "A távozás dátumának későbbinek kell lennie az érkezésnél!" });
        if (!(vendegek >= 1))
            return res.status(400).send({ message: "A vendégek száma legalább 1 legyen!" });
        if (!fizetesiMod)
            return res.status(400).send({ message: "Érvénytelen fizetési mód!" });
        if (!(osszeg > 0))
            return res.status(400).send({ message: "Érvénytelen összeg!" });

        // ütközés elfogadott foglalással
        const q = "SELECT COUNT(*) AS utkozes FROM foglalasok WHERE statusz = 'Elfogadva' AND erkezes < ? AND tavozas > ?";
        db.get(q, [tavozas, erkezes], function (error, row) {
            if (error)
                return res.status(500).send({ message: error.message });
            if (row.utkozes > 0)
                return res.status(409).send({ message: "A választott időszak már foglalt." });

            const q2 = "INSERT INTO foglalasok (nev, email, telefon, erkezes, tavozas, vendegek_szama, fizetesi_mod, teljes_ar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            db.run(q2, [nev, email, telefon, erkezes, tavozas, vendegek, fizetesiMod, osszeg], function (error) {
                if (!error) {
                    res.status(201).send({ id: this.lastID, message: "Foglalási kérelem rögzítve." });
                } else {
                    res.status(500).send({ message: error.message });
                }
            });
        });
    });

// foglalás státuszának módosítása (elfogadás, elutasítás, lemondás)
app.patch("/api/bookings/:id/status", function (req, res) {
    const statusz = STATUSZOK[req.body.statusz];
    if (!statusz)
        return res.status(400).send({ message: "Érvénytelen státusz!" });
    const q = "UPDATE foglalasok SET statusz = ? WHERE id = ?";
    db.run(q, [statusz, req.params.id], function (error) {
        if (error)
            return res.status(500).send({ message: error.message });
        if (this.changes == 0)
            return res.status(404).send({ message: "Nincs ilyen foglalás!" });
        res.send({ message: "Státusz módosítva." });
    });
});

// fizetési státusz módosítása
app.patch("/api/bookings/:id/payment", function (req, res) {
    const fizetes = FIZETESI_STATUSZOK[req.body.fizetes];
    if (!fizetes)
        return res.status(400).send({ message: "Érvénytelen fizetési státusz!" });
    const q = "UPDATE foglalasok SET fizetesi_statusz = ? WHERE id = ?";
    db.run(q, [fizetes, req.params.id], function (error) {
        if (error)
            return res.status(500).send({ message: error.message });
        if (this.changes == 0)
            return res.status(404).send({ message: "Nincs ilyen foglalás!" });
        res.send({ message: "Fizetési státusz módosítva." });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`Szerver elindítva: http://localhost:${port}`);
    console.log(`Admin felület: http://localhost:${port}/admin`);
}); 
