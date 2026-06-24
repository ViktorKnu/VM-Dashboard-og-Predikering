# ML Workspace

Denne mappen er reservert for mer produksjonsrettet ML-arbeid:

- `features/`: feature extraction og normalisering.
- `training/`: scripts for modelltrening.
- `inference/`: pakkede prediksjonsgrensesnitt.
- `evaluation/`: backtesting, kalibrering og metrikker.
- `notebooks/`: utforskende notebooks.

API-et bruker nå en deterministisk modellregistry i `apps/api/app/services/prediction.py` med fire nivåer: enkel, land, avansert og ekspert. Ekte historisk trening skal legges her når Fjelstul/FIFA-data er importert og backtesting er klar.

