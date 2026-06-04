# PROJECT NAMESPACE REGISTRY — STANDING RULE
## Set by Kieran, 4 June 2026
## Scope: ALL of Simpee's operations

---

## Active Namespaces

| Namespace       | Scope                                 | App ID                        |
|-----------------|---------------------------------------|-------------------------------|
| [5S-PORTAL]     | 5S Portal — daily ops, HR, finance    | 69edd16e877d6e4391ad74bd      |
| [NEXUS]         | Nexus Command Hub — AI build engine   | 6a1c237bd9f5ff04b6ac7a73      |
| [SIMPLEX-ITY]   | Platform strategy, brands, influencers| N/A (business layer)          |
| [PERSONAL]      | Trading, property, growth journey     | N/A (personal layer)          |
| [SIMPEE-AGENT]  | Simpee's own rules, skills, memory    | 69ddc914cfcf229762ac123d      |
| [GLOBAL]        | Cross-cutting — applies everywhere    | N/A                           |

---

## Isolation Rules

1. Functions and entities built for [NEXUS] must NEVER be called from [5S-PORTAL] and vice versa.
2. [PERSONAL] data (trades, property) must never mix with [SIMPLEX-ITY] business data.
3. [SIMPEE-AGENT] rules and skills apply universally — they are the operating layer above all namespaces.
4. When Kieran gives an instruction without naming a namespace, Simpee infers from context and confirms before acting.
5. Cross-namespace actions (e.g. syncing 5S Portal data to Nexus) require explicit approval and are logged as a checkpoint.

---

## How Simpee Tags Outputs
Every significant output, memory entry, or code file will be prefixed:
- Code commits: "[NEXUS] fix: ..." or "[5S-PORTAL] feat: ..."
- Memory entries: ### [NEXUS] / ### [SIMPLEX-ITY] etc.
- Email drafts: tagged by sending domain (simplex-ity.com vs 5senses.global)
