<script lang='ts'>
  import Switch from '@smui/switch';
  import FormField from '@smui/form-field';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

  export let trueValue: string;
  export let falseValue: string;
  export let option: string;

  let checked: boolean = false;

  $: {
    dispatch('cusev', {
			title: option,
      val: checked ? trueValue : falseValue
		});
  }
</script>

<div style="margin: 0 auto;">
  <FormField align="start">
    <Switch bind:checked />
    <span slot="label">{option}</span>
  </FormField>
</div>
