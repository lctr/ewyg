<script>
import Pane from './layout/Pane.svelte';
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
    <div id="editing" contenteditable="true"
        on:keyup="{handleInput}" 
        bind:innerHTML={INPUT} />
  </Pane>

  <Pane {...result}>{RESULT}</Pane>
    
  <Pane {...syntax}><pre>{AST}</pre></Pane>
</div>

<style>

#editing {
  font-size: 13pt;
  font-family: monospace;
  line-height: 20pt;
  width: 100%;
  z-index: 1;
  outline: none;
  background: transparent;
  caret-color: red;
  text-align: left;
}

.error {
  color: red;
}

#ast {
  text-align: left;
}
</style>
