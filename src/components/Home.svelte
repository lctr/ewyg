<script>
  import Editor from "./text/Editor.svelte";
  import Topbar from "./layout/Topbar.svelte";
</script>
<Topbar>
  <h1>Wyg</h1>

<link
  href="https://fonts.googleapis.com/css?family=Roboto:100,400"
  rel="stylesheet"
/>
</Topbar>



<Editor />

<style>
  h1 {
    color: #f2f2f2;
    font-size: 2.25em;
    font-weight: 100;
  }
</style>
