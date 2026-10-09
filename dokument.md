# Nyaraló Foglalási Rendszer – Backend dokumentáció

## 1. A backend feladata

A nyaraló foglalási rendszer backendje biztosítja a kapcsolatot a felhasználói felület és az adatbázis között. Feladata a foglalási kérelmek fogadása, ellenőrzése és tárolása, a foglalások állapotának kezelése, valamint az adminisztrátori feladatok kiszolgálása.

A rendszer lehetővé teszi, hogy a látogatók regisztráció nélkül foglalási kérelmet küldjenek be. Az adminisztrátor megtekintheti a beérkezett kérelmeket, elfogadhatja vagy elutasíthatja azokat, továbbá módosíthatja a foglalások és a fizetések állapotát.

A backend a következő technológiákat használja:

* **Node.js:** JavaScript-kód futtatása szerveroldalon.
* **Express.js:** HTTP-kérések kezelése és API-végpontok létrehozása.
* **SQLite:** Az adatok tárolására szolgáló adatbázis.
* **bcrypt:** Jelszavak biztonságos hash-elése és ellenőrzése.
* **JSON Web Token (JWT):** Felhasználói azonosításra szolgáló tokenek létrehozása és ellenőrzése.
* **CORS:** A különböző eredetű webes kérések szabályozása.
* **dotenv:** Környezeti változók betöltése a `.env` fájlból.

## 2. A backend felépítése

A szerver fő fájlja a `server.js`. Ez felel az alkalmazás elindításáért, az adatbázis-kapcsolat létrehozásáért és az API-végpontok működtetéséért.

A frontendhez kapcsolódó JavaScript-fájlok:

* `js/booking.js`: A foglalási űrlap kezelése és az adatok elküldése.
* `js/calendar.js`: A foglalt időszakok lekérése és a naptár megjelenítése.
* `js/admin.js`: Az adminisztrátori foglaláslista, valamint a státuszok és fizetések módosítása.

A frontend a `fetch()` függvény segítségével küld HTTP-kéréseket a backendnek. A szerver az adatbázisban végrehajtja a szükséges műveleteket, majd JSON-formátumban választ küld.

## 3. A szerver inicializálása

A backend az Express keretrendszer példányosításával indul:

`const express = require("express");`

Az `express.json()` middleware lehetővé teszi a JSON-formátumú kérésadatok feldolgozását. A `cors()` middleware engedélyezi a CORS-szabályok szerinti kéréseket.

Az adatbázis-kapcsolat az SQLite segítségével jön létre. Az adatbázis elérési útját a `DATABASE` környezeti változó határozza meg.

A szerver alapértelmezett portja 3000, de ezt a `PORT` környezeti változóval módosítani lehet.

## 4. Adatbázis-kezelés

A rendszer az SQLite-adatbázisban tárolja a foglalások és az adminisztrátori felhasználók adatait.

### 4.1. Foglalások táblája

A `foglalasok` tábla a foglalási kérelmek adatait tartalmazza.

A fontosabb mezők:

* `id`: A foglalás egyedi azonosítója.
* `nev`: A vendég neve.
* `email`: A vendég e-mail-címe.
* `telefon`: A vendég telefonszáma.
* `erkezes`: Az érkezés dátuma.
* `tavozas`: A távozás dátuma.
* `vendegek_szama`: A vendégek száma.
* `fizetesi_mod`: A választott fizetési mód.
* `teljes_ar`: A foglalás teljes ára.
* `statusz`: A foglalás aktuális állapota.
* `fizetesi_statusz`: A fizetés aktuális állapota.
* `letrehozva`: A foglalás létrehozásának időpontja.

A státuszok és a fizetési állapotok szöveges formában kerülnek tárolásra. A backend ezekből rövid, frontend által használt kódokat állít elő.

### 4.2. Adminisztrátorok táblája

Az `admin` tábla tárolja az adminisztrátori fiókok adatait.

A fontosabb mezők:

