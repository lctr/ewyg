<script>
  import BodyToggle from './BodyToggle.svelte';
  export let expr;

  $: map = (expr && typeof expr == 'object') ? Object.entries(expr) : expr;

  function tail({type, ...rest}) {
    return { ...rest };
  }

  function isAtomic(x) {
    switch (typeof x) {
      case 'number':
      case 'string':
      case 'boolean':
        return true;
      default:
        return false;
    }
  }

  function lower(str) {
    return str.toLowerCase()
  };

  function proper (str) {
    return str.charAt(0).toUpperCase() +
      str.slice(1).toLowerCase();
  }
</script>

{#if Array.isArray(expr)} 
  <div class="row">
    <BodyToggle>
      <div slot="body">
        <ol>
          {#each expr as item}
            <li><svelte:self expr={item} /></li>
          {/each}
        </ol>
      </div>
    </BodyToggle>
  </div>  

{:else if isAtomic(expr)} 
  {expr}

{:else if expr && typeof expr == 'object'}
  {#if 'type' in expr}
    <BodyToggle>
      <code class={'wyg-type wyg-' + lower(expr.type)} slot="title">
        {proper(expr.type)}
      </code>
      <div slot="body">
        <ul>
          {#each Object.entries(tail(expr)) as [k, v]}
            <li>
              <div class="row">
                {#if k == 'position'} 
                  {k}: <code class="key-r wyg-position">{v.line}:{v.col}</code>
                {:else if isAtomic(v)}
                  {k}: <code class={`key-r wyg-${k}`}>{v}</code> 
                {:else}
                <div class="key-l">{k}: </div>
                <div><svelte:self expr={v} /></div>
                {/if}
              </div>
            </li>
          {/each}
        </ul>
      </div>
    </BodyToggle>

  {:else} 
    {#each map as [k, v]}
      {#if ['number', 'string', 'boolean'].includes(typeof v)} 
        <li>{k}: {proper(`${v}`)}</li>
      {:else} 
        <li>{k} {proper(v.type)}
          <svelte:self expr={v}></svelte:self>
        </li>
      {/if}
    {/each}
  {/if}

{/if}

<style>
  :root {
    --literal: rgb(81, 81, 114);
    --operator: rgb(141, 78, 78);
    --position: rgb(102, 126, 105);
  }
  .wyg-type {
    letter-spacing: 1px;
  }
  .key-l {
    /* background-color: red; */
    padding-right: 4px;
  }
  .key-r {
    padding-left: 4px;
    font-family: monospace;
  }

  .wyg-args {
    font-style: italic;
  }

  .wyg-operator {
    color: var(--operator);
  }
  .wyg-position {
    color: var(--position);
  }

  .wyg-position::before {
    content: "(";
  } 
  
  .wyg-position::after {
    content: ")";
  }
  .wyg-literal {
    color: var(--literal);
  }

  .wyg-literal::before, .wyg-literal::after {
    content: "\""
  }

  .wyg-block, .wyg-condition {
    color: var(--green1);
  }

  .wyg-lambda, .wyg-variable, .wyg-vector {
    color:var(--purple1);
  }

  .wyg-binary, .wyg-unary, .wyg-assign {
    color:var(--blue1);
  }

  .wyg-call, .wyg-index {
    color:var(--red1);
  }

  .wyg-sym, .wyg-str, .wyg-num {
    color:var(--green2);
  }


  .row {
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: baseline;
    padding: 0;
  }

  
  ul, ol {
    /* line-height: 80%; */
    list-style: none;
    padding: 0;
    padding-top: 0;
    margin: 0;
  }

  li {
    padding-left: 0;
  }
  
</style>