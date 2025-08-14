---
title: "Export slides to PDF (including animations and notes)"
description: "How to use LibreOffice Impress (open source) to export slides to PDF – including workflows to simulate animations and tips for exporting notes as PDF comments."
weight: 1
---

How to use LibreOffice Impress (open source) to export slides to PDF – including workflows to simulate animations and tips for exporting notes as PDF comments.

### Standard PDF export in Impress
1. File > Export as PDF…
2. Important options in the dialog:
   - General > Images: Set quality as needed (e.g., 90–100% for photos, Lossless for vector graphics).
   - General > Tagged PDF: Enable if you need accessibility/structure.
   - General > Comments and Notes:
     - Export comments: Adds existing comments as PDF annotations.
     - Export notes pages: Creates pages with notes (alternative: use “comments” as annotations, see above).
   - Initial View: Define initial zoom and page layout.
   - Security: Optional password protection/restrictions.
3. Confirm export and choose the destination file.

{{< note >}}
Design your slides with the same aspect ratio in which they will be presented (e.g., 16:9) to avoid borders or scaling artifacts.
{{< /note >}}

### Notes as PDF comments
Impress provides multiple ways to include speaker notes in the PDF export:
- “Export notes pages”: generates separate pages with notes (good for handouts).
- “Export comments”: If you use annotations as comments, they will be preserved as true PDF comments. Many PDF viewers let users easily show/hide them.

{{< note >}}
In practice, Impress preserves notes/comments in PDFs more robustly than PowerPoint. Still, verify the results in your target PDF viewer.
{{< /note >}}

### Representing animations in PDF – the principle
PDF does not support “real” slide animations like fade-ins or motion paths. The established approach is:
- Duplicate the slide for each animation step (static intermediate states).
- The final PDF contains a sequence of slides that, when presented, produces the impression of an animation (build steps).

You can do this manually in Impress (duplicate slides and show/hide objects per step) or semi-automatically using helper tools.

### Exporting animated slides to PDF
Approach: Translate animations into a sequence of static slides; each slide shows exactly one additional step of the build.

Key takeaways from the post:
- Workflow per article: Using an add-on or a described workaround to automatically duplicate slides and reveal content step-by-step before exporting to PDF.
- Benefits: Resulting PDFs work reliably across common PDF viewers; no dependency on the presentation software at playback time.
- Limitations: Very complex animations, transitions, or time-based effects may not translate 1:1. Some manual clean-up may be required.

**Practical tips:**
- Disable slide transitions before export; focus on build steps within a slide.
- Use clear, discrete steps (appear/disappear, emphasis) that translate well into static states.
- After conversion, verify the order and visibility of all elements.

[Source](https://codeyarns.com/tech/2013-05-01-how-to-export-animated-slides-to-pdf-in-libreoffice-impress.html#gsc.tab=0 "_blank")

### Step-by-step
Without a dedicated add-on (manual):
1. Duplicate the original slide.
2. On the copy, only keep the elements visible that should be shown up to the next step (hide/delete others).
3. Duplicate again for each additional step and progressively reveal more elements.
4. When all steps are represented: File > Export as PDF ...

With add-on (semi-automatic):
- Follow the [linked article](https://codeyarns.com/tech/2013-05-01-how-to-export-animated-slides-to-pdf-in-libreoffice-impress.html#gsc.tab=0 "_blank"). The described add-on automates duplicating slides and revealing animated elements step by step. Then export the result to PDF as usual.

### Further reading
- LibreOffice download: [https://www.libreoffice.org/download/download/](https://www.libreoffice.org/download/download/ "_blank")
- LibreOffice help: [https://help.libreoffice.org/](https://help.libreoffice.org/ "_blank")
