<script>
  import BodyToggle from './BodyToggle.svelte';
  export let expr;

  $: map = typeof expr == 'object' ? Object.entries(expr) : expr;

  function sinTipo({type, ...rest}) {
    return { ...rest };
  }

  function proper (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
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

{:else if !['object', 'null', 'undefined'].includes(typeof expr)} 
  {expr}

{:else if typeof expr == 'object'}
  {#if 'type' in expr}
    <BodyToggle>
      <code slot="title">
        {proper(expr.type)}
      </code>
      <div slot="body">
        <ul>
          {#each Object.entries(sinTipo(expr)) as [k, v]}
            <li>
              <div class="row">
                {#if k == 'position'} 
                  {k}: <code class="key-r">({v.line}:{v.col})</code>
                {:else if k == 'operator'}
                  {k}: <code class="key-r wyg-operator">{v}</code>
                {:else if k == 'literal'} 
                  {k}: <code class="key-r wyg-literal">"{v}"</code>
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

  .key-l {
    /* background-color: red; */
    padding-right: 2px;
  }
  .key-r {
    padding-left: 2px;
  }
  .wyg-operator {}
  .wyg-literal {}

  .row {
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: baseline;

  }
  .array {
    padding: 0;
  }

  
  ul, ol {
    /* line-height: 80%; */
    list-style: none;
    padding: 0.1rem;
    padding-top: 0;
  }

  li {
    padding-left: 0.125rem;
  }
  
</style>