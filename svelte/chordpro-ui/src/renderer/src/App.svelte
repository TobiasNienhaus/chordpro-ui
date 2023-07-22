<script lang="ts">
  import Config from "./components/Config.svelte";

  import Button, { Label } from '@smui/button';

  let config;
  let input;
  let output;

  let preview: string | null = null;
  let exportedFile: string | null = null;

  async function generatePreview() {
    preview = `file:///${await window.api.createTemp(config, input)}`
  }

  async function exportFile() {
    exportedFile = await window.api.exportFinal(config, input, output)
    window.api.openFile(exportedFile);
  }
</script>

<style>
  :global(body) {
    margin: 0;
  }

  .left, .right {
    padding: 8px;
    height: calc(100vh - 16px);
    max-height: calc(100vh - 16px);
  }

  .left {
    width: 30%;
    min-width: 330px;
    overflow-y: auto;
  }

  .right {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .container {
    display: flex;
  }

  .canvas-container {
    flex-grow: 1;
    margin-top: 8px;
  }

  .canvas {
    width: 100%;
    height: 100%;
    border: none;
  }

  .button-row {
    display: flex;
    justify-content: space-between;
  }
</style>

<div class="container">
  <div class="left">
  <Config bind:setOptions={config} bind:inputFile={input} bind:outputFile={output}/>
  </div>

  <div class="right">
    <div class="button-row">
      <Button on:click={generatePreview} disabled={!input}>
        <Label>Generate Preview</Label>
      </Button>
      <Button on:click={exportFile} disabled={!input || !output}>
        <Label>Export File</Label>
      </Button>
    </div>
    {#if preview != null}
    <div class="canvas-container">
      <embed class="canvas" src= "{preview}" type="application/pdf" />
    </div>
    {/if}
  </div>
</div>

