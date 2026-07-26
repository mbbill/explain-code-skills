# Explain Code Skill

`explain-code` is a Codex skill for concrete, plain-English explanations of
source code, algorithms, data structures, APIs, execution flows, and
implementation-oriented designs.

It teaches rather than summarizes: every imported concept is introduced by the
smallest example that makes it obvious, at the point it first carries weight,
because the writer has done the reading and the reader has not.

It helps Codex explain one complete component at a time by showing:

- what the component receives and produces;
- the smallest useful data shapes;
- the algorithm in execution order;
- a realistic input-to-output example;
- what is checked locally and what belongs elsewhere;
- why non-obvious choices exist; and
- how failures, invariants, determinism, and resource costs work when relevant.

The skill favors implementation-shaped explanations over broad summaries, but
does not turn the answer into a line-by-line translation of the source.

## Illustrated pages

Every invocation produces a self-contained HTML page, written to disk and also
published as an artifact where the host supports it. Ask for something *quick* or
*in chat* to get prose instead.

Each figure renders one of the rules above: a stage map for execution order, a
side-by-side trace for a mechanism's boundary, a before-and-after for a rewrite,
a data-shape panel for the representation, a boundary ledger for responsibility
limits, a timeline for ordering, and a chart only for measured numbers. The page
keeps machine-produced text — identifiers, records, paths, values — in a
monospace face and the argument in a prose face, so a reader can tell a claim
from an observation at a glance.

The visual identity is fixed rather than designed per subject, so a set of pages
reads as one series. It ships as a stylesheet, a component skeleton, and a review
script under [`explain-code/assets/`](explain-code/assets/).

## Reviewing a page

Every page carries a review layer. Hover any section or figure for **+ comment**,
or select text first to quote it, and file a note or a question. Comments persist
in `localStorage` across reloads. When you have finished reading, **Copy for
Claude** puts the whole batch on the clipboard as markdown, grouped by section
and quoting whatever you highlighted — paste it back into the conversation.

It declares no artifact capabilities and makes no network requests, so a local
file and a published artifact behave identically.

## Install

Copy the [`explain-code`](explain-code/) directory into your agent's skills
directory:

```sh
# Codex
cp -R explain-code ~/.codex/skills/

# Claude Code
cp -R explain-code ~/.claude/skills/
```

## Use

Invoke the skill explicitly with `$explain-code`. For example:

```text
Use $explain-code to walk me through this parser one section at a time.
```

```text
Use $explain-code to explain how this cache handles a miss, including the
state changes and failure behavior.
```

```text
Use $explain-code to explain this proposed lexer design close enough to
implementation that I can picture the data structures and scan loop.
```

```text
Use $explain-code to explain this scheduler as a page, with diagrams.
```

The skill can also be selected automatically when a request clearly asks for
this kind of technical walkthrough.

## Package layout

```text
explain-code/
  SKILL.md
  assets/
    house-style.css       tokens, typography, and every figure component
    page-skeleton.html    markup for each component; the starting template
    comments.js           the review layer
  agents/
    openai.yaml
```
