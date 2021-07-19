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
const editor = {title: "Editor", color: "blue"};
const syntax = {title: "Tree", color: "green"};

function handleInput(e) {
  try {
    session = Egg.run(INPUT.replaceAll('&nbsp;', ''));
    if (session.error) {
      if (Egg.parseError) {
        AST = Egg.parseError;
        MESSAGE = 'Error parsing input!';
      } else {
        MESSAGE = session.message;
      }
      syntax.color = "red";
      editor.color = "purple";
      ERROR = true;
      Egg.reset();
    } else {
      AST = JSON.stringify(session.ast, null, 2);
      session.error = void 0;
      RESULT = session.value;
      syntax.color = "green";
      editor.color = "blue";
      ERROR = false;
    }
  } catch (e) {
    console.log(e);
    MESSAGE = session.message;
    ERROR = true;
    Egg.reset();
  }
}


</script>

<div class="active-panes">
  <Pane {...editor}>
    <div id="editing" 
      contenteditable="true" 
      data-placeholder={PLACEHOLDER}
      on:keyup="{handleInput}" 
      bind:innerHTML={INPUT} />

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
	margin-top: 0.75em;
	display: grid;
	flex: 2 1 auto;
	flex-direction: column;
	gap: 0.75em;
	align-items: start;
}

#editing:empty:not(:focus):before {
  content: attr(data-placeholder);
  color: gray;
}

#editing {
  font-size: 13pt;
  font-family: monospace;
  line-height: 20pt;
  width: 100%;
  height: 250px;
  z-index: 1;
  outline: none;
  background: transparent;
  caret-color: red;
  /* line-height: 1.1; */
  text-align: left;
}

#result {
  width: 100%; 
  padding: 2px 0;
  border-top: 1px solid #999;
}

.error {
  color: red;
}

#ast {
  text-align: left;
}
</style>
