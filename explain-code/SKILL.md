---
name: explain-code
description: Explain source code, algorithms, APIs, data structures, execution flows, and implementation-oriented technical designs in concrete plain English. Use when a user asks for a walkthrough, mental model, line-to-system explanation, code-close design explanation, or a section-by-section account of what a component reads, does, produces, checks, and deliberately leaves to another component. Also covers turning such an explanation into an illustrated, self-contained HTML page when the user asks for diagrams, a visual, or a document to keep or share.
---

# Explain Code

Help the reader picture the program executing. Stay concrete enough that they could sketch the implementation after reading the explanation.

## Start with the component boundary

Open with one plain paragraph that answers:

```text
What does this component receive?
What does it do?
What does it produce?
```

Prefer:

> The lexer receives source bytes, scans them from left to right, and produces an ordered sequence of tokens with source positions.

Avoid:

> The frontend performs lexical analysis as part of the compilation pipeline.

The first version gives the reader objects and actions they can follow. The second names a topic without explaining it.

## Explain one section at a time

Respect the scope and pace requested by the user. If they ask about the lexer, finish the lexer and stop before the parser. If they ask for one section at a time, do not summarize the entire system first.

Treat “one section” as one complete component or topic, not as one item from the explanation workflow. Cover that component's useful input, output, execution, example, checks, and boundary in the current response. Use internal subsections when helpful, then stop before beginning the next component. Only give a single small subpart when the user explicitly asks for that subpart.

For a substantial component, use this order:

1. State its job.
2. Describe its inputs and outputs.
3. Show the smallest useful data shape.
4. Walk through the algorithm in execution order.
5. Trace one realistic example from input to output.
6. State what is checked here.
7. State what is not checked here, where it is checked, and why.
8. Explain important failures, invariants, determinism, and resource costs.

Compress or omit steps that add no value for a small function. Do not turn the order into a rigid questionnaire.

## Stay close to implementation

Use short pseudocode or simplified data shapes when prose alone would hide the mechanism:

```text
Token = kind + source range

while cursor is not at the end:
    inspect the current byte
    consume one complete token
    move cursor to the token end
```

When explaining existing code, use its real important names. Simplify incidental syntax and omit plumbing that does not affect the behavior being explained.

When explaining a design, use conceptual names unless exact names are part of the design. Make clear which representations are conceptual rather than pretending that unwritten code already exists.

Explain state changes explicitly:

- what the cursor or index points to;
- what collections contain and in what order;
- what is borrowed, copied, retained, or consumed when relevant;
- when output becomes visible;
- what happens when a step fails.

Do not merely translate code line by line. Group lines by the behavior they implement and explain why that behavior exists.

## Make responsibility boundaries explicit

Readers understand a component better when they know both its responsibility and its limits. Use this pattern when useful:

```text
Checked here:
- properties required to produce this component's output safely

Not checked here:
- properties that require information owned by a later component
```

Do not say only that something happens “later.” Name the later component and explain why it owns the decision.

Examples:

- A lexer may identify the boundary of a number while a literal checker validates its value and range.
- A parser may build syntax while name resolution decides which declaration a name denotes.
- A request handler may validate input while the database transaction enforces atomic persistence.
- A decoder may validate file structure while a domain layer validates business meaning.

## Explain reasons next to decisions

After a surprising design or implementation choice, explain its reason immediately.

Prefer:

> Tokens keep source ranges instead of copied strings. This avoids repeated allocations and preserves the exact spelling used for diagnostics.

Avoid collecting all rationale in a distant “design choices” section. The reader should not have to remember an unexplained choice for several paragraphs.

When alternatives matter, name the rejected alternative and the concrete cost it would introduce. Do not invent alternatives merely to make the explanation sound comprehensive.

## Make claims testable

Replace labels with mechanisms and observable results.

Instead of:

> The parser is deterministic.

Explain:

> At each grammar decision, the next two tokens select one table entry. The parser does not backtrack or try alternatives in priority order. Success consumes every token and produces one root node.

Apply the same rule to claims such as safe, lossless, atomic, lazy, cached, concurrent, or constant time. State what enforces the property and what a caller can observe.

If an algorithm produces one answer but that alone does not prove uniqueness or correctness, say what separate evidence or invariant is required.

## Use examples as miniature executions

Choose one small but realistic input. Show the important intermediate representation and final output, including positions or state changes when they matter.

Good examples expose boundaries and edge behavior. Avoid examples that simply repeat the happy-path prose without making the mechanism clearer.

