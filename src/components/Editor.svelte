<script>
import Pane from './Pane.svelte';
import * as Wyg from "../../lib/wygweb.bundle";

const Egg = new Wyg.Wyg();
const EMPTY = '~ ~ ~';
let INPUT = 'print("hello!")';
let AST = EMPTY;
let RESULT = EMPTY;
let MESSAGE = EMPTY;

function handleInput(event) {
  if (!INPUT.trim().endsWith(';')) return;
  try {
    let session = Egg.run(INPUT);
    if (session.error) {
      MESSAGE = session.message;
    } else {
      AST = JSON.stringify(session.ast, null, 2);
      RESULT = session.value;
    }
  } catch (e) {
    console.log(e);
    MESSAGE = session.message;
  }
}

const editor = {title: "Editor", color: "blue"};
const result = {title: "Result", color: "red"};
const syntax = {title: "Tree", color: "green"};
</script>
<div class="active-panes">
  <Pane {...editor}>
    <textarea 
        id="editing" 
        on:keyup="{handleInput}" 
        bind:value={INPUT} />
  </Pane>

  <Pane {...result}>{RESULT}</Pane>
    
  <Pane {...syntax}>{AST}</Pane>
</div>
<style>

#editing,
#highlighting,
#highlighting * {
  /* Also add text styles to highlighting tokens */
  font-size: 13pt;
  font-family: monospace;
  line-height: 20pt;
  width: 100%;
}


/* Move the textarea in front of the result */
#editing {
  z-index: 1;
}

#highlighting {
  z-index: 0;
}

/* Make textarea almost completely transparent */
#editing {
  /* color: transparent; */
  background: transparent;
  caret-color: red;
  /* Or choose your favorite color */
}

.error {
  color: red;
}

#ast {
  text-align: left;
}
</style>
