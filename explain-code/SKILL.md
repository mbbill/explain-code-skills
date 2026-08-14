---
name: explain-code
description: Explain source code, algorithms, APIs, data structures, execution flows, and implementation-oriented technical designs in concrete plain English. Use when a user asks for a walkthrough, mental model, line-to-system explanation, code-close design explanation, or a section-by-section account of what a component reads, does, produces, checks, and deliberately leaves to another component. Also covers turning such an explanation into a readable, self-contained HTML page when the user asks for diagrams, a visual, or a document to keep or share.
---

# Explain Code

Help the reader picture the program executing. Stay concrete enough that they could sketch the implementation after reading the explanation.

## Earn the right to explain

Do not draft while you are still discovering the subject. Treat an explanatory
source document as a set of claims to verify, not as authority merely because it
is the requested document. Begin prose only after the understanding gate below
passes for each topic.

1. **Identify the authority.** Find the project's current normative source and
   current-status source first. Use the active implementation, tests, and actual
   output as evidence of what is built and observed; they do not silently
   override a specification. Use design notes, commits, archived experiments,
   and secondary explanations only for the version or rationale they actually
   describe. For external contracts, use the official specification or
   documentation. If authorities disagree, report the discrepancy instead of
   choosing a convenient story.
2. **Reconstruct the mechanism.** Trace the smallest concrete input through real
   representations, state changes, calls, checks, and output or failure. For a
   cross-layer or performance claim, continue through lowering, the backend fact
   consumer, and observed output; a frontend invariant alone is not the mechanism.
3. **Recover the reason at the level asked.** Reproduce the failure, counterexample,
   or constraint. A question about a definition or design choice needs the real
   alternatives and rationale, not merely an example of the chosen semantics.
   Know whether that rationale is current, historical, inferred, or unrecorded.
4. **Validate every teaching example.** Prefer an existing accepted test or
   example. Make it expose the non-obvious distinction; an accepted example that
   assumes the conclusion teaches nothing. Otherwise run it through the parser,
   compiler, test, or reference implementation. Confirm a negative fails for the
   claimed reason, recalculate numeric traces, and label unexecutable examples as
   pseudocode or conceptual rather than accepted syntax or observed behavior.
5. **Keep a claim ledger while researching.** For every central non-obvious
   claim, record its supporting specification passage, implementation location,
   test, run, output, or official external source, plus whether the claim is
   *specified*, *implemented*, *observed*, *historical*, or *proposed*. A
   historical result does not establish current behavior; a proposal does not
   establish an implementation. Expose the status at the point where it
   changes; a footer disclaimer cannot turn a current-tense description of a
   historical mechanism into an accurate explanation. The ledger may stay
   private, but the evidence must exist.

Before drafting, be able to answer without guessing: What exact problem occurs?
What exact mechanism handles it? Why does that mechanism work? What are its
limits and responsibility boundaries? What is true in the current system, and
what belongs only to a past experiment or future design? Has the example been
validated?

If a central answer remains unresolved after reasonable in-scope investigation,
stop before drafting that topic. Do not bridge the gap with fluent prose,
`likely`, `should`, or an unlabeled inference. State the exact unknown, the
evidence checked, any conflict found, and what source, test, or owner decision
would settle it. For a multi-topic request, explain only the independent topics
whose gates pass and identify the omitted topics; do not publish a document that
implies full coverage.

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

Before implementation detail, state one compact mental model of the component's transformation. Name what information it adds, removes, preserves, or deliberately leaves unresolved; why that boundary exists; and how the direct downstream consumer uses or resolves the result. This is not a slogan or a restatement of input/work/output. It is the smallest accurate abstraction that lets the reader organize every detail that follows.

> Terminal classification attaches candidate grammar labels to each lexer token. It preserves overlapping possibilities because the concrete parse tree does not exist yet; the parser later selects the label admitted at that grammar position when building a successful derivation.

Do not make the reader infer this model from the walkthrough. State it directly, then let the validated example prove and refine it.

## Explain one section at a time

Respect the scope and pace requested by the user. If they ask about the lexer, finish the lexer and stop before the parser. If they ask for one section at a time, do not summarize the entire system first.

