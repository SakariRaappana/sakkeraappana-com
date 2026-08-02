// Rakennedata (schema.org / JSON-LD) — jaetut entiteetit.
// Näkyy vain hakukoneille ja tekoälyille, ei käyttäjälle. Ei muuta sivun sisältöä.

const SITE = 'https://sakkeraappana.com';

// Aihepiirit — samat hakusanat kuin YouTube-kanavan parhaat termit.
// Käytetään Person.knowsAbout- ja VideoObject.keywords-kentissä.
export const AIHEET = [
  'Vaellus',
  'Retkeily',
  'Vaellus Lapissa',
  'Lappi',
  'Metsästys',
  'Hiihtovaellus',
  'Erävaellus',
  'Arktinen retkeily',
  'Selviytyminen erämaassa',
  'Dokumenttielokuva',
];

// Sakke henkilönä — ankkuroi koko domainin. @id sitoo entiteetit yhteen sivujen välillä.
export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE}/#person`,
  name: 'Sakke Raappana',
  url: SITE,
  image: `${SITE}/kuvat/sakke/sakke_raappana_Sarek.webp`,
  jobTitle: 'Seikkailija ja dokumentaarinen elokuvantekijä',
  description:
    'Suomalainen seikkailija ja dokumentaarinen elokuvantekijä. Arktisia retkikuntia, hiihtovaelluksia ja selviytymisprojekteja Pohjolan erämaissa.',
  nationality: { '@type': 'Country', name: 'Suomi' },
  knowsAbout: AIHEET,
  sameAs: [
    'https://youtube.com/@SakkeRaappana',
    'https://instagram.com/sakkeraappana',
    'https://facebook.com/sakkeraappana',
    'https://tiktok.com/@sakkeraappana',
    'https://www.arktinentaival.fi/',
  ],
};

// Verkkosivusto itsessään.
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  url: SITE,
  name: 'Sakke Raappana',
  inLanguage: 'fi-FI',
  publisher: { '@id': `${SITE}/#person` },
};

// YouTube-videon ID mistä tahansa URL-muodosta.
function youTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\s]+)/);
  return m ? m[1] : null;
}

// VideoObject seikkailun elokuvalle — antaa Googlen näyttää videon rikkaana tuloksena.
export function videoSchema(opts: {
  nimi: string;
  kuvaus: string;
  url: string;
  thumbnail?: string;
  vuosi?: number;
}): Record<string, unknown> | null {
  const id = youTubeId(opts.url);
  if (!id) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: opts.nimi,
    description: opts.kuvaus,
    thumbnailUrl: opts.thumbnail
      ? new URL(opts.thumbnail, SITE).href
      : `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    uploadDate: opts.vuosi ? `${opts.vuosi}-01-01` : undefined,
    contentUrl: `https://www.youtube.com/watch?v=${id}`,
    embedUrl: `https://www.youtube.com/embed/${id}`,
    keywords: AIHEET.join(', '),
    author: { '@id': `${SITE}/#person` },
  };
}
