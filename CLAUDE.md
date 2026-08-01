# sakkeraappana.com

Sakke Raappanin henkilökohtaiset kotisivut — seikkailijan ja dokumentaarisen elokuvantekijän portfolio.

## Deploy-arkkitehtuuri

```
lokaalinen kehitys → GitHub (main-branch) → Cloudflare Pages (automaattinen deploy)
```

- Jokainen push `main`-haaraan käynnistää Cloudflare Pages -buildin automaattisesti.
- Domainit `sakkeraappana.com` ja `www.sakkeraappana.com` on kytketty Cloudflare DNS:llä suoraan Pages-projektiin.
- Preview-deployt: jokainen PR saa oman väliaikaisen URL:n (esim. `feature-xyz.sakkeraappana-com.pages.dev`).
- Build-komento: `npm run build` — output-kansio `dist/`.

## Tekninen stack

- **Astro 5** — staattinen output (`output: 'static'`), ei SSR.
- **Astro Content Collections** — tyypitetty sisältö Zod-skeemalla.
- Ei ylimääräisiä frontend-frameworkeja (React, Vue jne.) — puhdas Astro-komponentit.
- TypeScript käytössä (strict-mode).

## Design system — Leveyspiiri

Graafinen ohjeisto löytyy `graafinen_ohjeisto/`-kansiosta. Kaikki design-tokenit ovat `src/styles/global.css`:ssä.

**Teemat:** kaksi teemaa — tumma (dark, default) ja vaalea (light, editoriaaliset sivut).
- Tumma: etusivu, seikkailut-sivut
- Vaalea: `/sakke`, `/yhteistyo`

**Värit:**
- `--color-glacier` — pääkorostusväri (linkit, aktiivinen tila, data-arvot)
- `--color-fire` — käynnissä/tulossa-tila (live-badge, käynnissä-seikkailu)
- `--color-muted` — toissijainen teksti
- `--color-border` — reunaviivat

**Kirjasimet:**
- `var(--font-display)` — Archivo, otsikot (`t-display`, `t-heading-1/2/3`)
- `var(--font-body)` — Newsreader, leipäteksti (`t-body`, `t-body-sm`)
- `var(--font-mono)` — IBM Plex Mono, data ja labelit (`t-label`, `t-mono`, `data-value`)

**Ei koskaan:** älä käytä muita fontteja tai värejä kuin mitä tokeneissa on. Älä lisää uusia CSS-muuttujia ilman hyvää syytä.

## Sivurakenne

| Sivu | Tiedosto | Teema | Kuvaus |
|---|---|---|---|
| Etusivu | `src/pages/index.astro` | Tumma | Hero-crossfade, seikkailut-kortit, about-teaser |
| Seikkailut-lista | `src/pages/seikkailut/index.astro` | Tumma | Kaikki seikkailut listana |
| Seikkailun sivu | `src/pages/seikkailut/[slug].astro` | Tumma | Yksittäisen seikkailun koko tarina + video lopussa |
| Sakke | `src/pages/sakke.astro` | Vaalea | Bio, taidot, tilastot — kovakoodattu |
| Yhteistyö | `src/pages/yhteistyo.astro` | Vaalea | Käyttötapaukset, yhteydenottolomake |

## Sisältörakenne — Content Collections

Muokattava sisältö on yhdessä kokoelmassa `src/content/`-kansiossa: seikkailut. Skeema on `src/content/config.ts`. Elokuvia ei ole erillisenä sisältönä — jokaiseen seikkailuun voi liittää videon (`elokuva`- tai `videot`-kenttä), joka näytetään seikkailun sivun lopussa.

### Seikkailut (`src/content/seikkailut/`)

Yksi `.md`-tiedosto per seikkailu. Tiedoston nimi on slug (käytetään URL:ssa).

**Pakollisia kenttiä:**
```yaml
nimi: "Arktinen taival – Huippuvuoret"   # Näkyy otsikkona kaikkialla
paikka: "Huippuvuoret, Norja"             # Faktajuovassa ja listauksessa
vuosi: 2024                               # Numero, käytetään lajitteluun
kesto: "21 päivää"                        # Vapaa teksti
tiivistelma: "Lyhyt kuvaus..."            # Ingressi — näkyy korteissa ja listauksessa
```

