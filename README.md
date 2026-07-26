# Explain Code Skill

`explain-code` is a Codex skill for concrete, plain-English explanations of
source code, algorithms, data structures, APIs, execution flows, and
implementation-oriented designs.

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

Prose is the default. When you ask for a diagram, a visual, or a document to keep
or share, the skill instead builds a single self-contained HTML page and applies a
figure taxonomy in which each figure renders one of the rules above: a stage map
for execution order, a side-by-side trace for a mechanism's boundary, a
before-and-after for a rewrite, a data-shape panel for the representation, a
boundary ledger for responsibility limits, a timeline for ordering, and a chart
only for numbers that were actually measured.

The page keeps machine-produced text — identifiers, records, paths, values — in a
monospace face and the argument in a prose face, so a reader can tell a claim from
an observation at a glance.

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
  agents/
    openai.yaml
```