## Use simple English precisely

- Introduce one new term at a time and define it immediately.
- Prefer concrete verbs such as reads, scans, compares, records, rejects, and emits.
- Keep paragraphs short.
- Use a compact table only for several exact mappings.
- Avoid slogans, promotional language, and unexplained jargon.
- Mention complexity only when it helps the reader understand scaling or a design choice.
- State uncertainty or inference plainly instead of smoothing over it.
- Use enough detail to make the mechanism clear, then stop.

## Deliver an illustrated page

**The page is the deliverable.** Build one every time this skill is invoked.
Everything above still applies — the figures replace none of it, they render the
parts a reader would otherwise have to reconstruct.

The one exception is an explicit override. If the request says *quick*, *just
tell me*, *in chat*, or otherwise asks for a short answer, give prose only. Do
not infer the override from a small subject: a one-function question still gets a
page unless the user asks otherwise.

### Where it goes, and what to say

Always write a self-contained `.html` file to disk, so the result is the same
whichever host this runs in, and report the path. If the host also has an
artifact or publishing tool, publish the page through it as well and give the
URL — see the two output modes under **Building it**, since the wrapper differs.

Then write the chat reply as **headline findings plus the link**: a few
paragraphs covering the conclusion, anything surprising, and anything the reader
would act on. Not a summary of the page's table of contents, and not the whole
explanation again — the page holds the detail.

### Figures that carry information

Each of these renders a rule this skill already teaches. Choose the ones the
subject actually contains; four strong figures beat ten weak ones.

| Figure | Use it for | It encodes |
|---|---|---|
| Stage map | a pipeline or multi-phase flow | execution order, and which stage is the weak one |
| Side-by-side trace | any mechanism with a boundary | where it works, where it stops, and why |
| Span strip | intervals tiling a linear domain | coverage — that the pieces tile it with no gap and no overlap |
| Before and after | a rewrite, optimization, migration, or fix | what changed and what is preserved |
| Data-shape panel | the representation the component owns | what the record holds, and what it conspicuously lacks |
| Boundary ledger | responsibility limits | checked here, versus checked elsewhere and by whom |
| Timeline | scheduling, retries, lifecycle, async, cache expiry | when things happen relative to each other |
| Chart | numbers you actually have | magnitude, and the threshold that decides something |

Reach for the **span strip** whenever the subject divides a linear thing into
pieces: lexer tokens over source, parser ranges, buffer regions, struct field
offsets, byte protocol fields, diff hunks. A `<pre>` cursor trace reads as a log
and never actually shows the coverage claim; the strip does, at a glance.

The stylesheet ships four more components the table does not name, because they
are page furniture rather than figures: `.gates` for constraints that sit outside
a sequence, `.keys` for headline figures, `.tiers` for ranked options, and
`blockquote` for a real quotation. `.keys` is for any exact, load-bearing value —
a measured time, but equally a count taken from the code, such as how many
variants an enum has.

**The side-by-side trace is the highest-value figure for code, and it is the one
to reach for first.** Two panels is the usual shape and three fit; more than
three stops being a comparison. Run the *same* mechanism on two inputs — one it handles and
one it does not — in two panels, using the real identifiers and the real
intermediate values, and end each panel with a verdict line. A reader learns more
from watching one relation succeed and fail than from any amount of description.

```text
┌── two calls ────────────── PROVED ───┐  ┌── one loop ────────── CANNOT ASK ───┐
│ 'a → { root: pool, fields: [0] }     │  │ out[i] → { root: out, fields: [] }  │
│ 'b → { root: pool, fields: [1] }     │  │ out[j] → { root: out, fields: [] }  │
│                                      │  │                                     │
│ prefix test: neither is a prefix     │  │ the index never reaches the test     │
│ → independent, constant time         │  │ → identical place; even [0] vs [1]   │
└──────────────────────────────────────┘  └──────────────────────────────────────┘
```

Every panel ends in a conclusion. A box with data and no verdict is decoration.

### Let the typography separate the two voices

Set everything the machine produced — identifiers, records, IR, file paths, field
names, measured values — in the monospace face, and the human argument in the
prose face. Hold that split everywhere, including inside headings and captions.
The reader can then tell at a glance whether they are reading a claim or an
observation, which is exactly the distinction the rest of this skill is about.

### Captions state the reason, not the contents

Prefer:

