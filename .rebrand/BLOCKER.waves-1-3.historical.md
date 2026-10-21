# Rebrand blocked before editing

- Checked: 2026-10-19T17:04:22.614Z
- Reason: all checked candidates failed X or .xyz availability
- Browser: chrome-cdp Chrome/155.0.8059.80
- Proxy: direct

| Candidate | .xyz | X | Verdict |
|---|---|---|---|
| **keyscope** | taken | skipped | fail |
| **keybreak** | taken | skipped | fail |
| **cipherix** | taken | skipped | fail |
| **lattiva** | available | taken | fail |
| **qubira** | taken | skipped | fail |
| **quvora** | taken | skipped | fail |
| **shorline** | taken | skipped | fail |
| **keymark** | taken | skipped | fail |
| **quoril** | taken | skipped | fail |

No project files were edited. Generate the next naming wave if candidates were exhausted:

```bash
python "<skill>/scripts/name.py" --project "<project>" --out "<project>/.rebrand" --count 60 --wave 2
node "<skill>/scripts/check.mjs" --project "<project>" --out "<project>/.rebrand" --top 10
```

If the environment is offline, configure a working proxy or network and rerun the Chrome check. Never pick an unverified name.
