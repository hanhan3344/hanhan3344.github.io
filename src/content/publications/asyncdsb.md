---
title: "AsyncDSB: Schedule-Asynchronous Diffusion Schrödinger Bridge for Image Inpainting"
slug: asyncdsb
description: A first-author AAAI paper on image inpainting that replaces synchronous schedules with pixel-asynchronous restoration guided by predicted gradients.
year: 2025
authors:
  - Zihao Han
  - Baoquan Zhang
  - Lisai Zhang
  - Shanshan Feng
  - Kenghong Lin
  - Guotao Liang
  - Yunming Ye
venue: "Proceedings of the AAAI Conference on Artificial Intelligence, Volume 39 Issue 3, pages 3374–3382"
venueShort: AAAI 2025
paperUrl: https://ojs.aaai.org/index.php/AAAI/article/view/32349
pdfUrl: https://ojs.aaai.org/index.php/AAAI/article/view/32349/34504
doiUrl: https://doi.org/10.1609/aaai.v39i3.32349
scholarUrl: https://scholar.google.com/citations?view_op=view_citation&hl=zh-CN&user=hkasl44AAAAJ&citation_for_view=hkasl44AAAAJ:u5HHmVD_uO8C
citations: 5
featured: true
firstAuthor: true
tags:
  - diffusion models
  - image inpainting
  - schrödinger bridge
blogSlug: asyncdsb-reading-note
---

AsyncDSB studies a mismatch hidden inside existing diffusion Schrödinger bridge approaches for image inpainting: the theory assumes a global schedule, but the actual restoration process of pixels is naturally asynchronous. The paper introduces a gradient-guided, pixel-asynchronous schedule so that high-frequency regions are restored earlier and low-frequency regions later, improving the overall restoration path.

The work reports around 3%–14% FID improvement over prior state-of-the-art baselines on real-world datasets and is currently the clearest first-author publication to expand into a site essay.
