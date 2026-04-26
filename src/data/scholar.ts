export const scholarProfile = {
  profileUrl: 'https://scholar.google.com/citations?user=hkasl44AAAAJ&hl=zh-CN&authuser=2',
  affiliation: 'Harbin Institute of Technology, Shenzhen · M.S. in Computer Science',
  verifiedEmail: 'stu.hit.edu.cn',
  updatedAt: new Date('2026-04-26'),
  syncMode: 'manual_snapshot' as const,
  stats: {
    citations: {
      all: 6,
      since2021: 6,
    },
    hIndex: {
      all: 1,
      since2021: 1,
    },
    i10Index: {
      all: 0,
      since2021: 0,
    },
    openAccessPapers: 2,
    restrictedAccessPapers: 0,
  },
};

export const scholarSyncNote =
  'Google Scholar does not provide a stable public API. The numbers shown here are a cached snapshot maintained with the site instead of a live scrape.';
