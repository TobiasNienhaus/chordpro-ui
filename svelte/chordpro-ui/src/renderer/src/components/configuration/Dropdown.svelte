<script lang="ts">
  const nullToken = '@_b%L7puei5MzT[@:1}uyjdM@6zQb{?&3Q0tCE+C[_-]G'
  import Select, { Option } from '@smui/select';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

  export let values: { name: string; value: string; }[];
  export let option: string;

  let value = undefined;

  $: {
    let val = value == nullToken ? null : value;
    dispatch('cusev', {
      title: option,
      val: val
    })
  }
</script>

<style>
:global(.select) {
  width: 100%;
}
</style>

<div class="columns margins select-123" style="justify-content: flex-start; flex-direction: column; align-items: stretch">
    <Select bind:value variant="outlined" label={option} class="select">
      {#each values as value}
        <Option value={value.value != null ? value.value : nullToken}>{value.value != null ? value.name : ''}</Option>
      {/each}
    </Select>
</div>
