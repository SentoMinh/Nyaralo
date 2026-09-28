# Szállásfoglalási platform

Reszponzív, többnyelvű szállásfoglalási webalkalmazás az Európai Unió piacára. A platform összekapcsolja a bérlőket és a szállásadókat, és támogatja a szálláskeresést, az online foglalást, a fizetést, az értékeléseket és az adminisztrációt.

> **Projektállapot:** Specifikációs / tervezési fázis
> **Dokumentumverzió:** 1.0
> **Utolsó frissítés:** 2026-09-28

---

## Tartalomjegyzék

* [Főbb funkciók](#főbb-funkciók)
* [Felhasználói szerepkörök](#felhasználói-szerepkörök)
* [Foglalási és fizetési folyamat](#foglalási-és-fizetési-folyamat)
* [Technológiai stack](#technológiai-stack)
* [Tervezett modulok](#tervezett-modulok)
* [Üzemeltetés és biztonság](#üzemeltetés-és-biztonság)
* [Nyitott döntések](#nyitott-döntések)
* [Fejlesztési állapot](#fejlesztési-állapot)

---

## Főbb funkciók

* **Szálláskeresés:** keresés hely, dátum, vendégszám, ár, szobák, fürdőszobák, szállástípus, felszereltség és értékelés alapján.
* **Térképes keresés:** keresés hely és maximális távolság alapján, illetve térképen kijelölt területen.
* **Hirdetéskezelés:** teljes apartmanok és külön szobák létrehozása, szerkesztése, szüneteltetése és újraaktiválása.
* **Rugalmas árazás:** külön HUF- és EUR-árak, kedvezmények, takarítási és egyéb díjak.
* **Többegységes foglalás:** egy foglaláson belül több egység is kiválasztható ugyanazon szálláshelyen; a vendégszám egységenként adható meg.
* **Online fizetés:** teljes összeg előre fizetendő, sikeres fizetés után automatikus foglalásmegerősítéssel.
* **Lemondás és visszatérítés:** a meghatározott feltételek szerinti automatikus teljes visszatérítés.
* **Belső üzenetküldés:** kommunikáció a bérlő és a szállásadó között sikeres foglalás után.
* **Értékelések:** értékelést csak teljesült foglalással rendelkező bérlő írhat.
* **Kedvencek:** szálláshelyek mentése későbbi megtekintéshez.
* **Értesítések:** e-mailes értesítés többek között a foglalásról, fizetésről, lemondásról és új üzenetről.
* **Adminisztráció:** felhasználók, hirdetések, foglalások, panaszok és sikertelen fizetések kezelése.
* **Szállásadói statisztikák:** foglalások, bevétel, kihasználtság és értékelések megjelenítése.

## Felhasználói szerepkörök

| Szerepkör          | Fő jogosultságok                                                                   |
| ------------------ | ---------------------------------------------------------------------------------- |
| **Bérlő**          | Szálláskeresés, foglalás, fizetés, lemondás, üzenetküldés, kedvencek és értékelés  |
| **Szállásadó**     | Hirdetések, árak, elérhetőség, foglalások, üzenetek és saját statisztikák kezelése |
| **Adminisztrátor** | Felhasználók, hirdetések, foglalások, panaszok és fizetési problémák felügyelete   |

A regisztráció e-mail-címmel és jelszóval történik. Az e-mail-cím megerősítése kötelező.

## Foglalási és fizetési folyamat

1. A bérlő kiválasztja a szálláshelyet és a foglalni kívánt egységeket.
2. Megadja az érkezés és a távozás dátumát, valamint az egyes egységek vendégszámát.
3. A rendszer ellenőrzi az elérhetőséget és a minimális éjszakaszámot.
4. A rendszer kiszámítja a teljes árat, beleértve az alkalmazandó díjakat és kedvezményeket.
5. A bérlő HUF-ban vagy EUR-ban fizeti ki a teljes összeget, amennyiben a választott pénznemben rendelkezésre áll az ár.
6. Sikeres fizetés után a foglalás automatikusan megerősödik, a naptár frissül, és az érintettek értesítést kapnak.

**Fontos üzleti szabályok:**

* Sikertelen fizetés nem eredményezhet megerősített foglalást.
* A foglalásnak meg kell akadályoznia az ugyanazon időszakra és egységre történő dupla foglalást.
* A bérlő az érkezés előtt legalább 48 órával történő lemondás esetén teljes visszatérítésre jogosult.
* A szállásadó által kezdeményezett lemondás teljes visszatérítést eredményez.
* A platform nem számít fel jutalékot.
* A szállásadói kifizetés célja az azonnali teljesítés; ez a kiválasztott fizetési szolgáltató képességeitől függ.

## Technológiai stack

| Réteg                | Technológia        | Állapot     |
| -------------------- | ------------------ | ----------- |
| Frontend             | React              | Kiválasztva |
| Backend              | NestJS             | Kiválasztva |
| Adatbázis            | MongoDB            | Kiválasztva |
| Hosting              | Később választandó | Nyitott     |
| Fizetési szolgáltató | Később választandó | Nyitott     |
| Fájltárolás          | Később választandó | Nyitott     |
| E-mail-szolgáltató   | Később választandó | Nyitott     |
| Térkép és geokódolás | Később választandó | Nyitott     |

## Tervezett modulok

A backend tervezett logikai moduljai:

| Modul           | Felelősség                                                              |
| --------------- | ----------------------------------------------------------------------- |
| `auth`          | Regisztráció, bejelentkezés, e-mail-megerősítés és jelszó-visszaállítás |
| `users`         | Felhasználói profilok és szerepkörök                                    |
| `listings`      | Szálláshelyek és hirdetések                                             |
| `units`         | Szobák és apartmanegységek                                              |
| `search`        | Keresés, szűrés és rendezés                                             |
| `availability`  | Naptár és elérhetőség                                                   |
| `bookings`      | Foglalások és foglalási tételek                                         |
| `payments`      | Fizetési tranzakciók                                                    |
| `refunds`       | Visszatérítések                                                         |
| `reviews`       | Értékelések                                                             |
| `messages`      | Beszélgetések és üzenetek                                               |
| `favorites`     | Kedvencek                                                               |
| `complaints`    | Panaszok és bejelentések                                                |
| `invoices`      | Számlák                                                                 |
| `notifications` | E-mailes és alkalmazáson belüli értesítések                             |
| `admin`         | Adminisztrációs műveletek                                               |
| `audit-logs`    | Biztonsági és üzleti eseménynaplók                                      |

Ezek tervezett modulok, nem feltétlenül már megvalósított vagy végleges API-végpontok.

## Üzemeltetés és biztonság

* **Biztonsági mentés:** napi automatikus mentés.
* **Naplózás:** részletes naplózás, beleértve a bejelentkezéseket, foglalásokat, fizetéseket és adminisztrátori műveleteket.
* **Feltöltések:** képek és videók támogatása.
* **Reszponzivitás:** desktop, tablet és mobil támogatása.
* **Nyelvek:** magyar és angol.
* **Adatmegőrzés:** az alkalmazandó jogi követelmények szerint.
* **Jogosultságkezelés:** szerepköralapú hozzáférés; minden védett műveletnél szerveroldali jogosultság-ellenőrzés szükséges.

A naplózás során a jelszavakat, fizetési kártyaadatokat, hozzáférési tokeneket és más titkos adatokat nem szabad naplózni.

## Nyitott döntések

Az alábbi kérdések a részletes tervezés vagy a fejlesztés során véglegesítendők:

* Hosting- és infrastruktúra-szolgáltató.
* Fizetési szolgáltató, piactéri kifizetések és tranzakciós díjak kezelése.
* Fájltárolási és e-mail-szolgáltató.
* Számlázási és adózási modell, országonkénti megfelelés.
* A be- és kijelentkezés pontos időpontjai.
* A 48 órás lemondási határidő pontos időzóna- és határidő-kezelése.
* Sikertelen fizetéskor az ideiglenes dátumfoglalás és annak lejárata.
* A népszerűségi rangsor súlyozása.
* A hirdetés inaktivitásának pontos definíciója.
* A szállásadói telefonszám és e-mail láthatóságának, illetve használatának szabályai.
* Értékelési skála és moderálási szabályok.
* Fájlméret-, formátum- és feltöltési korlátok.

## Fejlesztési állapot

A projekt jelenleg a követelmények és a műszaki tervezés szintjén áll. A technológiai alapok és a fő üzleti folyamatok meghatározottak, de a szolgáltatói integrációk és több részletszabály még véglegesítésre vár.

A README a projekt áttekintésére szolgál; a részletes szoftverkövetelmény-specifikációt külön dokumentumban célszerű fenntartani.
