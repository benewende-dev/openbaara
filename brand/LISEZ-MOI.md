# Identité OpenBaara

Le logo « le pli » et tout ce qui va avec. Version 1, novembre 2026.

Commencez par **charte-graphique-openbaara.pdf** : elle explique le signe, les versions, les couleurs, la police et ce qu'il faut éviter.

| Besoin | Dossier |
| --- | --- |
| Imprimeur, signalétique, textile, objets | `01-logo/pdf-impression` (vectoriel, sans perte) |
| Site, présentations, Word, Canva | `01-logo/svg` ou `01-logo/png-transparent` |
| Image avec le fond déjà mis | `01-logo/png-sur-fond` |
| Favicon, icônes de téléphone | `02-icones` |
| LinkedIn, X, WhatsApp, Instagram | `03-reseaux-sociaux` |
| Cartes de visite, papier à en-tête, signature e-mail | `04-impression` |
| Dépôt de la marque à l'OAPI | `05-depot-de-marque` |
| Police Geist (licence libre) | `06-typographie` |

## Couleurs

- Noir `#0A0A0A` (impression : texte en noir 100 %, grands aplats en noir riche C60 M40 Y40 N100)
- Blanc `#FFFFFF`
- Gris texte `#6B6B72`, gris papier `#EDEDEA`

## À compléter

- **Carte de visite** : le téléphone n'y figure pas. Ajoutez-le avant impression si vous le souhaitez.
- **Papier à en-tête et factures** : une fois la société immatriculée, ajoutez la forme juridique, le capital, le siège, le numéro RCCM et le compte contribuable, obligatoires sur les documents commerciaux.
- **Dépôt de marque** : faites vérifier par un conseil en propriété industrielle que le signe et le nom sont disponibles, puis déposez-les à l'OAPI (classes à choisir avec lui, par exemple 35, 36, 41 et 42).
- **Signature e-mail** : l'image du logo est chargée depuis openbaara.com ; elle s'affichera une fois le site en ligne.

## Mise à jour

Les fichiers sont générés à partir de la source du logo dans le site (`src/lib/brand.ts`). Pour changer le dessin, modifiez cette source puis lancez `npm run brand:kit` dans le projet, plutôt que de retoucher les fichiers un par un.