Treat “one section” as one complete component or topic, not as one item from the explanation workflow. Cover that component's useful input, output, execution, example, checks, and boundary in the current response. Use internal subsections when helpful, then stop before beginning the next component. Only give a single small subpart when the user explicitly asks for that subpart.

For a substantial component or design, build a textbook-style argument in this order:

1. State the component boundary and the question this section answers.
2. State the core mental model in plain language: the information transformation, any choice left unresolved, and how the direct consumer resolves or uses it.
3. Begin with the smallest literal execution that makes the question concrete.
   If the topic exists to prevent a failure or unsafe rewrite, show the input, the tempting path, and the resulting failure, ambiguity, or changed answer.
4. Point to the decisive step in plain English. For a failure, say something as direct as: “See: only the grouping changed, but the result changed from 4 to 6.” Name the general concept only after the reader has seen it happen.
5. If there is a real design choice, explain the obvious or existing approach, the exact point where it stops working, and the realistic options with their tradeoffs. Omit this step for a straightforward mechanism; never invent a failure or competing option to fill the template.
6. State what the code or design does and explain why next to any non-obvious choice.
7. Describe its inputs, outputs, and smallest useful data shape.
8. Choose one validated anchor example, then walk through the mechanism in execution order with that same input present at every consequential step.
9. State what is checked here, what is checked elsewhere and why, then cover important failures, invariants, evidence, resource costs, and limitations.

The causal thread matters more than the headings: question → mental model →
concrete execution → mechanism → consequence. When there is a design fork, make the middle explicit:
problem → choices → decision. Compress or omit steps that add no value for a
small function. Do not manufacture alternatives, repeat the same fact under
several headings, or turn the order into a rigid questionnaire.

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

## Let the reader see the problem before naming it

When a section has a “problem” part, put its smallest concrete example or
counterexample there, not several screens later in a figure or evidence section.
A generic description followed by a list of options asks the reader to infer
the failure for themselves.

Prefer:

```text
serial left fold:  ((10 - 3) - 2) - 1 = 4
split into pairs:  (10 - 3) - (2 - 1) = 6
```

> See the problem: splitting the work changed only the grouping, yet the answer
> changed from `4` to `6`. Therefore a compiler cannot split an arbitrary fold
> into independent chains. It first needs evidence that this operation permits
> regrouping; that property is called associativity.

Avoid opening with two abstract paragraphs about “loop-carried dependencies”
and “required algebra,” then moving straight to the options. The terms may be
correct, but the reader has not yet seen why they matter.

Use a diagram only if the spatial relationship adds something to the literal
example. Often three lines of code or arithmetic plus one “See the problem”
paragraph teach more than a large visual.

## Thread one example through the execution

For a multi-step component, choose one small, validated anchor input before the detailed walkthrough. Do not explain the whole mechanism abstractly and append an input-to-output example afterward: the example is the walkthrough. Make it exercise several responsibilities without becoming a full-program distraction, preferably by reusing an existing test whose intermediates can be checked.

At every consequential step, show the useful subset of: state before; the real function, match arm, table entry, or condition selected; bytes or records consumed and state changed; the resulting representation; and what the next iteration or direct consumer receives. Track exact ranges, counters, collection contents, ownership, retention, or publication only when they explain the behavior. Use a compact trace table when those fields repeat, and omit helpers that do not affect the observed change.

Label conceptual data shapes as conceptual. Carry the anchor through multiple passes, staged publication, and failure-atomic boundaries instead of collapsing them into one arrow. When claiming losslessness, ordering, identity preservation, or atomicity, reconstruct that property from the intermediates, then show which fields the direct downstream consumer reads, skips, and keeps reachable. Avoid final-output-only examples or a fresh input at every step.

## Teach every concept you import, where you first use it

You did the reading. The reader did not. By the time you write, a term you met an hour ago feels like shared vocabulary, so you drop it into a sentence unexplained and move on — and the reader stops there, because a step your argument rests on was opaque to them. This is the most common way a technically correct explanation fails.

