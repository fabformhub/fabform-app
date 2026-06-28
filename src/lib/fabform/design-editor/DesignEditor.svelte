<script>
  let { form = $bindable() } = $props();
  import { loadGoogleFont } from "$lib/fontLoader";
  import * as Sheet from "$lib/components/ui/sheet";

// you could use my fabform controls and rip out sheet
// import { Input, TextArea, Checkbox, Dropdown } from "$lib/fabform/ui";


  import { Button } from "$lib/components/ui/button";
  import { Palette } from "lucide-svelte";
  import { Dropdown } from "$lib/fabform/ui/";
  import { ImageUploader } from "$lib/fabform/ui";

  const googleFonts = [
    // UI / modern system
    "Inter",
    "Roboto",
    "DM Sans",
    "Manrope",
    "Work Sans",
    "Lexend",

    // geometric sans
    "Poppins",
    "Montserrat",
    "Rubik",
    "Outfit",

    // humanist / friendly
    "Open Sans",
    "Lato",
    "Nunito",
    "Quicksand",

    // serif (strong contrast)
    "Playfair Display",
    "Merriweather",
    "Source Serif 4",
    "Crimson Text",

    // display / personality
    "Oswald",
    "Space Grotesk",
    "Raleway",
    "Exo 2",

    // monospace
    "JetBrains Mono",
    "IBM Plex Mono",
  ];

  $effect(() => {
    const font = form?.meta?.fontFamily;

    if (!font) return;

    loadGoogleFont(font);
  });
</script>

<!-- CENTERED TRIGGER -->
<div class="flex justify-center w-full py-6">
  <Sheet.Root>
    <Sheet.Trigger>
      <Button
        variant="outline"
        size="sm"
        class="flex items-center gap-2 border-gray-200 bg-white hover:bg-gray-50 shadow-sm"
      >
        <Palette class="h-4 w-4 text-gray-600" />
        <span class="text-sm font-medium">Design</span>
      </Button>
    </Sheet.Trigger>

    <!-- PANEL -->
    <Sheet.Content
      side="right"
      class="w-[420px] h-full bg-white border-l border-gray-200 flex flex-col"
    >
      <!-- HEADER -->
      <Sheet.Header class="shrink-0 border-b border-gray-100 px-5 py-4">
        <Sheet.Title class="text-base font-semibold">Design</Sheet.Title>
        <Sheet.Description class="text-sm text-gray-500">
          Customize the appearance of your form
        </Sheet.Description>
      </Sheet.Header>

      <!-- SCROLL AREA -->
      <div class="flex-1 overflow-y-auto px-5 py-6 space-y-8">
        <!-- COLORS -->
        <section class="space-y-4">
          <h3
            class="text-xs font-semibold uppercase tracking-wider text-gray-400"
          >
            Colors
          </h3>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <label class="text-sm text-gray-700">Background</label>
              <input
                type="color"
                bind:value={form.meta.bgColor}
                class="w-10 h-8 p-0 border-0 bg-transparent cursor-pointer"
              />
            </div>

            <div class="flex items-center justify-between">
              <label class="text-sm text-gray-700">Question</label>
              <input
                type="color"
                bind:value={form.meta.questionColor}
                class="w-10 h-8 p-0 border-0 bg-transparent cursor-pointer"
              />
            </div>

            <div class="flex items-center justify-between">
              <label class="text-sm text-gray-700">Answer</label>
              <input
                type="color"
                bind:value={form.meta.answerColor}
                class="w-10 h-8 p-0 border-0 bg-transparent cursor-pointer"
              />
            </div>

            <div class="flex items-center justify-between">
              <label class="text-sm text-gray-700">Button</label>
              <input
                type="color"
                bind:value={form.meta.buttonColor}
                class="w-10 h-8 p-0 border-0 bg-transparent cursor-pointer"
              />
            </div>

            <div class="flex items-center justify-between">
              <label class="text-sm text-gray-700">Button Text</label>
              <input
                type="color"
                bind:value={form.meta.buttonTextColor}
                class="w-10 h-8 p-0 border-0 bg-transparent cursor-pointer"
              />
            </div>
          </div>
        </section>

        <!-- TYPOGRAPHY -->
        <section class="space-y-4 border-t border-gray-100 pt-6">
          <h3
            class="text-xs font-semibold uppercase tracking-wider text-gray-400"
          >
            Typography
          </h3>

          <div class="space-y-5">
            <div class="flex items-center justify-between">
              <label class="text-sm text-gray-700">Font Size</label>
              <Dropdown
                choices={["Small", "Medium", "Large", "Extra Large"]}
                bind:value={form.meta.fontSize}
              />
            </div>

            <div class="flex items-center justify-between">
              <label class="text-sm text-gray-700">Font Family</label>
              <Dropdown
                choices={googleFonts}
                bind:value={form.meta.fontFamily}
                props={{ placeholder: "Select font…" }}
              />
            </div>
          </div>
        </section>
        <label class="block text-gray-700 font-medium">
          Form Background Image
        </label>

        <ImageUploader
          id={form.id}
          imageType="form"
          bind:image={form.meta.backgroundImage}
        />
        <div class="h-6"></div>
      </div>
    </Sheet.Content>
  </Sheet.Root>
</div>
