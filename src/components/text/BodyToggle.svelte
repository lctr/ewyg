<script>
  import { slide } from "svelte/transition";
	let shown = true;
	function toggle(e) {
		shown = !shown;
	}
  $: shownCl = 'shown';
  $: hiddenCl = 'hidden';
</script>
<div class="container">
	<div class={shown ? shownCl : hiddenCl} on:click={toggle} >
		<slot name="title"></slot>
	</div>
	{#if shown}
    <div transition:slide>
      <slot name="body"></slot>
    </div>
	{/if}
</div>
<style>
	.container {
		display: grid;
		/* gap: 0.75em; */
		grid-template-rows: 1fr auto;
	}
  .shown {
    cursor:n-resize;
  }
  .hidden {
    cursor:s-resize;
  }
</style>