<script>
  import { Label, Checkbox, Dropdown, ColorPicker } from "../ui";
  import { updateForm } from "../../services/formService.js";
  
  let { formProp,changeColorOnForm } = $props();
  
  const form = $state(formProp);

  async function textsizeSelected(s) {
    //alert("text Size selected " + s)
    await updateForm(form);
  }
  async function colorChanged() {
    await updateForm(form);
    changeColorOnForm(form)
  }

</script>

<div class="space-y-3">

  <div class="p-3 rounded bg-white flex items-center justify-between">
    <label class="text-sm font-medium text-gray-700">Background Color</label>
  <ColorPicker bind:color={form.meta.backgroundColor} {colorChanged}/>
    
  </div>

  <div class="p-3 rounded bg-white flex items-center justify-between">
    <label class="text-sm font-medium text-gray-700">Question Color</label>
    <ColorPicker bind:color={form.meta.questionColor} {colorChanged} />
  </div>

  <div class="p-3 rounded bg-white flex items-center justify-between">
    <label class="text-sm font-medium text-gray-700">Answer Color</label>
    <ColorPicker bind:color={form.meta.answerColor} {colorChanged} />
  </div>

  <div class="p-3 rounded bg-white flex items-center justify-between">
    <label class="text-sm font-medium text-gray-700">Button Color</label>
    <ColorPicker bind:color={form.meta.buttonColor} {colorChanged} />
  </div>

  <div class="p-3 rounded bg-white flex items-center justify-between">
    <label class="text-sm font-medium text-gray-700">Button Text Color</label>
    <ColorPicker bind:color={form.meta.buttonTextColor} {colorChanged} />
  </div>

  <div class="p-3 rounded bg-white flex items-center justify-between">
    <label class="text-sm font-medium text-gray-700">Font Size</label>
    <Dropdown
      choices={["Small", "Medium", "Large", "Extra Large"]}
      bind:value={form.meta.fontSize} choiceSelected={textsizeSelected}
    />
  </div>
</div>
