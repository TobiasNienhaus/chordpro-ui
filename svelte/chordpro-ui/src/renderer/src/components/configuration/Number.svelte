<script lang='ts'>
  import Textfield from '@smui/textfield'
  import Slider from '@smui/slider';
  import FormField from '@smui/form-field';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

  let value
  export let min: number | null = null;
  export let max: number | null = null;
  export let initial: number = 0;
  value = initial;
  export let option: string;

  $: {
    dispatch('cusev', {
			title: option,
      val: value
		});
  }
</script>

{#if min != null && max != null}
<FormField align="end" style="display: flex;">
  <Slider style="flex-grow: 1; margin-left: 12px" bind:value {min} {max}/>
  <span
    slot="label"
    style="padding-right: 12px; width: max-content; display: block;"
  >
    {option}: <span style="display: inline-block; width: 10px">{value}</span>
  </span>
</FormField>
{:else}
<FormField align="end" style="display: flex;">
  <Textfield style="flex-grow: 1;" bind:value label="{option}" type="number" />
</FormField>
{/if}
