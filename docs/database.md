# A `nyaralo.db` adatbázis

A `nyaralo.db` egy **SQLite 3** adatbázisfájl a `database/` mappában. Ebben
tárolódnak a foglalások és az adminisztrátorok. Külön adatbázisszervert nem
kell telepíteni, az egész adatbázis ez az egy fájl.

| | |
|---|---|
| Adatbázis-kezelő | SQLite 3 |
| Fájl | `database/nyaralo.db` |
| Séma | [database.sql](../database/database.sql) |
| Tesztadatok | [tesztadatok.sql](../database/tesztadatok.sql) |
| Táblák | `foglalasok`, `admin` |

A `nyaralo.db` szerepel a `.gitignore`-ban, ezért **nincs fent a repóban**.
Klónozás után mindenkinek magának kell létrehoznia
(lásd [3. fejezet](#3-az-adatbázis-létrehozása)).

## 1. Táblák

Az adatbázis két táblából áll. A két tábla között nincs kapcsolat (nincs
idegen kulcs).

### 1.1. `foglalasok`

Egy sor egy foglalási kérelmet jelent. Minden oszlop kötelező (`NOT NULL`).

| Oszlop | Típus | Alapérték | Leírás |
|---|---|---|---|
| `id` | INTEGER | automatikus | Elsődleges kulcs (`AUTOINCREMENT`) |
| `nev` | TEXT | – | A vendég neve |
| `email` | TEXT | – | A vendég e-mail-címe |
| `telefon` | TEXT | – | A vendég telefonszáma |
| `erkezes` | TEXT | – | Érkezés dátuma, `ÉÉÉÉ-HH-NN` formátumban |
| `tavozas` | TEXT | – | Távozás dátuma, `ÉÉÉÉ-HH-NN` formátumban |
| `vendegek_szama` | INTEGER | – | Vendégek száma, legalább 1 |
| `fizetesi_mod` | TEXT | – | `Átutalás` vagy `Készpénz` |
| `teljes_ar` | INTEGER | – | A teljes fizetendő összeg forintban |
| `statusz` | TEXT | `Függőben` | A foglalás állapota (lásd lent) |
| `fizetesi_statusz` | TEXT | `Nincs fizetve` | A fizetés állapota (lásd lent) |
| `letrehozva` | TEXT | aktuális helyi idő | Létrehozás időpontja, `ÉÉÉÉ-HH-NN ÓÓ:PP:MM` |

Táblaszintű megkötés: `CHECK (erkezes < tavozas)` – az érkezésnek korábbinak
kell lennie a távozásnál.

**`statusz` értékei**

| Érték | Jelentés |
|---|---|
| `Függőben` | A vendég elküldte a kérelmet, az admin még nem döntött. |
| `Elfogadva` | Az admin elfogadta. Az időszak foglalttá válik. |
| `Elutasítva` | Az admin elutasította. Az időszak foglalható marad. |
| `Lemondva` | Az admin lemondta a korábban elfogadott foglalást. Az időszak újra foglalható. |

Csak az `Elfogadva` állapotú foglalás foglalja le a dátumokat.

**`fizetesi_statusz` értékei:** `Nincs fizetve`, `Fizetésre vár`, `Fizetve`.

### 1.2. `admin`

Az adminisztrációs felületre belépő felhasználók.

| Oszlop | Típus | Leírás |
|---|---|---|
| `id` | INTEGER | Elsődleges kulcs (`AUTOINCREMENT`) |
| `felhasznalonev` | TEXT | Egyedi (`UNIQUE`), kötelező |
| `jelszo` | TEXT | A jelszó **bcrypt hash-e** (10 kör), kötelező |

A jelszó soha nem kerül sima szövegként az adatbázisba. Ha kézzel szúrsz be
admint, a hash-t előbb elő kell állítani (`bcrypt.hashSync(jelszo, 10)`).

### 1.3. `sqlite_sequence`

Ezt a táblát az SQLite hozza létre magától az `AUTOINCREMENT` miatt. Itt
tartja nyilván, hol tart az `id` számláló a két táblában. Kézzel nem kell
hozzányúlni.

## 2. Tudnivalók a sémáról

- **A dátumok szövegként (TEXT) vannak tárolva**, mert az SQLite-ban nincs
  külön dátum típus. Az `ÉÉÉÉ-HH-NN` formátum miatt a szöveges összehasonlítás
  megegyezik az időrendivel, ezért működik a `CHECK (erkezes < tavozas)` és az
  ütközésvizsgálat. Más formátumú dátum (pl. `2026.10.09.`) ezt elrontaná.
- **A megengedett értékeket `CHECK` megkötések őrzik.** Az egyezés pontos:
  ékezet és kis-/nagybetű is számít (`Készpénz` jó, `keszpenz` hibát ad).
- **Amit az adatbázis nem ellenőriz**, azt az alkalmazásnak kell:
  - ütközik-e az időszak egy már elfogadott foglalással,
  - megvan-e a minimum foglalható éjszakák száma,
  - nem több-e a vendég, mint a férőhely,
  - helyes-e a `teljes_ar` (éjszakák száma × éjszakánkénti ár).

## 3. Az adatbázis létrehozása

> **Tipp:** A backend szerver indításakor (`npm start`) automatikusan létrehozza a táblákat és betölti az alapértelmezett tesztadatokat, amennyiben az adatbázis még nem létezik. Manuális újrainicializáláshoz az `npm run init-db` parancs is használható.

`npm install` után, a projekt gyökerében:

**1. Táblák létrehozása**

```
node -e "const fs=require('fs');const s=require('sqlite3');new s.Database('database/nyaralo.db').exec(fs.readFileSync('database/database.sql','utf8'))"
```

**2. Tesztadatok betöltése** (nem kötelező)

```
node -e "const fs=require('fs');const s=require('sqlite3');new s.Database('database/nyaralo.db').exec(fs.readFileSync('database/tesztadatok.sql','utf8'))"
```

A parancsok PowerShellben és Git Bashben is működnek. Ha telepítve van az
`sqlite3` parancssori program, azzal is megy:

```
sqlite3 database/nyaralo.db ".read database/database.sql"
sqlite3 database/nyaralo.db ".read database/tesztadatok.sql"
```

A `database.sql` újra lefuttatható (`CREATE TABLE IF NOT EXISTS`), a meglévő
adatokat nem bántja.

## 4. Tesztadatok

> **Figyelem:** a `tesztadatok.sql` először **töröl minden sort** mindkét
> táblából, és nullázza az azonosítókat. Éles adatokon ne futtasd.

**Admin:** felhasználónév `admin`, jelszó `admin123`.

**Foglalások** – mind a négy státuszra van példa, 25 000 Ft/éj árral számolva:

| id | Vendég | Érkezés | Távozás | Fő | Fizetési mód | Ár (Ft) | Státusz | Fizetés |
|---|---|---|---|---|---|---|---|---|
| 1 | Kovács Anna | 2026-10-09 | 2026-10-12 | 4 | Átutalás | 75 000 | Elfogadva | Fizetve |
| 2 | Nagy Péter | 2026-10-16 | 2026-10-18 | 2 | Készpénz | 50 000 | Elfogadva | Fizetésre vár |
| 3 | Szabó Eszter | 2026-10-23 | 2026-10-27 | 5 | Átutalás | 100 000 | Függőben | Nincs fizetve |
| 4 | Tóth Gábor | 2026-10-24 | 2026-10-26 | 3 | Készpénz | 50 000 | Függőben | Nincs fizetve |
| 5 | Horváth Júlia | 2026-11-06 | 2026-11-09 | 6 | Átutalás | 75 000 | Elutasítva | Nincs fizetve |
| 6 | Varga Dániel | 2026-11-13 | 2026-11-15 | 2 | Átutalás | 50 000 | Lemondva | Nincs fizetve |

A 3-as és 4-es foglalás átfedi egymást: két függőben lévő kérelem ugyanarra
az időszakra, amelyek közül csak az egyik fogadható el.

## 5. Hasznos lekérdezések

Foglalt időszakok a naptárhoz:

```sql
SELECT erkezes, tavozas
FROM foglalasok
WHERE statusz = 'Elfogadva'
ORDER BY erkezes;
```

Ütközik-e egy új foglalás egy elfogadottal (paraméterek: új távozás, új
érkezés). A távozás napjára érkezhet új vendég, ezért szigorú az
egyenlőtlenség:

```sql
SELECT COUNT(*) AS utkozes
FROM foglalasok
WHERE statusz = 'Elfogadva'
  AND erkezes < ?
  AND tavozas > ?;
```

Foglalás elfogadása és a fizetési státusz módosítása:

```sql
UPDATE foglalasok SET statusz = 'Elfogadva' WHERE id = ?;
UPDATE foglalasok SET fizetesi_statusz = 'Fizetve' WHERE id = ?;
```

Függőben lévő kérelmek, a legrégebbi elöl:

```sql
SELECT * FROM foglalasok
WHERE statusz = 'Függőben'
ORDER BY letrehozva;
```