The rule: **the first time a concept carries weight, teach it with the smallest example that makes it obvious.** Not a definition — an example. Definitions are how you record something the reader can already picture.

Prefer:

> Splitting a sum across cores regroups the additions, and floating-point addition is not associative:
>
> ```text
> (1e20 + -1e20) + 1.0  =  1.0
> 1e20 + (-1e20 + 1.0)  =  0.0     ← 1.0 is too small to survive beside 1e20
> ```
>
> Same numbers, different grouping, answers differing by the whole value.

Avoid:

> Strict IEEE semantics forbid the reassociation a parallel reduction requires.

The second sentence is true, shorter, and useless to anyone who did not already know it. The first costs five lines and leaves the reader able to rebuild the argument without you.

This applies to imported jargon (*prefix sum*, *loop-carried dependence*, *may-alias*, *span*, *arithmetic intensity*), to named results you are leaning on, and to any acronym carried over from a source. If a term is in your explanation only because it was in your reading, either teach it or cut it.

Two habits that catch the failure:

- Reread the draft as someone who has not seen your sources. Every sentence that would make them stop marks a missing example.
- Derive numbers instead of asserting them. "One core already wants 70 GB/s while the whole chip supplies 103" earns its conclusion; "these kernels are memory-bound" asks to be believed.

## Use simple English precisely

- Introduce one new term at a time and define it immediately.
- Prefer concrete verbs such as reads, scans, compares, records, rejects, and emits.
- Keep paragraphs short.
- Use a compact table only for several exact mappings.
- Avoid slogans, promotional language, and unexplained jargon.
- Mention complexity only when it helps the reader understand scaling or a design choice.
- State uncertainty or inference plainly instead of smoothing over it.
- Use enough detail to make the mechanism clear, then stop.

## Deliver a readable page

**After the understanding gate passes, the page is the deliverable.** Build one
every time this skill is invoked. Everything above still applies. A page may
contain no figures at all; prose, lists, code, and small exact tables are often
the clearest explanation. A blocker or abstention report is not a page
deliverable; do not manufacture a page merely to satisfy this section.

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

### Choose a visual by the information it adds

Start with prose or a normal list. Before adding a table, chart, diagram, panel,
or multi-column layout, ask:

> What fact or relationship becomes easier to see here than in a paragraph or
> list?

If the answer is only “these items look grouped” or “the page looks designed,”
do not add it. Cards or columns containing independent items are not diagrams.
They usually reduce the space available for explanation without adding
information.

Use a visual only when its geometry carries meaning:

| Form | Use it when it reveals |
|---|---|
| Side-by-side trace | the same mechanism behaving differently on two inputs |
| Span strip | coverage, gaps, or overlap across a linear domain |
| Before and after | both the change and what remains invariant |
| Timeline or flow | causal or temporal order that is hard to follow in prose |
| Chart | magnitude, trend, or a decision threshold in real numeric data |
| Table | several exact mappings across the same columns |
| Custom diagram | topology, ownership, nesting, or another spatial relation |

A simple sequence of stages is normally an ordered list. A few constraints are
normally bullets. Several options need prose that explains the tradeoffs, or an
exact comparison table when the same criteria apply to every option. Do not turn
these into status cards, ornamental badges, or a dashboard.

When a side-by-side trace is useful, run the *same* mechanism on contrasting
inputs, use real identifiers and intermediate values, and end each side with the
conclusion. When a span strip is useful, make segment widths encode the actual
interval widths. When a chart is useful, label inferred values as inferred and
say what evidence would settle them.

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

### Make each component earn its place against a plain list

**A grid of four boxes, each holding a number and one line of text, is worse than
four bullet points** — the boxes cap what each item can say, so the reasoning
gets truncated to fit, and the reader gets less than prose would have given
them.

The test, applied to every component before you use it: *would the same items as
a plain list carry more?* If yes, use the list. Layout is not information.

What survives that test:

- **A worked example** — an actual input and what happens to it. The strongest
  thing on any page and the reason to reach for a figure at all.
- **A side-by-side trace** — the same mechanism on an input it handles and one it
  does not. Two columns because the comparison is the point.
