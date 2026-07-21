---
name: explain-code
description: Explain source code, algorithms, APIs, data structures, execution flows, and implementation-oriented technical designs in concrete plain English. Use when a user asks for a walkthrough, mental model, line-to-system explanation, code-close design explanation, or a section-by-section account of what a component reads, does, produces, checks, and deliberately leaves to another component.
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

## Check the explanation before sending

Verify:

- Can the reader trace one input through the component?
- Did I show the important representation instead of only naming abstractions?
- Did I follow execution order?
- Did I explain why the non-obvious choices exist?
- Did I say what is checked and what is left elsewhere?
- Did I explain how claimed properties are achieved?
- Did I stay within the requested section?
