-- Tesztadatok a nyaralo.db adatbázishoz
-- Újrafuttatható: előbb törli a meglévő sorokat.
-- A teljes_ar 25 000 Ft/éj árral számolva.

DELETE FROM foglalasok;
DELETE FROM admin;
DELETE FROM sqlite_sequence WHERE name IN ('foglalasok', 'admin');

-- Admin: felhasználónév: admin, jelszó: admin123 (bcrypt hash)
INSERT INTO admin (felhasznalonev, jelszo) VALUES
  ('admin', '$2b$10$dZMXP/fkFRQnYVBHIAGRFextYfXCytYkuOREdD9SugN1ewF0hf3SG');

INSERT INTO foglalasok
  (nev, email, telefon, erkezes, tavozas, vendegek_szama, fizetesi_mod, teljes_ar, statusz, fizetesi_statusz, letrehozva)
VALUES
  ('Kovács Anna',   'kovacs.anna@example.com',   '+36 30 111 2233', '2026-10-09', '2026-10-12', 4, 'Átutalás', 75000,  'Elfogadva',  'Fizetve',       '2026-09-20 10:15:00'),
  ('Nagy Péter',    'nagy.peter@example.com',    '+36 20 222 3344', '2026-10-16', '2026-10-18', 2, 'Készpénz', 50000,  'Elfogadva',  'Fizetésre vár', '2026-09-22 18:40:00'),
  ('Szabó Eszter',  'szabo.eszter@example.com',  '+36 70 333 4455', '2026-10-23', '2026-10-27', 5, 'Átutalás', 100000, 'Függőben',   'Nincs fizetve', '2026-09-28 09:05:00'),
  ('Tóth Gábor',    'toth.gabor@example.com',    '+36 30 444 5566', '2026-10-24', '2026-10-26', 3, 'Készpénz', 50000,  'Függőben',   'Nincs fizetve', '2026-09-29 14:30:00'),
  ('Horváth Júlia', 'horvath.julia@example.com', '+36 20 555 6677', '2026-11-06', '2026-11-09', 6, 'Átutalás', 75000,  'Elutasítva', 'Nincs fizetve', '2026-09-25 20:10:00'),
  ('Varga Dániel',  'varga.daniel@example.com',  '+36 70 666 7788', '2026-11-13', '2026-11-15', 2, 'Átutalás', 50000,  'Lemondva',   'Nincs fizetve', '2026-09-18 08:45:00');
