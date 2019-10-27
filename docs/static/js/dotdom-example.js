(() => {
  let lastId = 0;

  const execSnippet = (source, dom, cns) => {
    cns.log("Compiled as declarative DOM");
    let m;
    const rx = /(\w+)([\.\[][^[]+?)?\(/g;
    const tags = [];
    while ((m = rx.exec(source))) {
      const tag = m[1];
      if (tags.indexOf(tag) == -1) tags.push(tag);
    }

    const argNames = tags.slice().concat("H", "window", "document", "console");
    const argValues = tags.map(tag => window.H[tag]).concat(window.H, {}, {}, cns);

    argNames.push("return " + source);
    const fn = new Function(...argNames);

    R(fn(...argValues), dom);
  };

  const execFull = (source, dom, fakeConsole) => {
    fakeConsole.log("Compiled without errors");
    const fn = new Function(
      "H",
      "R",
      "body",
      "window",
      "document",
      "console",
      source
    );
    const fakeDoc = {
      body: dom,
      getElementById: id => dom
    };
    const fakeWin = {
      document: fakeDoc
    };
    return fn(window.H, window.R, dom, fakeWin, fakeDoc, fakeConsole);
  };

  const updatePreview = (source, dom, cns) => {

    try {
      execSnippet(source, dom, cns);
    } catch (e) {
      try {
        execFull(source, dom, cns);
      } catch (e2) {
        cns.error(e2.toString());
      }
    }
  };

  const flash = dom => {

    if (dom instanceof Text) {
      dom = dom.parentElement;
    }

    if (dom._timer) {
      clearInterval(dom._timer);
      dom.style.backgroundColor = dom._bc;
    }

    const duration = 500;
    const fps = 30;
    const state = {v: 1};

    dom._bc = dom.style.backgroundColor;
    dom._timer = setInterval(() => {
      state.v -= (1.0 / (duration / fps));
      if (state.v <= 0) {
        dom.style.backgroundColor = dom._bc;
        clearInterval(dom._timer);
      } else {
        dom.style.backgroundColor = `rgba(245,187,255,${state.v})`;
      }
    }, 1000 / fps);
  };

  const addMutationHighlights = dom => {
    const callback = function(mutationsList, observer) {
      mutationsList.forEach(mutation => {
        const { target, type, attributeName, oldValue } = mutation;

        // Ignore mutations caused while animating the flash
        if (type == "attributes") {
          if (attributeName == "style" && target._timer) {
            return;
          }
        }

        switch (type) {
          case "characterData":
            flash(target);
            break;
          case "attributes":
            flash(target);
            break;
          case "childList":
            mutation.addedNodes.forEach(flash);
            break;
        }
      });
    };

    // Start observing the target node for configured mutations
    const observer = new MutationObserver(callback);
    observer.observe(dom, {
      attributes: true,
      attributeOldValue: true,
      characterData: true,
      characterDataOldValue: true,
      childList: true,
      subtree: true,
    });
  };

  const createConsole = dom => {
    const write = (cls, ...args) => {
      let text = args.map(x => ''+x).join(" ");
      dom.className = "console " + cls;

      if (cls == "error") {
        text = "🛑 " + text;
      } else if (cls == "warn") {
        text = "⚠️ " + text;
      }
      dom.innerText = text;
    }

    return {
      log: write.bind(this, ""),
      warn: write.bind(this, "warn"),
      warning: write.bind(this, "warn"),
      error: write.bind(this, "error"),
      debug: write.bind(this, "debug")
    };
  };

  const createEditor = dom => {
    const editorDiv = dom.querySelector(".editor");
    const previewDiv = dom.querySelector(".preview");
    const consoleDiv = dom.querySelector(".console");

    let renderDiv = document.createElement("div");
    previewDiv.appendChild(renderDiv);

    const cns = createConsole(consoleDiv);

    const aceDiv = editorDiv.firstElementChild;
    aceDiv.id = "example-editor-" + ++lastId;
    aceDiv.innerHTML = atob(aceDiv.innerText);

    const editor = ace.edit(aceDiv.id, {
      theme: "ace/theme/monokai",
      mode: "ace/mode/javascript",
      showLineNumbers: false,
      tabSize: 2,
      useSoftTabs: true
    });

    let timer;
    const debounceUpdate = () => {
      clearTimeout(timer);
      timer = setTimeout(
        () => {
          // previewDiv.removeChild(renderDiv);
          // renderDiv = document.createElement("div");
          // previewDiv.appendChild(renderDiv);
          updatePreview(editor.session.getValue(), renderDiv, cns);
        }, 500
      );
    };

    editor.on("change", debounceUpdate);
    updatePreview(editor.session.getValue(), renderDiv, cns);
    setTimeout(() => {
      addMutationHighlights(renderDiv);
    }, 500);
  };

  window.addEventListener("load", () => {
    document.querySelectorAll(".dot-dom-example").forEach(createEditor);
  });
})();