**Valinnaisia kenttiä:**
```yaml
kuva: /kuvat/seikkailut/huippuvuoret-2024/hero.jpg   # Hero-kuva; ilman tätä näkyy placeholder
km: 340                                               # Kilometrimäärä
vuodenaika: "Talvi"
olosuhteet: "−34 °C"
nousu: "1 240 m"
koordinaatit: "68°42′N 27°01′E → 78°13′N 15°38′E"   # Renderöityy reittivisualisointina
omavaraisuus: "Täysi omavaraisuus"
osallistujat: ["Sakke Raappana"]
featured: true        # Näkyy etusivun korttiruudukossa (max 4)
kaynnissa: true       # Aktivoi live-badgen ja nuotio-värin; näkyy live-bandissa etusivulla

# Videot — yksi tai useampia (esim. videosarja)
videot:
  - url: https://www.youtube.com/watch?v=xxxxx
    nimi: "Osa 1: Lähtö"
  - url: https://www.youtube.com/watch?v=yyyyy
    nimi: "Osa 2: Jäämeri"

# Yksittäinen video — käytä tätä kun seikkailusta on yksi elokuva (yleisin tapaus)
elokuva: https://www.youtube.com/watch?v=xxxxx
```

**Tarina** kirjoitetaan frontmatterin alapuolelle vapaana Markdownina. Tuettu syntaksi: otsikot (`##`, `###`), lihavointi, kursiivi, listat.

**Video** liitetään seikkailuun `elokuva`-kentällä (yksi video) tai `videot`-kentällä (videosarja). Se renderöityy seikkailun sivun loppuun upotettuna.

## Kuvat — kansiorakenne

Kaikki kuvat menevät `public/kuvat/`-kansioon. Astro tarjoaa ne suoraan URL-polkuina (esim. `/kuvat/etusivu/hero-1.jpg`).

```
public/
└── kuvat/
    ├── etusivu/
    │   ├── hero-1.jpg     # Crossfade-karusellin kuvat — numeroitu järjestyksessä
    │   ├── hero-2.jpg
    │   └── ...            # Lisää niin monta kuin haluat (suositus 3–6)
    ├── seikkailut/
    │   └── <slug>/        # Kansion nimi = MD-tiedoston slug, YKSI kansio per seikkailu
    │       ├── hero.jpg   # Seikkailun pääkuva
    │       └── kuvat/     # Artikkelikuvat (vapaavalintainen määrä)
    └── sakke/
        └── muotokuva.jpg  # Muotokuva /sakke-sivulle
```

**Nimeämiskäytäntö:**
- Kansion nimi = aina sama kuin `.md`-tiedoston nimi ilman päätettä (esim. `poyrisjarvi-selviytyminen`)
- Seikkailun pääkuva: aina `hero.jpg` suoraan `<slug>/`-kansion alle
- Artikkelikuvat: `<slug>/kuvat/`-alikansioon — vapaa nimeäminen
- Etusivun kuvat: `hero-1.jpg`, `hero-2.jpg` jne.
- **Ei erillistä `elokuvat/`-kansiota** — kaikki seikkailuun liittyvä samassa `seikkailut/<slug>/`-kansiossa

## Etusivun hero-crossfade

Hero-kuvat konfiguroidaan `src/pages/index.astro`:n frontmatter-taulukossa:

```js
const heroImages: string[] = [
  '/kuvat/etusivu/hero-1.jpg',
  '/kuvat/etusivu/hero-2.jpg',
  // lisää polku tähän kun lisäät uuden kuvan
];
```

Animaatio laskee sykliajan automaattisesti kuvamäärän perusteella (7 sek per kuva). Uuden kuvan lisäys: lisää tiedosto kansioon ja polku tähän taulukkoon.

## Uuden sisällön lisäämisohje

### Uusi seikkailu

1. Luo kansio `public/kuvat/seikkailut/<slug>/`
2. Lisää hero-kuva: `public/kuvat/seikkailut/<slug>/hero.jpg`
3. Lisää artikkelikuvat: `public/kuvat/seikkailut/<slug>/kuvat/` (ei pakollinen)
4. Luo `src/content/seikkailut/<slug>.md` — kopioi pohjaksi olemassa oleva tiedosto
5. Täytä frontmatter-kentät, kirjoita tarina Markdownina
6. Jos `featured: true`, näkyy etusivun korttiruudukossa (pidä max 4 featured-seikkailua kerrallaan)
7. Jos seikkailusta on video, lisää `elokuva`- tai `videot`-kenttä (ks. alla)
8. Push GitHubiin → deploy

### Uusi hero-kuva etusivulle

1. Lisää `public/kuvat/etusivu/hero-N.jpg`
2. Lisää polku `index.astro`:n `heroImages`-taulukkoon
3. Push

### Videosarja seikkailulle