* `id`: Egyedi azonosító.
* `felhasznalonev`: A felhasználónév.
* `jelszo`: A jelszó hash-elt változata.

A jelszavakat a rendszer a bcrypt segítségével hash-eli, és bejelentkezéskor a `bcrypt.compareSync()` függvénnyel ellenőrzi.

## 5. API-végpontok

Az API-végpontok biztosítják a kommunikációt a frontend és a backend között.

| HTTP-metódus | Végpont                          | Funkció                          |
| ------------ | -------------------------------- | -------------------------------- |
| GET          | `/api/bookings`                  | Foglalások listázása             |
| GET          | `/api/bookings?status=elfogadva` | Elfogadott foglalások lekérése   |
| POST         | `/api/bookings`                  | Új foglalási kérelem létrehozása |
| PATCH        | `/api/bookings/:id/status`       | Foglalás státuszának módosítása  |
| PATCH        | `/api/bookings/:id/payment`      | Fizetési státusz módosítása      |
| POST         | `/users/login`                   | Adminisztrátori bejelentkezés    |
| GET          | `/users`                         | Adminisztrátorok listázása       |
| POST         | `/users`                         | Új adminisztrátor létrehozása    |

A `/users` végpontokhoz JWT-alapú azonosítás szükséges. A foglalási végpontok a bemutatott kódban nyilvánosan elérhetők.

## 6. Foglalások lekérése

A `GET /api/bookings` végpont alapértelmezés szerint az összes foglalást visszaadja az adminisztrátori felület számára.

A válasz tartalmazza többek között a vendég adatait, a foglalás időszakát, a vendégek számát, a teljes árat, a foglalás állapotát és a fizetés állapotát.

Ha a kérésben szerepel a `status=elfogadva` paraméter, a backend kizárólag az elfogadott foglalások érkezési és távozási dátumát adja vissza. Ezt a naptár használja a foglalt időszakok megjelenítésére.

## 7. Új foglalás létrehozása

Az új foglalási kérelem a `POST /api/bookings` végpontra érkezik.

A backend a következő ellenőrzéseket végzi el:

1. A név, az e-mail-cím és a telefonszám megadása kötelező.
2. A dátumoknak megfelelő formátumúnak kell lenniük.
3. A távozás dátumának későbbinek kell lennie az érkezés dátumánál.
4. A vendégek száma legalább egy legyen.
5. A fizetési módnak érvényesnek kell lennie.
6. A teljes árnak pozitívnak kell lennie.
7. A rendszer ellenőrzi, hogy az időszak ütközik-e már elfogadott foglalással.

Az időszakok ütközésének ellenőrzése SQL-lekérdezéssel történik. A feltétel azt vizsgálja, hogy létezik-e olyan elfogadott foglalás, amelynek időszaka átfedésben van az új kérelemmel.

Ha az ellenőrzés sikeres, a foglalás bekerül az adatbázisba. Az új foglalás alapértelmezett státusza „Függőben”, a fizetési státusza pedig „Nincs fizetve”.

Sikeres létrehozás esetén a szerver 201-es HTTP-státuszkóddal válaszol.

## 8. Foglalási státuszok kezelése

A foglalások állapotát az adminisztrátor módosíthatja a `PATCH /api/bookings/:id/status` végponton keresztül.

A lehetséges állapotok:

* `fuggo`: Függőben.
* `elfogadva`: Elfogadva.
* `elutasitva`: Elutasítva.
* `lemondva`: Lemondva.

A backend a rövid státuszkódokat a megfelelő adatbázisbeli értékekre alakítja, majd frissíti a foglalás rekordját.

Ha a megadott státusz érvénytelen, a szerver 400-as hibakódot küld. Ha a megadott azonosítóhoz nem tartozik foglalás, 404-es válasz érkezik.

## 9. Fizetési státuszok kezelése

A fizetési státusz módosítása a `PATCH /api/bookings/:id/payment` végponton keresztül történik.

A rendszer három fizetési állapotot kezel:

* `nincs`: Nincs fizetve.
* `var`: Fizetésre vár.
* `fizetve`: Fizetve.

