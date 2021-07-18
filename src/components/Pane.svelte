<script>
  export let title;
  export let color;
  export let label = " : : : ";
  let active = true;
  const toggle = () => active = !active;
</script>

<div class="pane-wrapper" data-color={color}>
  <div class="pane-header">
      <div class="pane-title">{title}</div>
      <div class="pane-message">{label}</div>
      <div class="pane-controls" on:click="{toggle}">~~</div>
  </div>
  <div class="pane-content">
    {#if active}  
    <slot></slot>
    {/if}
  </div>
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

.pane-wrapper {
	display: grid;
	position: relative;
	border-radius: 5px;
	border: 1px solid;
	box-shadow: 0 5px 8px -5px rgba(40, 40, 55, 0.65);
	grid-template-rows: 25px 1fr;
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
}

.pane-content form div {
	margin: 0.5em;
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	gap: 0.75em;
}
</style>