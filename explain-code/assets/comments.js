/* ============================================================================
   explain-code review layer
   ----------------------------------------------------------------------------
   Lets the reader attach notes and questions to any <section> or <figure>,
   survive a reload, and export the batch as markdown to paste back into chat.

   Declares no artifact capabilities and makes no network requests, so the same
   file behaves identically opened locally and published. There is no runtime
   capability that can post back into a conversation -- clipboard is the path.

   Inline verbatim in a <script> block at the end of the page. Requires the
   matching styles in house-style.css.
   ========================================================================= */
(function () {
  "use strict";

  var STORE = "ec-comments:" + (document.title || "page") + "|" + location.pathname;
  var items = [];

  try {
    items = JSON.parse(localStorage.getItem(STORE) || "[]");
  } catch (e) {
    items = [];
  }

  function persist() {
    try {
      localStorage.setItem(STORE, JSON.stringify(items));
    } catch (e) {
      /* private mode: comments still work for this session */
    }
  }

  function slug(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  }

  /* A block's label is what the exported markdown groups under, so it must read
     like something the user can find again: a heading or a figure caption. */
  function labelFor(block, index) {
    var h = block.querySelector("h1, h2, h3");
    if (h) return h.textContent.replace(/\s+/g, " ").trim();
    var cap = block.querySelector("figcaption b");
    if (cap) {
      var full = block.querySelector("figcaption");
      var t = full ? full.textContent.replace(/\s+/g, " ").trim() : cap.textContent;
      return t.split(".").slice(0, 2).join(".").trim().slice(0, 90);
    }
    return "Block " + (index + 1);
  }

  var blocks = [].slice.call(document.querySelectorAll("section, figure, div.fig"))
    .filter(function (b) { return !b.closest(".ec-dock"); });

  blocks.forEach(function (block, i) {
    var label = labelFor(block, i);
    block.dataset.ecId = slug(label) || "block-" + i;
    block.dataset.ecLabel = label;

    var rail = document.createElement("div");
    rail.className = "ec-rail";

    var add = document.createElement("button");
    add.type = "button";
    add.className = "ec-add";
    add.textContent = "+ comment";
    add.setAttribute("aria-label", "Add a comment on: " + label);
    add.addEventListener("click", function () {
      var sel = lastSel.node && block.contains(lastSel.node) ? lastSel.text : "";
      openComposer(block, sel.slice(0, 400));
    });

    rail.appendChild(add);

    var ui = document.createElement("div");
    ui.className = "ec-ui";
    ui.appendChild(rail);
    block._ecUi = ui;
    if (block.tagName === "FIGURE") block.insertAdjacentElement("afterend", ui);
    else block.appendChild(ui);
  });

  var lastSel = { text: "", node: null };
  document.addEventListener("mouseup", captureSelection);
  document.addEventListener("keyup", captureSelection);

  function captureSelection() {
    var s = window.getSelection && window.getSelection();
    if (!s || s.isCollapsed) return;
    var t = String(s).trim();
    if (!t) return;
    var n = s.anchorNode;
    lastSel = { text: t, node: n && n.nodeType === 1 ? n : n && n.parentNode };
  }

  function openComposer(block, quote, editing) {
    var existing = block._ecUi.querySelector(".ec-composer");
    if (existing) existing.remove();

    var box = document.createElement("form");
    box.className = "ec-composer";

    var kinds = document.createElement("div");
    kinds.className = "ec-kinds";
    ["note", "question"].forEach(function (k) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "ec-kind" + ((editing ? editing.kind : "note") === k ? " on" : "");
      b.dataset.kind = k;
      b.textContent = k;
      b.addEventListener("click", function () {
        kinds.querySelectorAll(".ec-kind").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
      });
      kinds.appendChild(b);
    });

    var q = editing ? editing.quote : quote;
    if (q) {
      var qe = document.createElement("blockquote");
      qe.className = "ec-quote";
      qe.textContent = q;
      box.appendChild(qe);
    }

    var ta = document.createElement("textarea");
    ta.rows = 3;
    ta.placeholder = "Note or question…  (⌘↵ to save)";
    ta.value = editing ? editing.body : "";

    var row = document.createElement("div");
    row.className = "ec-row";
    var save = document.createElement("button");
    save.type = "submit";
    save.className = "ec-save";
    save.textContent = editing ? "Update" : "Save";
    var cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "ec-cancel";
    cancel.textContent = "Cancel";
    cancel.addEventListener("click", function () { box.remove(); });
    row.appendChild(save);
    row.appendChild(cancel);

    box.appendChild(kinds);
    box.appendChild(ta);
    box.appendChild(row);

    box.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var body = ta.value.trim();
      if (!body) { box.remove(); return; }
      var kind = (kinds.querySelector(".ec-kind.on") || {}).dataset.kind || "note";
      if (editing) {
        editing.body = body;
        editing.kind = kind;
      } else {
        items.push({
          id: "c" + Date.now() + Math.random().toString(36).slice(2, 6),
          block: block.dataset.ecId,
          label: block.dataset.ecLabel,
          quote: q || "",
          body: body,
          kind: kind
        });
      }
      persist();
      box.remove();
      render();
    });

    ta.addEventListener("keydown", function (ev) {
      if ((ev.metaKey || ev.ctrlKey) && ev.key === "Enter") save.click();
      if (ev.key === "Escape") box.remove();
    });

    block._ecUi.appendChild(box);
    ta.focus();
  }

  function render() {
    document.querySelectorAll(".ec-note").forEach(function (n) { n.remove(); });

    blocks.forEach(function (block) {
      var host = block._ecUi;
      var mine = items.filter(function (c) { return c.block === block.dataset.ecId; });

      mine.forEach(function (c) {
        var card = document.createElement("div");
        card.className = "ec-note ec-kind-" + c.kind;

        var head = document.createElement("div");
        head.className = "ec-head";
        var tag = document.createElement("span");
        tag.className = "ec-tag";
        tag.textContent = c.kind;
        head.appendChild(tag);

        var tools = document.createElement("span");
        tools.className = "ec-tools";
        var ed = document.createElement("button");
        ed.type = "button";
        ed.textContent = "edit";
        ed.addEventListener("click", function () { openComposer(block, c.quote, c); });
        var del = document.createElement("button");
        del.type = "button";
        del.textContent = "delete";
        del.addEventListener("click", function () {
          items = items.filter(function (x) { return x.id !== c.id; });
          persist();
          render();
        });
        tools.appendChild(ed);
        tools.appendChild(del);
        head.appendChild(tools);

        card.appendChild(head);
        if (c.quote) {
          var qq = document.createElement("blockquote");
          qq.className = "ec-quote";
          qq.textContent = c.quote;
          card.appendChild(qq);
        }
        var p = document.createElement("p");
        p.className = "ec-body";
        p.textContent = c.body;
        card.appendChild(p);

        host.insertBefore(card, host.querySelector(".ec-rail"));
      });
    });

    updateDock();
  }

  function exportMarkdown() {
    var qs = items.filter(function (c) { return c.kind === "question"; }).length;
    var ns = items.length - qs;
    var out = ["# Review of “" + (document.title || "page") + "”",
               "",
               ns + " note" + (ns === 1 ? "" : "s") + ", " + qs + " question" + (qs === 1 ? "" : "s"),
               ""];

    var seen = [];
    items.forEach(function (c) { if (seen.indexOf(c.block) < 0) seen.push(c.block); });

    seen.forEach(function (bid) {
      var group = items.filter(function (c) { return c.block === bid; });
      out.push("## " + group[0].label, "");
      group.forEach(function (c) {
        if (c.quote) out.push("> " + c.quote.replace(/\n+/g, " "), "");
        out.push("**" + (c.kind === "question" ? "Question" : "Note") + ":** " + c.body, "");
      });
    });
    return out.join("\n").trim() + "\n";
  }

  /* --- dock ------------------------------------------------------------- */

  var dock = document.createElement("div");
  dock.className = "ec-dock";
  var count = document.createElement("span");
  count.className = "ec-count";
  var copy = document.createElement("button");
  copy.type = "button";
  copy.className = "ec-copy";
  copy.textContent = "Copy for Claude";
  var clear = document.createElement("button");
  clear.type = "button";
  clear.className = "ec-clear";
  clear.textContent = "Clear";
  clear.addEventListener("click", function () {
    if (!items.length) return;
    if (window.confirm("Delete all " + items.length + " comments on this page?")) {
      items = [];
      persist();
      render();
    }
  });

  copy.addEventListener("click", function () {
    if (!items.length) return;
    var md = exportMarkdown();
    var done = function () {
      copy.textContent = "Copied — paste to Claude";
      setTimeout(function () { copy.textContent = "Copy for Claude"; }, 2600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(md).then(done, function () { fallback(md, done); });
    } else {
      fallback(md, done);
    }
  });

  /* execCommand path for file:// and any context where the async clipboard is
     blocked; if even that fails the textarea stays up so the text is selectable. */
  function fallback(md, done) {
    var ta = document.createElement("textarea");
    ta.className = "ec-fallback";
    ta.value = md;
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    if (ok) { ta.remove(); done(); }
    else {
      ta.classList.add("shown");
      ta.addEventListener("blur", function () { ta.remove(); });
    }
  }

  dock.appendChild(count);
  dock.appendChild(copy);
  dock.appendChild(clear);
  document.body.appendChild(dock);

  function updateDock() {
    var qs = items.filter(function (c) { return c.kind === "question"; }).length;
    var ns = items.length - qs;
    dock.classList.toggle("empty", items.length === 0);
    count.textContent = items.length
      ? ns + " note" + (ns === 1 ? "" : "s") + " · " + qs + " question" + (qs === 1 ? "" : "s")
      : "Select text or click “+ comment” to review";
  }

  render();
})();