Az adminisztrátor az adminisztrációs felületen kiválasztja a kívánt állapotot. A frontend elküldi a módosítást, a backend pedig frissíti az adatbázisban a `fizetesi_statusz` mezőt.

## 10. Adminisztrátori bejelentkezés és jogosultságkezelés

A bejelentkezés a `POST /users/login` végponton keresztül történik.

A backend megkeresi a felhasználót az adatbázisban, majd összehasonlítja a megadott jelszót az eltárolt hash-sel.

Sikeres bejelentkezés esetén a rendszer JWT-tokent állít elő, amely tartalmazza az adminisztrátor azonosítóját és felhasználónevét. A token érvényességi ideje egy óra.

Az `authenticateToken` middleware ellenőrzi az `Authorization` fejlécben megadott Bearer tokent. Ha a token hiányzik vagy érvénytelen, a kérés nem folytatódik.

A bemutatott kódban a JWT-védelem a felhasználókezelési végpontokon szerepel. A foglalások módosítására szolgáló végpontokat is védeni kell, hogy illetéktelen felhasználók ne módosíthassák a foglalásokat vagy a fizetési állapotokat.

## 11. Hibakezelés

A backend HTTP-státuszkódokkal és JSON-formátumú üzenetekkel jelzi a műveletek eredményét.

A fontosabb státuszkódok:

* `200 OK`: Sikeres lekérdezés vagy módosítás.
* `201 Created`: A foglalás sikeresen létrejött.
* `400 Bad Request`: Hibás vagy hiányos adatok.
* `401 Unauthorized`: Hiányzó azonosítás.
* `403 Forbidden`: Érvénytelen token vagy elégtelen jogosultság.
* `404 Not Found`: Nem létező foglalás.
* `409 Conflict`: A kiválasztott időszak már foglalt.
* `500 Internal Server Error`: Szerver- vagy adatbázishiba.

A frontend a válasz alapján visszajelzést jelenít meg a felhasználónak.

## 12. A frontend és a backend kapcsolata

A frontend a `fetch()` függvénnyel kommunikál a szerverrel.

A `booking.js` elküldi az új foglalás adatait, és kiszámítja a foglalás becsült árát. A `calendar.js` lekéri az elfogadott foglalásokat, és ezek alapján jeleníti meg a foglalt napokat. Az `admin.js` betölti a foglalásokat, megjeleníti az adatokat, és elküldi az adminisztrátor által végzett módosításokat.

A frontend és a backend közötti kommunikáció JSON-adatok segítségével történik.

## 13. Környezeti változók és futtatás

A backend működéséhez szükséges környezeti változókat a `.env` fájlban lehet megadni.

Példa:

* `PORT=3000`
* `DATABASE=./nyaralo.db`
* `TOKEN_SECRET=egy_hosszu_veletlen_titkos_kulcs`

A fenti értékek csak példák. A `DATABASE` értékét a tényleges adatbázis elérési útjára kell beállítani, a `TOKEN_SECRET` értékének pedig erős, titkos kulcsnak kell lennie.

A szükséges csomagok telepítése:

`npm install`

A szerver elindítása:

`npm start`

Sikeres indítás esetén a konzol jelzi, hogy melyik porton fut a szerver.

## 14. Összegzés

A backend a nyaraló foglalási rendszer központi része. Feladata az adatok fogadása, ellenőrzése, adatbázisban történő tárolása és a foglalási folyamat kezelése.

Az Express biztosítja az API-végpontokat, az SQLite tárolja az adatokat, a bcrypt kezeli a jelszavak hash-elését, a JWT pedig az adminisztrátori azonosításban játszik szerepet.

A rendszer kialakítása lehetővé teszi a foglalási kérelmek kezelését és a naptár frissítését. Éles használat előtt szükséges a foglaláskezelő végpontok jogosultságvédelme, valamint a dátumok, a vendégszám és a teljes ár szerveroldali ellenőrzésének teljes körű biztosítása.
