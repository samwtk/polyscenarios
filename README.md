# Turnkey Policy Dropdown Wizard

This project is now organized into a cleaner static-web structure.

## Directory Layout

```text
.
├── index.html
├── assets
│   ├── css
│   │   └── styles.css
│   └── js
│       └── app.js
└── README.md
```

## What Goes Where

- `index.html`: UI markup and page structure only.
- `assets/css/styles.css`: all styling for the wizard and output panels.
- `assets/js/app.js`: all application logic (dropdown dependencies, policy generation, Mermaid rendering, PNG export).

## Run Locally

From this directory:

```bash
python3 -m http.server 8000
```

Then open:

`http://127.0.0.1:8000`
