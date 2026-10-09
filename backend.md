# Nyaraló Foglalási Rendszer – Backend dokumentáció

## 1. A backend bemutatása

A nyaraló foglalási rendszer backendje a szerveroldali működésért felelős. Feladata a foglalási kérelmek kezelése, az adatok ellenőrzése, a foglalások állapotának módosítása, valamint az adminisztrátori bejelentkezés biztosítása.

A backend Node.js környezetben, az Express.js keretrendszer segítségével készült. A rendszer különböző API-végpontokon keresztül fogadja és dolgozza fel a HTTP-kéréseket.

## 2. Felhasznált technológiák

A backend fejlesztése során a következő technológiákat és csomagokat használjuk:

Node.js: A JavaScript-kód szerveroldali futtatókörnyezete.
Express.js: A HTTP-szerver és az API-végpontok létrehozására használt keretrendszer.
sqlite3: Node.js-csomag, amely lehetővé teszi az SQLite használatát a backendben.
bcrypt: A jelszavak biztonságos hash-elésére és a bejelentkezés során történő ellenőrzésére szolgál.
jsonwebtoken (JWT): A hitelesítési tokenek létrehozását és ellenőrzését biztosítja.
cors: Lehetővé teszi a megfelelő, különböző eredetű címekről érkező kérések kezelését.
dotenv: A környezeti változók betöltésére szolgál, például a konfigurációs adatok kezeléséhez.

## 3. A szerver felépítése

A backend központi fájlja a `server.js`, amely tartalmazza a szerver inicializálását, a különböző végpontokat, a foglalások kezelését és a bejelentkezési folyamatot.

A szerver az Express keretrendszer segítségével indul el. Az `express.json()` middleware lehetővé teszi a JSON-formátumú kérések adatainak feldolgozását. A `cors()` middleware pedig a CORS-beállítások szerinti kéréseket engedélyezi.

A szerver alapértelmezett portja 3000, amelyet a `PORT` környezeti változóval lehet módosítani.

## 4. API-végpontok

A backend API-végpontokon keresztül biztosítja a különböző műveletek végrehajtását.

| HTTP-metódus | Végpont                          | Funkció                           |
| ------------ | -------------------------------- | --------------------------------- |
| GET          | `/api/bookings`                  | A foglalások lekérése             |
| GET          | `/api/bookings?status=elfogadva` | Az elfogadott foglalások lekérése |
| POST         | `/api/bookings`                  | Új foglalási kérelem létrehozása  |
| PATCH        | `/api/bookings/:id/status`       | A foglalás állapotának módosítása |
| PATCH        | `/api/bookings/:id/payment`      | A fizetési állapot módosítása     |
| POST         | `/users/login`                   | Adminisztrátori bejelentkezés     |
| GET          | `/users`                         | Adminisztrátorok listázása        |
| POST         | `/users`                         | Új adminisztrátor létrehozása     |

A `:id` az adott foglalás egyedi azonosítóját jelöli.

## 5. Foglalási kérelmek kezelése

Az új foglalási kérelem a `POST /api/bookings` végpontra érkezik.

A szerver feldolgozza a vendég nevét, e-mail-címét, telefonszámát, az érkezés és távozás dátumát, a vendégek számát, a fizetési módot és a teljes árat.

A foglalás rögzítése előtt ellenőrzi a megadott adatokat.

A fontosabb ellenőrzések:

* A név, az e-mail-cím és a telefonszám megadása kötelező.
* A dátumoknak megfelelő formátumúnak kell lenniük.
* A távozás dátumának későbbinek kell lennie az érkezés dátumánál.
* A vendégek számának legalább egynek kell lennie.
* A fizetési módnak érvényesnek kell lennie.
* A teljes árnak pozitív értéknek kell lennie.

A rendszer azt is ellenőrzi, hogy a kiválasztott időszak ütközik-e már elfogadott foglalással. Ha átfedést talál, a szerver `409 Conflict` státuszkóddal visszautasítja a kérelmet.

Sikeres ellenőrzés esetén a foglalási kérelem rögzítésre kerül. Az új foglalás alapértelmezett állapota „Függőben”, fizetési állapota pedig „Nincs fizetve”.

## 6. Foglalási státuszok módosítása

A foglalások állapotának módosítása a `PATCH /api/bookings/:id/status` végponton történik.

A rendszer négyféle foglalási státuszt kezel:

