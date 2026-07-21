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

## Install

Copy the [`explain-code`](explain-code/) directory into your Codex skills
directory, normally `~/.codex/skills/`.

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

The skill can also be selected automatically when a request clearly asks for
this kind of technical walkthrough.

## Package layout

```text
explain-code/
  SKILL.md
  agents/
    openai.yaml
```
