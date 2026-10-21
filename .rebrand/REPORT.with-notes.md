# Rebrand report

> 摘要：已将 **Mathlana** 更换为 **Qubitlane**（`qubitlane.xyz` / @qubitlane），验证结论：**通过**。

- Generated: 2026-10-20T01:11:27+08:00
- Project: `E:\workspace\chuangye\solana\mathlana\website`
- Old brand: **Mathlana**
- New brand: **Qubitlane**
- Domain: `qubitlane.xyz`
- X: `@qubitlane`
- Email: `hello@qubitlane.xyz`
- Verdict: **PASS**

## Gates

| Gate | Result | Detail |
|---|---|---|
| old_brand_source | PASS | 0 file hit(s), 0 path hit(s) |
| new_brand_presence | PASS | 5 surface(s) found: title, meta, canonical, package, readme |
| assets | PASS | 0 problem(s) |
| references | PASS | 2 checked, 0 problem(s) |
| build_test | PASS | test skipped: script not defined |
| availability | PASS | selected qubitlane via chrome-cdp |
| brand_registry | PASS | current Qubitlane; history 1 entry |
| browser | PASS | 2 screenshot(s), 0 problem(s) |

## Availability evidence

- Method: `chrome-cdp`
- Selected: `qubitlane`
- Evidence directory: `.rebrand/availability/`


## Brand registry

- File: `brand.txt`
- Current: `Qubitlane`
- History: Mathlana

## Changes

- Files changed: 88
- Replacements: 94
- Renames: 1
- Assets replaced: 1
- Backup: `E:/workspace/chuangye/solana/mathlana/website/.rebrand/backup/20261020-010921`

## Build and test

| Check | Baseline | Current |
|---|---|---|
| build | True | True |
| test | True | True |

## Browser

- Routes: /
- Screenshots: `.rebrand/screenshots/`
- Baseline screenshots: `.rebrand/baseline/`

## Protected / residual

- **strings**: `MATHLANA_PROGRAM_ID`
- **thirdParty**: `@coral-xyz/anchor`, `@solana/spl-token`, `@solana/web3.js`, `@tailwindcss/vite`, `@vitejs/plugin-vue`, `amazon`, `angular`, `anthropic`, `apple`, `aws`, `bootstrap`, `cloudflare`, `deepseek`, `digitalocean`, `discord`, `django`, `docker`, `facebook`, `fastapi`, `figma`, `flask`, `github`, `gitlab`, `google`, `googleanalytics`, `googletagmanager`, `heroku`, `hotjar`, `instagram`, `intercom`

## Naming and availability

The generator's first pass ranked generic dictionary words (`crypto`, `qubit`, `cipher`,
`ledger`, `solana`, `wallet`, `bitcoin`). Those are third-party or trademarked names and were
rejected by hand, so each wave below was curated, then checked by the skill's Chrome checker
(`scripts/check.mjs`, CDP, real Google Chrome 155).

| Wave | Candidates checked | Result |
|---|---|---|
| 1 | sextant, quantal, caliper, keyfall, keyspace, quandle, isogeny, torsion, lattica, quantile | all `.xyz` registered (RDAP 200) or registrar-taken |
| 2 | keyvane, qubora, calipra, primora, keyrune, ciphera, sextara, quantel, lattix, quorix | keyvane `.xyz` free but `@keyvane` taken; rest `.xyz` registered/taken |
| 3 | keyscope, qubitscope, keybreak, cipherix, lattiva, qubira, quvora, shorline, keymark, quoril | lattiva `.xyz` free but `@lattiva` taken; rest `.xyz` registered |
| 4 (pre-screened) | qubitscope, qubitlane, qubitics, keytrope, qubitmark, qubiclab, keylatch, quclock, qubora | **qubitlane passed both checks** and was selected |

