# Explain Code Skill

`explain-code` is a Codex skill for concrete, plain-English explanations of
source code, algorithms, data structures, APIs, execution flows, and
implementation-oriented designs.

It teaches rather than summarizes: every imported concept is introduced by the
smallest example that makes it obvious, at the point it first carries weight,
because the writer has done the reading and the reader has not.

Before it explains, it must earn the right to explain. The skill requires the
agent to identify the current authority, trace the real mechanism end to end,
recover the counterexample or constraint that motivates it, validate teaching
examples, and distinguish specified, implemented, observed, historical, and
proposed claims. If a central claim remains unresolved, the correct output is a
specific evidence gap—not fluent guesswork or a polished page.

It helps Codex explain one complete component at a time by showing:

- the smallest concrete execution that makes the question visible and, when
  there is a failure, the exact step that fails;
- what the component receives and produces;
- the core information transformation, what remains unresolved, and how the
  direct downstream consumer uses or resolves it;
- the smallest useful data shapes;
- the algorithm in execution order, threaded through one validated anchor
  input rather than followed by a detached final example;
- the relevant state before each step, selected code path, state change,
  intermediate representation, and downstream handoff;
- what is checked locally and what belongs elsewhere;
- why non-obvious choices exist; and
- how failures, invariants, determinism, and resource costs work when relevant.

The skill favors implementation-shaped explanations over broad summaries, but
does not turn the answer into a line-by-line translation of the source.

## Explanation pages

After the understanding gate passes, an invocation produces a self-contained
HTML page, written to disk and also published as an artifact where the host
supports it. If the central mechanism cannot be established, the agent reports
what is unknown and what evidence would settle it instead of manufacturing the
page. Ask for something *quick* or *in chat* to get prose instead.

The default page is a quiet technical document: one aligned reading column,
ordinary paragraphs and lists, and code where the mechanism needs it. A visual
is optional. Side-by-side traces, span strips, timelines, charts, and tables
appear only when their geometry communicates a comparison, coverage, sequence,
magnitude, or exact mapping that prose would hide. Machine-produced text —
identifiers, records, paths, values — stays in a monospace face so it remains
visually distinct from the explanation.

The shipped stylesheet is a neutral document baseline, not a reason to add
layout. Prose stays in one aligned reading column; a comparison, table, chart,
or diagram appears only when it communicates something a paragraph or list
cannot. The assets live under [`explain-code/assets/`](explain-code/assets/).

## Reviewing a page

Every page carries a review layer. A small speech bubble sits beside each prose
paragraph, worked code example, list item, checkpoint, and figure caption. Click
the nearby bubble — or select text in that passage first to quote it — and file a
note or question directly below the text. Comments persist in `localStorage`
across reloads. When you have finished reading, **Copy for Claude** puts the
whole batch on the clipboard as markdown, identifying each passage by its
section and excerpt and quoting whatever you highlighted — paste it back into
the conversation.

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
    house-style.css       neutral document and earned-visual styles
    page-skeleton.html    prose-first starting template
    comments.js           passage-level review controls
  agents/
    openai.yaml
```
