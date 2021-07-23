<script>
  export let pos;
  export let title;
  export let color;
  export let label = " : : : ";
  export let main;
  $: cl = "pane-wrapper" + (pos ? ' pane-' + pos : '');
  let active = true;
  const toggle = () => active = !active;
  const onFocus = typeof main == 'function' ? main : () => {};
  
</script>

<div class={cl} 
  data-color={color}>
  <div class="pane-header">
      <div class="pane-title">{title}</div>
      <div class="pane-message">{label}</div>
      <div class="pane-controls" on:click|self="{toggle}">~~</div>
  </div>
  {#if active}  
    <div class="pane-content" on:click={onFocus}>
      <slot></slot>
    </div>
  {/if}
</div>

<style>
:root {
	--blue1: #5e6771;
	--blue2: #7f8b99;
	--blue3: #6a7480;
	--red1: #715e5e;
	--red2: #8d7777;
	--green1: #60715e;
	--green2: #798d77;
	--purple1: #645e71;
	--purple2: #79778d;
}

.blue1,
.pane-wrapper[data-color='blue'] {
	--bg-color: var(--blue1);
}

.red1,
.pane-wrapper[data-color='red'] {
	--bg-color: var(--red1);
}

.green1,
.pane-wrapper[data-color='green'] {
	--bg-color: var(--green1);
}

.purple1,
.pane-wrapper[data-color='purple'] {
	--bg-color: var(--purple1);
}

.pane-wrapper {
	display: grid;
	position: relative;
	border-radius: 5px;
	border: 1px solid var(--bg-color);
	box-shadow: 0 5px 10px -5px rgba(40, 40, 55, 0.65);
	grid-template-rows: 25px 1fr;
}

.pane-right {
  height: calc(100vh - 100px);
}


.pane-left-1 {
  /* min-height: calc(100% - 150px); */
}


.pane-left-2 {
  /* max-height: 100px; */
}

.pane-header {
	display: flex;
	grid-gap: 0;
	color: #fff;
	padding: 2px 4px;
	font-size: 14px;
	align-items: center;
	background-color: var(--bg-color);
	justify-content: space-between;
	border-top-left-radius: 4px;
	border-top-right-radius: 4px;
}

.pane-title {
	text-align: left;
	font-size: 16px;
	align-items: center;
}

.pane-message {
	color: rgba(200, 200, 200, 0.75);
	text-decoration: italic;
	font-size: 13px;
  cursor: grab;
  -moz-user-select: none;
  -webkit-user-select: none;
}

.pane-controls {
	color: #fff;
	font-size: 14px;
	padding-right: 3px;
	cursor: pointer;
	text-align: center;
}

div.pane-controls a {
	text-align: right;
	color: #fff;
	font-size: 14px;
}

div.pane-controls a:hover {
	color: #dedede;
	text-shadow: 0 1px 2px #666;
}

.pane-controls:hover {
	text-shadow: 0 1 2 #fff;
	font-style: strong;
}

a {
	color: #333;
}

a:hover {
	color: #999;
}

.pane-content {
	padding: 2px 4px;
	overflow: scroll;
	margin: 0 auto;
	background-color: #f3f6f9;
	border-bottom-left-radius: 3px;
	border-bottom-right-radius: 3px;
  width: 98%;
  height: 100%;
  text-align: left;
  justify-content: space-evenly;
}

.pane-content form div {
	margin: 0.5em;
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	gap: 0.75em;
}
</style>