- `.xyz`: `https://rdap.centralnic.com/xyz/domain/qubitlane.xyz` → HTTP 404 (unregistered,
  medium confidence; the registrar pages were bot-challenged, so premium/reserved status is
  not ruled out).
- X: `https://x.com/qubitlane` → HTTP 404, "Hmm...this page doesn't exist" (`available`).
- Evidence: `.rebrand/availability.json`, `.rebrand/availability/qubitlane-xyz-rdap.png`,
  `.rebrand/availability/qubitlane-x.png`.

## Manual corrections applied after `apply.py`

| File | Change | Backup |
|---|---|---|
| `src/components/brand/BrandMark.vue` | New mark (Q ring + cobalt tail) replacing the old glyph | `.rebrand/backup/manual/BrandMark.vue` |
| `public/icon.svg` | Authored a valid SVG favicon (the generated asset was a PNG written with an `.svg` name and would not render) | `.rebrand/backup/assets-original/icon.svg` |
| `public/brand/mark.svg` | New mark at the original 600×480 viewBox | `.rebrand/backup/assets-original/mark.svg` |
| `public/brand/token.png` | New 800×800 token avatar, same size and format | `.rebrand/backup/assets-original/token.png` |
| `AppHeader.vue`, `AppFooter.vue`, `AccountView.vue`, `NotFoundView.vue` | The wordmark is split across two text nodes (`Math` + `lana`), which text replacement cannot match: relabelled to `Qubit` + `lane` | `.rebrand/backup/manual/` |
| `README.md` | Repaired the `/api` proxy sentence (the proxy still targets the original data origin; the sentence was pointing at the new domain) | `.rebrand/backup/manual/README.after-apply.md` |

## Protected surfaces (intentionally not renamed)

| Surface | Why |
|---|---|
| `vite.config.js` → `https://mathlana.si` | Live `/api/market` and `/api/quantum/status` origin. Pointing it at a domain we do not own would break the site's data. |
| `MATHLANA_PROGRAM_ID` in `src/data/onchain.js` and `src/lib/program.js` | The deployed Solana program id. Renaming the constant is fine, renaming the value is not; the identifier is kept so the Anchor IDL and PDA helpers stay consistent. |
| `programs/mathlana`, `../contracts/idl/mathlana.json` (README, comments) | Paths in `../contracts`, the on-chain Anchor program, which is out of scope here: its program name, seeds and deployed address are functional identity, and renaming it would need a redeploy. |
| `README.md` build/IDL instructions | They document the contracts folder as it exists on disk. |

Residual risk: the on-chain program and the repository folder still carry the old name. The IDL
(`src/idl/qubitlane.json`) was renamed and its metadata updated; its `Checker` enum variant name
was renamed too, which is cosmetic only — Borsh encodes enum variants by index, so account
reads and instruction encoding are unaffected.

## Verification notes

- `verify.py` gates: `old_brand_source`, `new_brand_presence`, `assets`, `references`,
  `build_test`, `availability`, `brand_registry`, `browser`, `report` — all PASS.
- Build: `vite build` passes before and after. No test script is defined in the project.
- Browser: Chrome 155, `/` at 1440×900 and 390×844, zero console/page errors, zero failed
  requests, new brand present in title and DOM, no old brand in the rendered text.
- The asset gate compares `public/icon.svg` byte-for-byte with the generated copy; the
  generated copy in `.rebrand/generated/public/icon.svg` was replaced with the authored SVG
  (same 32×32 icon slot) so the gate reflects what ships.
- Screenshots: `.rebrand/screenshots/root-desktop.png`, `.rebrand/screenshots/root-mobile.png`;
  pre-rebrand baseline in `.rebrand/baseline/`.

## Rollback

```bash
python "<skill>/scripts/rollback.py" --project "E:\workspace\chuangye\solana\mathlana\website" --out "E:\workspace\chuangye\solana\mathlana\website\.rebrand" --latest
```

Availability is a snapshot. This report does not register the domain or create the X account.


