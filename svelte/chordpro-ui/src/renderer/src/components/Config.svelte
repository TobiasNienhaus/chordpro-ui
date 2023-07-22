<script lang="ts">
  import Switch from '@smui/switch';
  import FormField from '@smui/form-field';
  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
  import Paper, { Title as PTitle, Content as PContent } from '@smui/paper';
  import Button, { Label } from '@smui/button';

  import { optionSections, OptionType } from '../../../shared/options'
  import { getCommandString } from '../../../shared/command'

  import BoolMultiFlag from './configuration/BoolMultiFlag.svelte';
  import Dropdown from './configuration/Dropdown.svelte';
  import Number from './configuration/Number.svelte';
  import File from './configuration/File.svelte';

  export let inputFile: string
  export let outputFile: string

  export let setOptions = {}

  function inputFileCallback(e) {
    inputFile = e.detail.val;
  }

  function outputFileCallback(e) {
    outputFile = e.detail.val;
  }

  function callback(e) {
    setOption(e.detail.title, e.detail.val);
  }

  function setOption(opt, value) {
    setOptions[opt] = value;
  }

  function clearCache() {
    window.api.clearCache()
  }

  function openOutput() {
    if (outputFile) window.api.openFile(outputFile)
  }

  $: outputCommand = getCommandString(setOptions, outputFile, inputFile)
</script>

<style>
  .entry {
    min-height: 60px;
    margin: 5px
  }
  .button-row {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
  }
</style>

<h1>ChordPro UI Helper</h1>
<Accordion multiple>
  <Panel>
    <Header>In-/Output</Header>
    <Content>
      <div class="entry">
        <File title="Input" filters={[{name: "ChordPro", extensions: ["cho"]}]} newFile={false} on:cusev={inputFileCallback} />
      </div>
      <div class="entry">
        <File title="Output" filters={[{name: "PDF", extensions: ["pdf"]}]} newFile={true} on:cusev={outputFileCallback} />
      </div>
    </Content>
  </Panel>

  {#each optionSections as section}
  <Panel>
    <Header>{section.title}</Header>
    <Content>
      {#each section.options as option}
      <div class="entry">
        {#if option.type==OptionType.Bool}
          <FormField align="start">
            <Switch on:SMUISwitch:change={(e) => setOption(option.title, e.detail.selected)} />
            <span slot="label">{option.title}</span>
          </FormField>
        {:else if option.type==OptionType.BoolMultiFlag}
          <BoolMultiFlag option={option.title} trueValue={option.true} falseValue={option.false} on:cusev={callback} />
        {:else if option.type==OptionType.Dropdown}
          <Dropdown option={option.title} values={option.values} on:cusev={callback} />
        {:else if option.type==OptionType.DropdownMultiFlag}
          <Dropdown option={option.title} values={option.options} on:cusev={callback} />
        {:else if option.type==OptionType.Number}
          <Number option={option.title} min={option.min} max={option.max} initial={option.initial} on:cusev={callback} />
        {:else if option.type==OptionType.File}
          <File title={option.title} filters={option.filetypes} newFile={option.newFile} on:cusev={callback} />
        {/if}
      </div>
    {/each}
    </Content>
  </Panel>
  {/each}
</Accordion>

<Paper style="margin-top: 8px">
  <PTitle>Output Command</PTitle>
  <PContent>
    <code>{outputCommand}</code>
  </PContent>
</Paper>

<div class="button-row">
  <Button on:click={clearCache}>
    <Label>Clear Cache</Label>
  </Button>
  <Button on:click={openOutput} disabled={!outputFile}>
    <Label>Open Output</Label>
  </Button>
</div>
