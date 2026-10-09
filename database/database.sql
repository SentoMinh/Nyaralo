CREATE TABLE IF NOT EXISTS foglalasok (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nev TEXT NOT NULL,
  email TEXT NOT NULL,
  telefon TEXT NOT NULL,
  erkezes TEXT NOT NULL,
  tavozas TEXT NOT NULL,
  vendegek_szama INTEGER NOT NULL CHECK (vendegek_szama >= 1),
  fizetesi_mod TEXT NOT NULL CHECK (fizetesi_mod IN ('Átutalás', 'Készpénz')),
  teljes_ar INTEGER NOT NULL,
  statusz TEXT NOT NULL DEFAULT 'Függőben'
    CHECK (statusz IN ('Függőben', 'Elfogadva', 'Elutasítva', 'Lemondva')),
  fizetesi_statusz TEXT NOT NULL DEFAULT 'Nincs fizetve'
    CHECK (fizetesi_statusz IN ('Nincs fizetve', 'Fizetésre vár', 'Fizetve')),
  letrehozva TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  CHECK (erkezes < tavozas)
);

CREATE TABLE IF NOT EXISTS admin (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  felhasznalonev TEXT UNIQUE NOT NULL,
  jelszo TEXT NOT NULL
);