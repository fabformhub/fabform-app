<script>
  import { Checkbox, Dropdown, ColorPicker } from "../ui";
  import { updateForm } from "../../services/formService.js";
  
  let { form, formChanged } = $props();
  
  async function textsizeSelected(s) {
    //alert("text size changed: " + s);
    await updateForm(form);
  }

  async function colorChanged(newColor) {
    await updateForm(form); 
    formChanged(form);
  }

  async function fontSelected(font) {
   // alert("font changed: " + font);
    await updateForm(form);
  }
const googleFonts = [
  "Roboto","Open Sans","Lato","Montserrat","Poppins","Nunito","Inter","Source Sans Pro",
  "Raleway","Oswald","Playfair Display","Merriweather","Ubuntu","Work Sans","Quicksand",
  "Fira Sans","Heebo","Noto Sans","Noto Serif","Rubik","Mulish","Josefin Sans","DM Sans",
  "Inconsolata","Space Grotesk","Lexend","Exo 2","Overpass","Signika","Asap","Hind",
  "Titillium Web","Manrope","Crimson Text","Spectral","Bitter","IBM Plex Sans",
  "IBM Plex Serif","IBM Plex Mono","Catamaran","Chivo","Cormorant Garamond","Amiri",
  "Arvo","Cardo","Cinzel","Cinzel Decorative","Dosis","Encode Sans","Fraunces","Gelasio",
  "Istok Web","Jost","Libre Baskerville","Libre Franklin","Mukta","Noticia Text",
  "Philosopher","Podkova","Proza Libre","Public Sans","Rasa","Red Hat Display",
  "Red Hat Text","Sarabun","Slabo 27px","Slabo 13px","Sora","Syne","Taviraj","Trirong",
  "Cabin","Domine","Varela Round","Karla","Barlow","DM Serif Display","Space Mono",
  "Teko","Forum","Halant","Mada","Martel","Neuton","Overlock","Cormorant Infant",
  "Cormorant SC","Cormorant Upright","Cormorant Unicase","Nanum Gothic","Nanum Myeongjo",
  "Assistant","Gelasio","Eczar","Libre Caslon Text","Libre Caslon Display","Zilla Slab",
  // Distinctive additions
  "Press Start 2P","Pacifico","Monoton","Lobster","Indie Flower",
  "Baloo 2","Shadows Into Light","Bangers","Orbitron","Creepster"
];

</script>
<div class="space-y-3">

<!-- <p> fontFamily {form.meta.fontFamily}</p>
<p> fontSize {form.meta.fontSize}</p> -->

  <div class="p-3 rounded bg-white flex items-center justify-between">
    <label class="text-sm font-medium text-gray-700">Background Color</label>
    <ColorPicker bind:color={form.meta.backgroundColor} onChange={colorChanged}/>
  </div>

  <div class="p-3 rounded bg-white flex items-center justify-between">
    <label class="text-sm font-medium text-gray-700">Question Color</label>
    <ColorPicker bind:color={form.meta.questionColor} onChange={colorChanged} />
  </div>

  <div class="p-3 rounded bg-white flex items-center justify-between">
    <label class="text-sm font-medium text-gray-700">Answer Color</label>
    <ColorPicker bind:color={form.meta.answerColor} onChange={colorChanged} />
  </div>

  <div class="p-3 rounded bg-white flex items-center justify-between">
    <label class="text-sm font-medium text-gray-700">Button Color</label>
    <ColorPicker bind:color={form.meta.buttonColor} onChange={colorChanged} />
  </div>

  <div class="p-3 rounded bg-white flex items-center justify-between">
    <label class="text-sm font-medium text-gray-700">Button Text Color</label>
    <ColorPicker bind:color={form.meta.buttonTextColor} onChange={colorChanged} />
  </div>

  <div class="p-3 rounded bg-white flex items-center justify-between">
    <label class="text-sm font-medium text-gray-700">Font Size</label>
    <Dropdown
      choices={["Small", "Medium", "Large", "Extra Large"]}
      bind:value={form.meta.fontSize}
      choiceSelected={textsizeSelected}
    />
  </div>

  <div class="p-3 rounded bg-white flex items-center justify-between">
    <label class="text-sm font-medium text-gray-700">Font Family</label>
    <Dropdown
      choices={googleFonts}
      bind:value={form.meta.fontFamily}
      choiceSelected={fontSelected}
      props={{ placeholder: "Select a font…" }}
    />
  </div>
</div>
