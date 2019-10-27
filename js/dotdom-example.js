(() => {
  let lastId = 0;

  const execSnippet = (source, dom) => {
    let m;
    const rx = /(\w+)([\.\[][^[]+?)?\(/g
    const tags = [];
    while (m = rx.exec(source)) {
      const tag = m[1];
      if (tags.indexOf(tag) == -1) tags.push(tag)
    }

    const argNames = tags.slice().concat('H', 'window','document');
    const argValues = tags.map(tag => window.H[tag]).concat(window.H, {}, {});

    argNames.push('return (' + source + ')');
    const fn = new Function(...argNames);

    R(fn(...argValues), dom);
  };

  const execFull = (source, dom) => {
    const fn = new Function('H', 'R', 'body', 'window', 'document', 'console', source);
    const fakeDoc = {
      body: dom,
      getElementById: id => dom
    };
    const fakeWin = {
      document: fakeDoc
    };
    const fakeConsole = console;
    return fn(window.H, window.R, dom, fakeWin, fakeDoc, fakeConsole);
  };

  const updatePreview = (source, dom) => {
    try {
      execSnippet(source, dom);
    } catch(e) {
      try {
        execFull(source, dom);
      } catch(e2) {
        console.warn(e, e2);
      }
    }
  }

  const createEditor = (dom) => {
    const editorDiv = dom.firstChild;
    const previewDiv = editorDiv.nextSibling.firstChild;

    const aceDiv = editorDiv.firstChild;
    aceDiv.id = 'example-editor-' + (++lastId);

    aceDiv.innerHTML = atob(aceDiv.innerText);

    const editor = ace.edit(aceDiv.id, {
      theme: "ace/theme/monokai",
      mode: "ace/mode/javascript",
      showLineNumbers: false
    });

    let timer;
    const debounceUpdate = () => {
      clearTimeout(timer);
      timer = setTimeout(
        () => updatePreview(editor.session.getValue(), previewDiv),
        500
      );
    };

    editor.on('change', debounceUpdate);
    updatePreview(editor.session.getValue(), previewDiv);
  };

  window.addEventListener('load', () => {
    document.querySelectorAll(".dot-dom-example").forEach(createEditor);
  });

})();
