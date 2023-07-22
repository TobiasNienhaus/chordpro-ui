<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  import Button, { Label } from '@smui/button';
  import CircularProgress from '@smui/circular-progress';

  import { FilePickingState } from '../../../../shared/types'

  export let newFile: boolean = false;
  export let filters: {name: string, extensions: string[]}[];
  export let title: string;

  let state = FilePickingState.None
  export let file: string = null

  async function files() {
    state = FilePickingState.Picking
    let res;
    if (!newFile) {
      res = await window.api.pickFile({
        title: "Pick file",
        buttonLabel: "Open",
        filters: filters,
        properties: ["openFile"]
      })
      if (!res.canceled) {
        file = res.filePaths[0]
        state = FilePickingState.Picked
      }
    } else {
      res = await window.api.pickNewFile({
        title: "Pick file",
        buttonLabel: "Pick New",
        filters: filters
      })
      if (!res.canceled) {
        file = res.filePath
        state = FilePickingState.Picked
      }
    }
    if (res.canceled) {
      state = FilePickingState.None
    }
  }

  function clear() {
    file = null
    state = FilePickingState.None
  }

  $: {
    dispatch('cusev', {
      title: title,
      val: file
    })
  }
</script>

<style>
  .cell {
    width: 25%;
    display: inline-block;
    margin: 0 auto;
  }

  .cell-b {
    padding: 5px;
    vertical-align: middle;
  }

  .cell-picked {
    direction: rtl;
  }

  .file-cell {
    flex-grow: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
  }

  :global(.btn) {
    width: 100%;
  }

  .parent {
    display: flex;
    width: 100%;
  }
</style>

<div class="parent">
  <div class="cell cell-b">{title}</div>
{#if file}
  <div class="file-cell cell-b cell-picked">{file}</div>
{:else}
  <div class="file-cell cell-b"><i>None picked...</i></div>
{/if}
  <div class="cell">
  {#if state == FilePickingState.None}
    <Button on:click={files} class="btn">
      <Label>Pick</Label>
    </Button>
  {:else if state == FilePickingState.Picking}
    <Button disabled class="btn">
      <Label>
        <CircularProgress
          class="my-four-colors"
          style="height: 20px; width: 20px;"
          indeterminate
        />
      </Label>
    </Button>
  {:else}
    <Button on:click={clear} class="btn">
      <Label>Clear</Label>
    </Button>
  {/if}
  </div>
</div>
