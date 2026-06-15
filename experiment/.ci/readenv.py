#!/usr/bin/env python3
# Read one key from a dotenv file (e.g. `vercel env pull` output) robustly,
# regardless of quoting/`export`/whitespace. Prints the value (no newline) or
# nothing. Usage: readenv.py KEY [path]   (path defaults to /tmp/env.prod)
import sys

key = sys.argv[1]
path = sys.argv[2] if len(sys.argv) > 2 else "/tmp/env.prod"
out = ""
try:
    for line in open(path):
        s = line.strip()
        if not s or s.startswith("#") or "=" not in s:
            continue
        if s.startswith("export "):
            s = s[len("export "):]
        k, v = s.split("=", 1)
        if k.strip() != key:
            continue
        v = v.strip()
        if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
            v = v[1:-1]
        out = v
        break
except FileNotFoundError:
    pass
sys.stdout.write(out)
