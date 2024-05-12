class ThemeInterface {
  defaultId = void 0;
  defaultPosition = void 0;
  html = void 0;
  style = void 0;
}

class ToggleFancyShapeTheme extends ThemeInterface {
  defaultId = "adm-toggle";
  defaultPosition = `
    position:fixed;
    bottom:8%;
    right:0;
    z-index: 999999999999999999999999999999;
  `;
  html = `
    <div>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
      />
      <input id="darkmode-toggle" type="checkbox">
      <label for="darkmode-toggle">Dark Mode</label>
    </div>
  `;
  style = `
    #${this.defaultId} *,
    #${this.defaultId} *:before, 
    #${this.defaultId} *:after {
      box-sizing: border-box;
    }
    
    body {
      transition: background-color 0.5s ease-out, color 0.5s ease-out;
      background-color: var(--color-bg);
      color: var(--color-text);
    }

    #${this.defaultId} {
      --color-bg: #fff;
      --color-text: #333;
    }
    #${this.defaultId} .darkmode {
      --color-bg: #222;
      --color-text: steelblue;
    }
    
    #${this.defaultId} #darkmode-toggle {
      position: absolute;
      width: 0;
      height: 0;
      visibility: hidden;
    }
    #${this.defaultId} #darkmode-toggle + label {
      position: relative;
      display: block;
      width: 4rem;
      height: 2rem;
      background-color: var(--color-text);
      border-radius: 2rem;
      text-indent: -100em;
    }
    #${this.defaultId} #darkmode-toggle + label:after {
      content: "";
      font-family: "Font Awesome 5 Free";
      font-weight: 900;
      display: inline-block;
      font-size: 1em;
      text-rendering: auto;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: var(--color-text);
      text-indent: 0;
      padding: 0.25rem;
      text-align: left;
      position: absolute;
      top: 0.25rem;
      left: 0.25rem;
      width: 1.5rem;
      height: 1.5rem;
      background-color: var(--color-bg);
      border-radius: 1.5rem;
      transition: left 0.2s ease-out, transform 0.2s ease-out, width 0.2s ease-out;
    }
    #${this.defaultId} #darkmode-toggle + label:hover:after,
    #${this.defaultId} #darkmode-toggle + label:active:after {
      width: 2rem;
    }
    #${this.defaultId} #darkmode-toggle:checked + label:after {
      content: "";
      left: calc(100% - 0.25rem);
      transform: translateX(-100%);
      text-align: right;
    }

     @media (prefers-color-scheme: dark) {
      body { --color-bg: #222; --color-text: #fff; }
    }
    @media (prefers-color-scheme: light) {
      body { --color-bg: #fff; --color-text: #333; }
    }
  `;
}

class ToggleButtonShape {
  toggleElm = void 0;
  constructor({ html: e, style: t, js: n, defaultId: o, defaultPosition: l }) {
    this.html = e;
    this.style = t;
    this.js = n;
    this.defaultId = o;
    this.defaultPosition = l;
  }
  createStyleElement() {
    const e = document.createElement("style");
    return e.innerHTML = this.style, e;
  }
  createToggleElement() {
    const e = document.createElement("div");
    return e.innerHTML = this.html, e.firstChild;
  }
  getInputElement() {
    if (!this.toggleElm) return;
    const e = `#${this.defaultId} input[type='checkbox']`;
    return this.toggleElm.querySelector(e);
  }
  setChangeEvent(e) {
    this.getInputElement().addEventListener("change", e);
  }
  dispatchChangeEvent = () => {
    const e = this.getInputElement(),
          t = new Event("change");
    e.checked = !e.checked, e.dispatchEvent(t);
  };
  render() {
    const e = this.createStyleElement(),
          t = this.createToggleElement();
    t.setAttribute("style", this.defaultPosition),
    t.setAttribute("id", this.defaultId),
    document.head.appendChild(e),
    document.body.appendChild(t),
    this.toggleElm = t;
  }
}

class ToggleHistoryManager {
  localStorageFlag = "awesome-dark-mode-status";
  saveState(e) {
    localStorage.setItem(this.localStorageFlag, e);
  }
  readState() {
    return JSON.parse(localStorage.getItem(this.localStorageFlag)) || !1;
  }
  setPreviousState(e) {
    this.readState() && e();
  }
}

class ToggleAction {
  constructor(e) {
    this.history = new ToggleHistoryManager,
    this.rotatedElementsSelectors = [...new Set(["html", "img", "video", ...e])],
    this.isHue = !0,
    this.cssRotateCode = `filter: invert(1)${this.isHue ? " hue-rotate(180deg)" : ""} !important`;
  }
  rotateElmColor180deg(e) {
    const t = this.cssRotateCode,
          n = e.style.cssText.split(";").map((e => e.trim())).filter((e => e));
    n.includes(t) ? n.splice(n.indexOf(t), 1) : n.push(t), e.style.cssText = n.join(";");
  }
  rotateElementsColor() {
    this.rotatedElementsSelectors.forEach((e => document.querySelectorAll(e).forEach((e => this.rotateElmColor180deg(e)))));
  }
  onChangeEvent = e => {
    this.rotateElementsColor(), this.history.saveState(e.target.checked);
  };
}

class AutoDarkMode {
  constructor(e, t) {
    const n = e || new ToggleFancyShapeTheme,
          o = new ToggleButtonShape(n),
          l = new ToggleHistoryManager,
          a = new ToggleAction(t || []),
          { onChangeEvent: s } = a,
          { dispatchChangeEvent: r } = o;
    o.render(), o.setChangeEvent(s), l.setPreviousState(r);
  }
}

if ("undefined" != typeof exports) {
  module.exports = AutoDarkMode;
}
