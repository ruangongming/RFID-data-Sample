# Website Giả Lập Simple RFID

## Vision
Internal testing tool for Simple RFID system. Simulates data input from ERP/WMS systems via 4 API integrations: Print Jobs, Stock Out, Stock In, and Audit Sessions. Target users: QA engineers, system integrators, demo teams.

## Design
Technical utility aesthetic inspired by monitoring dashboards and developer consoles.

Colors (HSL format):
- `--primary: 215 25% 27% (deep slate)` - Technical reliability
- `--accent: 38 92% 50% (amber)` - Status highlights, warnings
- `--muted: 220 13% 91% (cool gray)` - Subtle backgrounds
- `--background: 0 0% 100% (white)` - Clean workspace
- `--foreground: 222 47% 11% (dark slate)` - Text

Fonts:
- Heading: IBM Plex Sans (600, 700) - Technical clarity
- Body: Rubik (400, 500) - Readable, friendly
- Mono: JetBrains Mono (400, 500) - Code/JSON display

Style: Clean forms with clear hierarchy, monospace for technical data, status badges, tabular layouts for item lists.

## Features
1. **Print Job Creator** - Form to create print/encode sessions with label list
2. **Stock Out Form** - Generate warehouse exit notes with asset tracking
3. **Stock In Form** - Generate warehouse entry notes with EPC data
4. **Audit Session** - Create inventory audit sessions with asset lists
5. **History Log** - View all created sessions with status tracking