Lisää `videot`-kenttä seikkailun `.md`-tiedostoon:
```yaml
videot:
  - url: https://www.youtube.com/watch?v=aaa
    nimi: "Osa 1: Otsikko"
  - url: https://www.youtube.com/watch?v=bbb
    nimi: "Osa 2: Otsikko"
```

Sivu renderöi automaattisesti: yksi video → upotus, useampia → ensimmäinen upotettuna + lista muista.

## Seikkailu-artikkelin formaatti — lehtimainen design

Jokainen iso seikkailu saa oman `.astro`-sivun (`src/pages/seikkailut/<slug>.astro`). Tämä on vakioformaatti — **ei** käytetä geneeristä `[slug].astro`-templatea isoja artikkeleita varten.

**Sivurakenne järjestyksessä:**

| Osio | Kuvaus |
|---|---|
| Hero | 100vh täysruutu, hero-kuva, gradientti, vuosi + sijainti + h1 + ingressi |
| Faktajuova | 4×2 grid, muuttuvat avain/arvo-parit (artikkelin mukaan) |
| Lead-teksti | Suuri kursivoitu sitaattilause, max-width 56rem, tekstin keskitys |
| Luku 01 | Kuva vasemmalla (4:5) + teksti oikealla |
| Full-bleed break | Koko leveys, 78vh korkeus, valinnainen caption |
| Luku 02 | Teksti vasemmalla + 3-kuvan mosaiikki oikealla |
| Full-bleed break | Koko leveys, 78vh korkeus |
| Luku 03 | Sticky-paneeli vasemmalla (otsikko + callout-numerot) + proosa oikealla + pull quote + 2 kuvaa |
| Elokuva | Tumma tausta, film-header, 16:9 embed (play-nappi tai "Elokuva tulossa" -tila) |
| Galleria | 12-sarakkeen asymmetrinen grid (4 kuvaa: gal-a span 5×2, gal-b span 7, gal-c span 4, gal-d span 3) |
| Seuraava | Koko leveyden kuvakortti → `/seikkailut` |

**Callout-numerot luvussa 03** vaihtelevat artikkelin mukaan (esim. kcal-tilastot selviytymisartikkelille, km-luvut kanoottiartikkelille).

**Faktajuovan otsikot** ovat artikkeliharkinnan mukaan — ei kiinteitä kenttiä. Esim. Jäämerelle: Reitti, Kesto, Kuljettu matka, Kartalta mitattu, Kanto-osuudet, Erämaat, Vedenjakajat, Osallistujat.

**Tiedostorakenne uudelle artikkelille:**
1. `src/content/seikkailut/<slug>.md` — kortin/listan data (frontmatter) + lyhyt ingressi
2. `src/pages/seikkailut/<slug>.astro` — koko lehtimainen artikkeli (kopioi pohjaksi `poyrisjarvi-selviytyminen.astro` tai `jaamerelle.astro`)
3. `public/kuvat/seikkailut/<slug>/kuvat/` — kaikki artikkelikuvat tässä kansiossa

**Kuvamäärä:** suositus 10 kuvaa per artikkeli — hero, 3 luku-kuvaa, 2 full-bleed, 2 luku-03 -kuvaa, film-posteri. Loput galleriaan.

**Elokuva-osio:** jos `elokuva`-kenttä on asetettu `.md`:ssä, näytetään play-nappi ja YouTube-embed. Ilman URL:ia näytetään automaattisesti "Elokuva tulossa" -tila.

## Komponentit

| Komponentti | Käyttö |
|---|---|
| `src/layouts/Base.astro` | Kaikki sivut käyttävät tätä — nav, footer, head |
| `src/components/Nav.astro` | Kiinteä navigaatio, mobiili-overlay |
| `src/components/Footer.astro` | Footer, sometunnukset, sähköposti |
| `src/components/AdventureCard.astro` | Seikkailukortti (etusivu + tuleva käyttö) |

## Kovakoodattu sisältö (ei content collectionissa)

Seuraavat muutetaan suoraan `.astro`-tiedostoihin — ei MD-tiedostoja:

- **Bio-teksti, tilastot ja taidot** → `src/pages/sakke.astro`
- **Yhteistyön käyttötapaukset** → `src/pages/yhteistyo.astro`
- **Somelinkit ja sähköposti** → `src/components/Footer.astro`
- **Nav-linkit** → `src/components/Nav.astro`

## Kehitysympäristö

```bash
npm run dev    # Kehitysserveri, hot reload
npm run build  # Tuotantobuild → dist/
npm run preview # Esikatsele tuotantobuild lokaalisesti
```