* `fuggo`: Függőben.
* `elfogadva`: Elfogadva.
* `elutasitva`: Elutasítva.
* `lemondva`: Lemondva.

A szerver ellenőrzi a megadott státuszt, majd végrehajtja a módosítást. Ha a státusz nem érvényes, 400-as HTTP-státuszkódot küld. Ha a foglalás nem található, 404-es választ ad.

## 7. Fizetési státuszok kezelése

A fizetési állapot módosítása a `PATCH /api/bookings/:id/payment` végponton keresztül történik.

A lehetséges fizetési állapotok:

* `nincs`: Nincs fizetve.
* `var`: Fizetésre vár.
* `fizetve`: Fizetve.

A szerver ellenőrzi a megadott értéket, majd módosítja a foglaláshoz tartozó fizetési állapotot.

Érvénytelen fizetési státusz esetén 400-as, nem létező foglalás esetén 404-es HTTP-státuszkódot küld.

## 8. Adminisztrátori bejelentkezés

Az adminisztrátori bejelentkezés a `POST /users/login` végponton keresztül történik.

A szerver megkeresi a megadott felhasználónevet, majd ellenőrzi a jelszót a bcrypt segítségével.

Ha a felhasználónév vagy a jelszó hibás, a rendszer `401 Unauthorized` választ küld.

Sikeres bejelentkezés esetén a szerver JWT-tokent hoz létre. A token tartalmazza az adminisztrátor azonosítóját és felhasználónevét. A token érvényességi ideje egy óra.

## 9. JWT-alapú azonosítás

A JWT-alapú azonosítás célja, hogy a rendszer ellenőrizni tudja, melyik adminisztrátor küld egy védett kérést.

Az `authenticateToken` middleware ellenőrzi a kérés `Authorization` fejlécében található Bearer tokent.

A folyamat lépései:

1. A szerver megvizsgálja, hogy a kérés tartalmaz-e tokent.
2. Kiolvassa és ellenőrzi a tokent.
3. Érvényes token esetén engedélyezi a kérés folytatását.
4. Hiányzó token esetén 401-es, érvénytelen token esetén 403-as választ küld.

A jelenlegi kódban az adminisztrátorok listázása és új adminisztrátor létrehozása védett végpont. A foglalások módosítására szolgáló végpontok jogosultságvédelmét is szükséges megvalósítani.

## 10. Hibakezelés

A backend HTTP-státuszkódokkal jelzi a kérések eredményét.

| Státuszkód | Jelentés                                                    |
| ---------- | ----------------------------------------------------------- |
| 200        | A művelet sikeresen végrehajtódott.                         |
| 201        | A foglalási kérelem sikeresen létrejött.                    |
| 400        | Hibás vagy érvénytelen adatok érkeztek.                     |
| 401        | Azonosítás szükséges, vagy hibásak a bejelentkezési adatok. |
| 403        | Érvénytelen token vagy hiányzó jogosultság.                 |
| 404        | A keresett foglalás nem található.                          |
| 409        | A kiválasztott időszak már foglalt.                         |
| 500        | Szerveroldali hiba történt.                                 |

A szerver a hibákhoz JSON-formátumú üzenetet küld vissza, amely segít a probléma azonosításában.

## 11. Környezeti változók és a szerver indítása

A rendszer a `.env` fájl segítségével kezeli a környezeti változókat.

Például a `PORT` változó határozza meg, hogy a szerver melyik porton fusson, a `TOKEN_SECRET` pedig a JWT-tokenek aláírásához használt titkos kulcsot tartalmazza.

Példa a `.env` fájlra:

`PORT=3000`

`TOKEN_SECRET=egy_hosszu_veletlen_titkos_kulcs`

A tényleges használat során a `TOKEN_SECRET` értékét erős, titkos kulcsra kell cserélni.

A szükséges csomagok telepítése:

`npm install`

A szerver indítása:

`npm start`

Sikeres indítás esetén a konzol jelzi, hogy a szerver elindult a beállított porton.

## 12. Összegzés

A nyaraló foglalási rendszer backendje biztosítja a foglalási kérelmek kezelését, a státuszok módosítását és az adminisztrátori bejelentkezést.

A Node.js és az Express.js felel a szerver működéséért, a bcrypt a jelszavak ellenőrzéséért, a JWT pedig az azonosításért.

A backend ellenőrzi a foglalási adatok helyességét, kezeli a hibás kéréseket, és megfelelő válaszokat küld a különböző műveletek eredményéről.
