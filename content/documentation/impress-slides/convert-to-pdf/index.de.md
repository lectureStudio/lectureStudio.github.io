---
title: "Folien als PDF exportieren (inkl. Animationen und Notizen)"
description: "So nutzen Sie LibreOffice Impress (Open Source), um Folien optimal als PDF zu exportieren – inklusive Workflows für Animationen und Hinweise zum Export von Notizen als PDF-Kommentare."
weight: 1
---

So nutzen Sie LibreOffice Impress (Open Source), um Folien optimal als PDF zu exportieren – inklusive Workflows für Animationen und Hinweise zum Export von Notizen als PDF-Kommentare.

### Standard-PDF-Export in Impress
1. Datei > Als PDF exportieren …
2. Wichtige Optionen im Dialog:
   - Allgemein > Bilder: Qualität je nach Bedarf einstellen (z. B. 90–100 % für Fotos, Verlustfrei für Vektorgrafiken).
   - Allgemein > Tagged PDF: Aktivieren, wenn Barrierefreiheit/Struktur benötigt wird.
   - Allgemein > Kommentare und Notizen:
     - Kommentare exportieren: Fügt vorhandene Kommentare als PDF-Kommentare ein.
     - Notizenseiten exportieren: Erstellt Seiten mit Notizen (Alternativ: „Kommentare“ nutzen, siehe unten).
   - Ansicht: Anfangszoom und Seitenlayout festlegen.
   - Sicherheit: Optional Passwortschutz/Restriktionen.
3. Export bestätigen und Zieldatei wählen.

{{< note >}}
Legen Sie die Folien im gleichen Seitenverhältnis an, in dem später präsentiert wird (z. B. 16:9). So vermeiden Sie Ränder oder Skalierungsartefakte.
{{< /note >}}

### Notizen als PDF-Kommentare
Impress bietet mehrere Wege, Sprechernotizen in den PDF-Export einzubinden:
- „Notizenseiten exportieren“: erzeugt eigenständige Notizseiten (mit Miniatur der Folie + Notizen). Gut für Handouts.
- „Kommentare exportieren“: Wenn Sie Anmerkungen als Kommentare nutzen, werden diese als echte PDF-Kommentare übernommen. Viele PDF-Viewer können diese Kommentare komfortabel ein- und ausblenden.

{{< note >}}
Praxisbeobachtung: In Impress funktioniert die Übernahme von Notizen/Kommentaren in PDF robuster als in PowerPoint. Prüfen Sie das Ergebnis dennoch im Ziel-PDF-Viewer.
{{< /note >}}

### Animationen in PDF abbilden – Prinzip
PDF unterstützt keine „echten“ Folienanimationen wie Ein-/Ausblenden oder Bewegungsabläufe. Der bewährte Ansatz ist daher:
- Jede Animationsstufe wird als eigene Folie dupliziert (statische Zwischenstände).
- Das PDF enthält anschließend eine Sequenz dieser Folien, die beim Vorführen den Eindruck einer Animation erweckt (Schritt-für-Schritt-Aufbau).

Das lässt sich in Impress manuell umsetzen (Folien duplizieren und Objekte je Schritt ein-/ausblenden) oder halbautomatisch mit Hilfswerkzeugen.

### Animationen in PDF exportieren
Ansatz: Animationen in eine Sequenz von statischen Folien „übersetzen“. Jede Folie zeigt genau einen weiteren Animationsschritt.

- Workflow: Mithilfe eines Add-ons bzw. eines beschriebenen Workarounds werden Folien automatisch dupliziert und Inhalte je Schritt eingeblendet, bevor als PDF exportiert wird.
- Vorteile: Der resultierende PDF-Export funktioniert in jedem gängigen PDF-Viewer zuverlässig; keine Abhängigkeit von Präsentationssoftware.
- Grenzen: Sehr komplexe Animationen, Übergänge oder zeitgesteuerte Effekte lassen sich ggf. nicht 1:1 abbilden. Manchmal ist manuelles Nacharbeiten erforderlich.

**Wichtige Hinweise aus der Praxis:**
- Übergänge zwischen Folien (Transitionen) vor dem Export deaktivieren; konzentrieren Sie sich auf Aufbau-Schritte innerhalb einer Folie.
- Verwenden Sie klare, diskrete Schritte (Ein-/Ausblenden, Hervorheben), die sich gut in statische Zwischenstände übersetzen lassen.
- Prüfen Sie nach der Umwandlung die Reihenfolge und Sichtbarkeit aller Elemente.

[Quelle](https://codeyarns.com/tech/2013-05-01-how-to-export-animated-slides-to-pdf-in-libreoffice-impress.html#gsc.tab=0 "_blank")

### Schritt-für-Schritt
Ohne spezielles Add-on (manuell):
1. Originalfolie duplizieren.
2. Auf der Kopie nur die Elemente sichtbar lassen, die bis zum nächsten Schritt gezeigt werden sollen (andere ausblenden/löschen).
3. Für jeden weiteren Schritt erneut duplizieren und sichtbare Elemente erweitern.
4. Wenn alle Schritte abgebildet sind: Datei > Als PDF exportieren ...

Mit Add-on (halbautomatisch):
- Folgen Sie dem [verlinkten Artikel](https://codeyarns.com/tech/2013-05-01-how-to-export-animated-slides-to-pdf-in-libreoffice-impress.html#gsc.tab=0 "_blank"). Das dort beschriebene Add-on automatisiert das Duplizieren der Folien und das sequenzielle Einblenden animierter Elemente. Danach exportieren Sie das Ergebnis wie gewohnt als PDF.

### Weiterführende Links
- LibreOffice-Download: [https://de.libreoffice.org/download/download/](https://de.libreoffice.org/download/download/ "_blank")
- LibreOffice-Hilfe: [https://help.libreoffice.org/](https://help.libreoffice.org/ "_blank")
