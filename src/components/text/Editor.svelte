<script>
import Pane from '../layout/Pane.svelte';
import Ast from './Ast.svelte';
import {
  Wyg
} from "../../../lib/wygweb.bundle";

const Egg = new Wyg();
const EMPTY = '· · ·';
let PLACEHOLDER = "Enter some Wyg code!";
let INPUT;
let AST = '';
let RESULT = EMPTY;
let MESSAGE = EMPTY;
let TREE = '';
let ERROR;
let session;
const editor = {
  pos: "left-1",
  title: "Editor",
  color: "blue",
  main: focus
};
const result = {
  pos: "left-2",
  title: "Result",
  color: "blue"
};
const syntax = {
  pos: "right",
  title: "Expression",
  color: "green"
};

function focus(e) {
  document.getElementById("editing").focus()
}

function handleInput(e) {
  // if (e.keyCode === 9) {
  //   INPUT = INPUT + '\t';
    
  // } else 
  
  if (INPUT && INPUT.length > 0) {
    try {
      runInput();

      // setTimeout(() => {
      //   throw new Error(`Process timed out!`);
      // }, 10000);

    } catch (e) {
      MESSAGE = e;
      ERROR = true;
      Egg.reset();
    }
  }
}

function runInput() {
  try {
    session = Egg.run(INPUT.replaceAll('&nbsp;', ''));
    if (session.error) {
      if (Egg.parseError) {
        // AST = Egg.parseError;
        MESSAGE = 'Error parsing input!';
        TREE = Egg.parseError;
      } else {
        MESSAGE = Egg.session.message;
        TREE = { message: EMPTY };
      }
      syntax.color = "red";
      editor.color = "purple";
      ERROR = true;
      Egg.reset();
    } else {
      AST = session.ast;
      session.error = void 0;
      RESULT = session.value ? session.value : EMPTY;
      syntax.color = "green";
      editor.color = "blue";
      ERROR = false;
    }
  } catch (e) {
    MESSAGE = e;
    ERROR = true;
    Egg.reset();
  }
}

</script>

<div class="active-panes">
    <div class="left-panes">
        <Pane {...editor}>
            <div id="editing"
                contenteditable="true"
                spellcheck="false"
                data-placeholder={PLACEHOLDER}
                on:keyup|preventDefault={handleInput}
                on:click={focus}
                bind:textContent={INPUT} />
                </Pane>
                <Pane {...result}>
                    <div id="result">
                        {#if ERROR }
                        <pre>&gt; {MESSAGE}</pre>
                        {:else}
                        <code>&gt; {RESULT}</code>
                        {/if}
                    </div>
                </Pane>
            </div>

            <Pane {...syntax}>
                <div id="ast">
                    {#if ERROR}
                      <span class="error">{TREE.name}!</span>
                      <pre>{TREE.message}</pre>
                    {:else} 
                      <Ast expr={AST} /> 
                    {/if}
                </div>
            </Pane>

            </div>

<style>
.active-panes {
  display: grid;
  gap: 0.75em;
  justify-content: space-evenly;
  width: 100%;
  grid-template-columns: 3fr 2fr;
  grid-template-rows: 1fr 1fr;
  height: 80vh;
}

.left-panes {
  display: grid;
  gap: 0.75em;
  grid-template-rows: auto 150px;
  width: 100%;
}

#editing:empty:not(:focus):before {
  content: attr(data-placeholder);
  color: gray;
}

#editing {
  background: transparent;
  caret-color: red;
  font-family: 'Menlo', monospace;
  font-size: 16px;
  line-height: 18px;
  outline: none;
  text-align: left;
  width: 100%;
  z-index: 1;
  margin-top: 2px;
  color: #111;
}

#result {
  overflow-y: scroll;
  padding: 0 0;
  width: 100%;
}

.error {
  color: red;
  padding: 0;
}

#ast {
  text-align: left;
  margin-top: 2px;
}

pre {
  white-space: pre-wrap;
  /* Since CSS 2.1 */
  white-space: -moz-pre-wrap;
  /* Mozilla, since 1999 */
  white-space: -pre-wrap;
  /* Opera 4-6 */
  white-space: -o-pre-wrap;
  /* Opera 7 */
  word-wrap: break-word;
  /* Internet Explorer 5.5+ */
}
</style>
