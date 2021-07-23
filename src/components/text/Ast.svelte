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
      <code slot="title">
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
    --literal: blue;
    --operator: red;
    --position: green;
  }

  .key-l {
    /* background-color: red; */
    padding-right: 2px;
  }
  .key-r {
    padding-left: 2px;
    font-family: monospace;
  }

  .wyg-operator {
    color: var(--operator);
  }
  .wyg-position {
    color: var(--green);
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

  .row {
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: baseline;
    padding: 0;
  }
  
  .array {
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