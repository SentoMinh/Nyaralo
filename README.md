# A szállásfoglalási platform specifikációjának rövid összefoglalója

Cél: Egy EU-ban működő, magyar és angol nyelvű szállásfoglalási webalkalmazás létrehozása, amely összekapcsolja a bérlőket és a szállásadókat.

## 1. Technológia és alapbeállítások

|
Terület

|

Meghatározás

|
| --- | --- |
|

Frontend

|

React

|
|

Backend

|

NestJS

|
|

Adatbázis

|

MongoDB

|
|

Nyelvek

|

Magyar, angol

|
|

Pénznemek

|

HUF, EUR

|
|

Platform

|

Reszponzív webalkalmazás

|
|

Működési terület

|

Európai Unió

|
|

Biztonsági mentés

|

Naponta automatikusan

|
|

Naplózás

|

Részletes

|
|

Feltölthető fájlok

|

Képek és videók

|

## 2. Felhasználói szerepkörök

* Bérlő: szállást keres, foglal, fizet, üzenetet küld és értékel.

* Szállásadó: hirdetéseket kezel, árakat állít be, foglalásokat és bevételeket követ.

* Adminisztrátor: felhasználókat, hirdetéseket, foglalásokat, panaszokat és sikertelen fizetéseket kezel.

A regisztráció e-mail-címmel és jelszóval történik, kötelező e-mail-megerősítéssel.

## 3. Fő funkciók

Szálláskeresés

Ár, vendégszám, szobák, felszereltség, értékelés, dátum és távolság szerinti szűrés, térképes keresés és kedvencek.

Hirdetések kezelése

Teljes apartmanok és külön szobák hirdetése, képek és videók feltöltése, árak, kedvezmények és elérhetőségi naptár kezelése.

Foglalás

Több szállásegység egyidejű foglalása, külön vendégszámmal, automatikus elérhetőség-ellenőrzéssel és árkalkulációval.

Fizetés és visszatérítés

Teljes előrefizetés HUF-ban vagy EUR-ban, automatikus foglalásmegerősítés sikeres fizetés után, valamint a szabályok szerinti visszatérítés.

Kommunikáció és értékelés

Belső üzenetküldés sikeres foglalás után, értékelés pedig kizárólag teljesült foglalást követően.

Statisztikák és adminisztráció

Foglalások, bevételek, kihasználtság, értékelések, panaszok és rendszeresemények kezelése.

## 4. Legfontosabb üzleti szabályok

* A teljes foglalási összeget előre kell kifizetni.

* A platform nem számít fel jutalékot.

* Sikeres fizetés után a foglalás automatikusan megerősödik.

* A bérlő legalább 48 órával az érkezés előtt történő lemondás esetén teljes visszatérítést kap.

* A szállásadó általi lemondás teljes visszatérítést eredményez.

* A hirdetések előzetes adminisztrátori jóváhagyás nélkül jelennek meg.

* A hirdetések 365 nap inaktivitás után lejárnak.

* A foglalás a kijelentkezés napján automatikusan teljesítetté válik.

## 5. Nyitott döntések

További egyeztetést igényel

* Fizetési szolgáltató és tárhely kiválasztása.

* A számlázás és az adózás pontos jogi modellje.

* A be- és kijelentkezés pontos időpontja.

* A sikertelen fizetés után a dátumok ideiglenes zárolása.

* A 48 órás lemondási határidő pontos időértelmezése.

* A népszerűségi rangsorolás súlyozása.

* A hirdetés inaktivitásának pontos meghatározása.

* A szállásadói elérhetőségek használatának szabályai.

Összegzés: A platform alapvető funkcionális követelményei meghatározottak. A fejlesztés megkezdhető a végleges technikai architektúra és a még nyitott pénzügyi, jogi és üzleti részletek tisztázásával párhuzamosan.
