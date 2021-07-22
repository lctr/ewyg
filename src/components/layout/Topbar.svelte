<script>

</script>

<div id="top-bar">
  <div>
    <slot></slot>
  </div>
</div>

<style>
#top-bar {
	top: 0;
	left: 0;
	z-index: 999;
	width: 100vw;
	height: 3em;
	display: flex;
	position: fixed;
	column-gap: 0.75em;
	align-items: center;
	box-shadow: 0 0 5px #666;
	backdrop-filter: blur(2px);
	background-image: linear-gradient(rgba(67, 67, 67, 1), 10%, rgba(67, 67, 67, 0.85));
}

#top-bar div {
	color: #fff;
	display: grid;
	padding: 4px 4px;
	column-gap: 0.75em;
	grid-auto-flow: column;
}
</style>