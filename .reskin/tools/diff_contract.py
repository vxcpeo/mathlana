import json
from pathlib import Path

a = json.loads(Path(r"E:\workspace\chuangye\solana\mathlana\website\.reskin\baseline\content-contract.json").read_text(encoding="utf-8"))
b = json.loads(Path(r"E:\workspace\chuangye\solana\mathlana-baseline\website\.reskin\content-contract.json").read_text(encoding="utf-8"))

for key in ("visibleText", "hiddenText", "attributes", "bindings", "events", "links", "assets", "forms"):
    am = {(x.get("value") or x.get("name", "") + "=" + str(x.get("value")) or x.get("expr") or x.get("handler") or x.get("target") or x.get("tag")): x.get("count") for x in a.get(key, [])}
    bm = {(x.get("value") or x.get("name", "") + "=" + str(x.get("value")) or x.get("expr") or x.get("handler") or x.get("target") or x.get("tag")): x.get("count") for x in b.get(key, [])}
    only_a = {k: v for k, v in am.items() if bm.get(k, 0) != v}
    only_b = {k: v for k, v in bm.items() if am.get(k, 0) != v}
    if only_a or only_b:
        print("==", key)
        for k, v in list(only_a.items())[:20]:
            print("  frozen:", repr(k)[:90], v, "-> recon:", bm.get(k))
        for k, v in list(only_b.items())[:20]:
            print("  recon :", repr(k)[:90], v, "-> frozen:", am.get(k))
print("meta a:", a.get("meta"))
print("meta b:", b.get("meta"))