> **Figure 3.** `ResolvedPlace` holds struct field ordinals and no index component,
> so the overlap test cannot form the element-disjointness question, let alone
> answer it.

Avoid:

> **Figure 3.** The overlap relation applied to two cases.

The first tells the reader what to take away. The second makes them derive it
again from a figure they have already looked at.

### What not to do

- Do not add a figure that only restates an adjacent paragraph.
- Do not number sections unless the numbering is true — a real sequence, a
  version order, a ranked list. Decorative `01 / 02 / 03` markers claim an order
  the content does not have. A repeated `§` on every heading is the same defect;
  when nothing is a sequence, drop the `.num` span entirely.
- Do not plot an estimate as though it were a measurement. Label inferred values
  as inferred, in the figure itself, and say what would settle them.
- Do not use emoji as section markers or status icons.
- Do not invent structure the code lacks. If the component has three stages, the
  page has three, not a rounder number.

### Building it — one fixed house style

This skill is installed from the `explain-code-skills` repository; the copy under
`assets/` next to this file is the one to use. If the assets named below are
missing, the installed copy is stale — say so rather than improvising a
substitute.

The visual identity is settled and shipped. Do not design a new one per subject:
these pages are one series, and a reader should recognize the second at a glance.

Write only the body — the masthead, the sections, the footer — and let the
shipped script add everything else. Do not retype 30 KB of CSS and JS into a
file-writing tool:

```sh
assets/assemble.sh "Page title" body.html out.html
assets/assemble.sh body.html out.html          # title taken from the body's <h1>
```

It refuses a body that already contains a doctype, so an assembled page cannot
be fed back in by mistake.

The files next to this one:

```text
assets/assemble.sh          builds a standalone page from a body fragment
assets/house-style.css      tokens, type, and every component
assets/comments.js          the review layer
assets/page-skeleton.html   markup for each component; copy from here
```

**The two output modes differ, and one file cannot serve both.** A standalone
file needs the doctype, `<head>`, charset, and viewport that `assemble.sh` adds —
without charset the page's own punctuation is at the server's mercy, and without
viewport the stylesheet's breakpoints never fire on a phone. A page published
through a host that supplies its own shell (Claude Code's Artifact tool) must
omit that wrapper and pass the body plus an inline `<style>` and `<script>`,
since the host wraps it. When you do both, build the standalone file with
`assemble.sh` and publish the unwrapped form.

Two rules about the stylesheet. **Do not re-derive or re-validate the palette** —
its light and dark steps already pass the lightness band, chroma floor,
colorblind separation, normal-vision, and contrast checks. And do not restyle
components per page; if a subject genuinely needs a figure the sheet lacks, add
it in the sheet's idiom rather than inventing a local look.

The page must stay self-contained — no external fonts, scripts, stylesheets, or
images — because it may be read where network requests are blocked. Give wide
content its own `overflow-x: auto` container so the body never scrolls sideways.

If the host provides design or data-visualization skills, load them before
writing markup or chart code and follow them where they do not conflict with the
house style; where they do, the house style wins, since consistency across the
series is the point.

### Ship the review layer

`assets/comments.js` lets the reader attach a note or a question to any section
or figure, keeps them in `localStorage` across reloads, and exports the batch as
markdown through a **Copy for Claude** button so it can be pasted straight back
into a conversation. Selecting text before commenting quotes that text in the
export.

Include it on every page. It declares no artifact capabilities and makes no
network requests, so a local file and a published artifact behave identically —
and no runtime capability exists that could post back into a conversation, so the
clipboard is the handoff. Tell the user in the chat reply that the page is
commentable and how to send the comments back.

**Give every page a distinct `<title>`.** Comments are keyed on title plus path,
and every published artifact shares one origin, so two pages that share a title
and a path would share one comment set. Retitling a page also orphans the
comments already filed against it.

## Check the explanation before sending

Verify:

- Can the reader trace one input through the component?
- Did I show the important representation instead of only naming abstractions?
- Did I follow execution order?
- Did I explain why the non-obvious choices exist?
- Did I say what is checked and what is left elsewhere?
- Did I explain how claimed properties are achieved?
- Did I stay within the requested section?

And for the page:

- Does every figure carry something the prose does not?
- Does every trace panel end in a verdict?
- Is each structural device — numbering, ordering, grouping — true of the content?
- Is every inferred or estimated number labeled as one?
- Was the page built with `assemble.sh` (or, in artifact mode, assembled to match), rather than by hand?
- Did I write the file to disk, report its path, and publish it if the host can?
