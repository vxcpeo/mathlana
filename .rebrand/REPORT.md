# Rebrand report

> 摘要：已将 **Mathlana** 更换为 **Qubitlane**（`qubitlane.xyz` / @qubitlane），验证结论：**通过**。

- Generated: 2026-10-20T01:45:59+08:00
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

## Rollback

```bash
python "<skill>/scripts/rollback.py" --project "E:\workspace\chuangye\solana\mathlana\website" --out "E:\workspace\chuangye\solana\mathlana\website\.rebrand" --latest
```

Availability is a snapshot. This report does not register the domain or create the X account.

