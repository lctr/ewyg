<script>
import Pane from './layout/Pane.svelte';
import { Wyg } from "../../lib/wygweb.bundle";

const Egg = new Wyg();
const EMPTY = '· · ·';
let PLACEHOLDER = "Enter some Wyg code!";
let INPUT;
let AST = '';
let RESULT = EMPTY;
let MESSAGE = EMPTY;
let ERROR;
let session; 
const editor = { pos: "left", title: "Editor", color: "blue" };
const syntax = { pos: "right", title: "Expression", color: "green" };

function handleInput(e) {
  console.log(e);

  if (INPUT && INPUT.length > 0) runInput();
  
}

function runInput() {
  try {
    session = Egg.run(INPUT.replaceAll('&nbsp;', ''));
    if (session.error) {
      if (Egg.parseError) {
        AST = Egg.parseError;
        MESSAGE = 'Error parsing input!';
      } else {
        MESSAGE = Egg.session.message;
      }
      syntax.color = "red";
      editor.color = "purple";
      ERROR = true;
      Egg.reset();
    } else {
      AST = JSON.stringify(session.ast, null, 2);
      session.error = void 0;
      RESULT = session.value ?? EMPTY;
      syntax.color = "green";
      editor.color = "blue";
      ERROR = false;
    }
  } catch (e) {
    console.log(e);
    MESSAGE = e;
    ERROR = true;
    Egg.reset();
  }
}

</script>

<div class="active-panes">
  <Pane {...editor} style="display: flex;">
    <div id="editing" 
      contenteditable="true" 
      data-placeholder={PLACEHOLDER}
      on:keyup={handleInput} 
      bind:textContent={INPUT}>

    </div>

    <div id="result">
      {#if ERROR }
      <pre>&gt; {MESSAGE}</pre>
      {:else}
      <code>&gt; {RESULT}</code>
      {/if}
    </div>
  </Pane>
  <Pane {...syntax}>
    <pre>{AST}</pre>
  </Pane>
</div>

<style>

.active-panes {
	align-items: flex-start;
	display: flex;
	/* flex: 2 1 auto; */
	/* flex-direction: column; */
	gap: 0.75em;
  justify-content: space-evenly;
	margin-top: 0.75em;
  width: 100%;
}

#editing:empty:not(:focus):before {
  content: attr(data-placeholder);
  color: gray;
}

#editing {
  background: transparent;
  caret-color: red;
  font-family: monospace;
  font-size: 13pt;
  line-height: 20pt;
  /* line-height: 1.1; */
  height: 80%;
  outline: none;
  text-align: left;
  /* width: 100%; */
  z-index: 1;
}

#result {
  border-top: 1px solid #999;
  overflow-y: scroll;
  padding: 2px 0;
  width: 100%; 
}

.error {
  color: red;
}

#ast {
  text-align: left;
}

pre {
  white-space: pre-wrap;       /* Since CSS 2.1 */
  white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
  white-space: -pre-wrap;      /* Opera 4-6 */
  white-space: -o-pre-wrap;    /* Opera 7 */
  word-wrap: break-word;       /* Internet Explorer 5.5+ */
}
</style>
