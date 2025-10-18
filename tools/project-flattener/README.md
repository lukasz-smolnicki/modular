# Project Flattener (preset: modular)

To narzędzie tworzy paczki tekstowe z zawartością plików Twojego repo.
Preset **modular** dzieli wynik na: `.github`, `api`, `mobile`, `web`, `packages`, `root`.
Szanuje `.gitignore`.

## Instalacja (w repo):
1. Skopiuj folder `tools/project-flattener` do katalogu głównego repo.
2. W głównym `package.json` dodaj skrypty:
```json
{
  "scripts": {
    "bundle:modular": "node tools/project-flattener/index.js --preset modular -O bundles",
    "bundle:all": "node tools/project-flattener/index.js -o bundles/all.txt"
  }
}
```
3. Dodaj do `.gitignore` (w root):
```
/bundles/
```

## Użycie
- 6 paczek: `.github`, `api`, `mobile`, `web`, `packages`, `root`:
```
npm run bundle:modular
```
- Jeden plik ze wszystkim:
```
npm run bundle:all
```

## GitHub Desktop – szybki PR
1. Otwórz repo w GitHub Desktop → **Current branch → New branch...** i nazwij np. `chore/tools-project-flattener`.
2. Skopiuj folder `tools/project-flattener` oraz zaktualizuj `package.json` i `.gitignore` jak powyżej.
3. W GitHub Desktop zobaczysz zmiany. Wpisz komunikat commita:
   - **Commit title:** `chore(tools): add project-flattener + bundle scripts`
   - **Description:** `Preset modular (.github, api, mobile, web, packages, root); respects .gitignore; outputs to /bundles.`
4. Kliknij **Commit to ...** → **Push origin** → **Create Pull Request**.

## Bezpieczeństwo
Przed wklejeniem bundli do czata rozważ dodatkowe wykluczenia:
```
**/*.env, **/.env*, **/*.pem, **/*.key
```
Możesz dodać je tymczasowo flagą `-x`:
```
node tools/project-flattener/index.js --preset modular -O bundles -x "**/*.env,**/.env*,**/*.pem,**/*.key"
```
