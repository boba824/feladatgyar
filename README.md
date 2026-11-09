# Tudásépítő – Interaktív és Nyomtatható Gyakorlófeladatok (NAT 2020)

Böngészőből futtatható, statikusan (GitHub Pages-ről) hostolható feladatgeneráló alkalmazás általános iskolások otthoni gyakorlásához.

## Jelenleg elérhető modulok

### Matematika – 4. osztály (I. kötet, OH-MAT04MA/I alapján)
1. **Számolás 0-tól 1000-ig & Római számok** (év eleji ismétlés, helyi értékek, műveleti sorrend, római számok)
2. **Számolás és kerekítés 10 000-ig** (helyiérték-bontás, tízes/százas/ezres számszomszédok, kerekítés)
3. **Írásbeli műveletek 0-tól 10 000-ig** (kockás füzet nézetes írásbeli összeadás, kivonás és egyjegyűvel való szorzás előzetes becsléssel)
4. **Mérések és mértékegység-átváltás** (hosszúság, tömeg, űrtartalom, kerület- és területszámítás)
5. **A negatív számok** (hőmérséklet-változás, napi hőingás, vagyon és tartozás)
6. **Szöveges feladatok & Tudáspróba** (életszerű szöveges feladatok, „Melyik számra gondoltam?”, vegyes számonkérő feladatsor)

## Fő funkciók
- **Azonnali visszajelzés** feladatonként (`Enter` billentyűvel vagy az *Azonnali ellenőrzés* gombbal), opcionális villanykörte-tippekkel.
- **Százalékos értékelés** és a munkafüzetből ismert 4 fokozatú szöveges/hangulatjeles értékelő skála (*„Értékeld a munkádat!”*).
- **A4-es nyomtatható feladatlap nézet** (`Nyomtatás` gomb), üres négyzetrácsos mezőkkel és külön oldalon nyomtatható **szülői megoldókulccsal**.
- **Bővíthető architektúra** több tantárgyhoz és 1–8. évfolyamhoz.

## Fejlesztés helyben

```bash
npm install
npm run dev
```

## GitHub Pages beüzemelése

A tárolóban megtalálható a `.github/workflows/deploy.yml` fájl.
1. Töltsd fel a kódot egy GitHub repository `main` (vagy `master`) ágára.
2. A GitHub repository **Settings → Pages** menüpontjában a **Build and deployment → Source** résznél válaszd a **GitHub Actions** opciót.
3. Minden `push` után automatikusan lefordul és frissül az éles oldal.