- **A chart** — but only where *magnitude* is the argument and the shape says
  something a sentence cannot. A bar chart of six values you would otherwise
  write in a sentence is decoration; one where the shortest bar uses the most
  cores earns itself.
- **A table** — only for several exact mappings across the same columns. Three
  rows of prose in a two-column table is a list wearing a costume.

Prefer a paragraph naming four measurements and explaining what each implies to a
row of four stat boxes holding the same four numbers with their explanations cut.

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

### Build it as a quiet technical document

This skill is installed from the `explain-code-skills` repository; the copy under
`assets/` next to this file is the one to use. If the assets named below are
missing, the installed copy is stale — say so rather than improvising a
substitute.

The stylesheet is a neutral baseline, not an art direction. Keep the title,
standfirst, headings, and prose on one aligned reading column. Let a comparison,
table, chart, or diagram widen only when the additional width itself carries
information. Do not add decoration to demonstrate the stylesheet.

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
assets/house-style.css      neutral document styles and a few earned visuals
assets/comments.js          passage-level review controls
assets/page-skeleton.html   prose-first starting markup with optional examples
```

**The two output modes differ, and one file cannot serve both.** A standalone
file needs the doctype, `<head>`, charset, and viewport that `assemble.sh` adds —
without charset the page's own punctuation is at the server's mercy, and without
viewport the stylesheet's breakpoints never fire on a phone. A page published
through a host that supplies its own shell (Claude Code's Artifact tool) must
omit that wrapper and pass the body plus an inline `<style>` and `<script>`,
since the host wraps it. When you do both, build the standalone file with
`assemble.sh` and publish the unwrapped form.

Do not restyle ordinary prose per page. If the subject genuinely needs a visual
the sheet lacks, give that visual the smallest subject-specific styling needed
to communicate its relationship, while keeping the surrounding document quiet.

The page must stay self-contained — no external fonts, scripts, stylesheets, or
images — because it may be read where network requests are blocked. Give wide
content its own `overflow-x: auto` container so the body never scrolls sideways.

If the host provides a data-visualization skill, use it for a chart or diagram
whose data actually warrants one. Do not invoke design tooling merely to style
ordinary prose.

### Ship the review layer

`assets/comments.js` places a small speech-bubble button beside each standfirst,
direct prose paragraph, worked code example, list item, checkpoint, and figure
caption. Clicking it opens a composer directly below that passage. The script
keeps notes and questions in `localStorage` across reloads and exports the batch
as markdown through a **Copy for Claude** button so it can be pasted straight
back into a conversation. Selecting text within a passage before clicking its
button quotes that text in the export.

The script derives a fallback comment identity from the section and passage
order. If a passage is likely to move while review comments must survive, give
it a stable, page-unique `data-ec-id`; removed identities appear as orphaned
comments instead of being silently discarded.

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

- Can I point every central non-obvious claim to primary evidence?
- Did every current-language or code example parse, run, or fail for the claimed
  reason, or is it explicitly conceptual?
- Did I keep specified, implemented, observed, historical, and proposed claims
  separate?
- Is any polished sentence hiding an unresolved question? If so, remove that section and abstain.
- Before implementation detail, can the reader state the core information transformation, the choice left unresolved, and how the direct consumer uses or resolves it?
- Can the reader trace the same validated input through every consequential step, including the relevant state before, selected decision, change, state after, and handoff?
- Is every imported concept taught by example where it first carries weight, rather than named and left?
- Did I show the important representation instead of only naming abstractions?
- Did I follow execution order?
- Did I explain why the non-obvious choices exist?
- Did I say what is checked and what is left elsewhere?
- Did I explain how claimed properties are achieved?
- Did I stay within the requested section?

And for the page:

- Does every figure carry something the prose does not?
- Would any component I used be better as a plain list? (Stat grids almost always are.)
- Does every trace panel end in a verdict?
- Is each structural device — numbering, ordering, grouping — true of the content?
- Is every inferred or estimated number labeled as one?
- Was the page built with `assemble.sh` (or, in artifact mode, assembled to match), rather than by hand?
- Did I write the file to disk, report its path, and publish it if the host can?
