<script>
        let { form = $bindable() } = $props();

        import * as Sheet from "$lib/components/ui/sheet";
        import { Button } from "$lib/components/ui/button";
        import { Palette } from "lucide-svelte";

        import { Dropdown } from "../ui";

        const googleFonts = [
                "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins", "Nunito", "Inter",
                "Source Sans Pro", "Raleway", "Oswald", "Playfair Display", "Merriweather",
                "Ubuntu", "Work Sans", "Quicksand", "Fira Sans", "Heebo", "Noto Sans",
                "Noto Serif", "Rubik", "Mulish", "Josefin Sans", "DM Sans", "Inconsolata",
                "Space Grotesk", "Lexend", "Exo 2", "Overpass", "Signika", "Asap", "Hind",
                "Titillium Web", "Manrope", "Crimson Text", "Spectral", "Bitter"
        ];
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
                                <Sheet.Title class="text-base font-semibold">
                                        Design
                                </Sheet.Title>
                                <Sheet.Description class="text-sm text-gray-500">
                                        Customize the appearance of your form
                                </Sheet.Description>
                        </Sheet.Header>

                        <!-- SCROLL AREA -->
                        <div class="flex-1 overflow-y-auto px-5 py-6 space-y-8">

                                <!-- COLORS -->
                                <section class="space-y-4">
                                        <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                Colors
                                        </h3>

                                        <div class="space-y-4">

                                                <div class="flex items-center justify-between">
                                                        <label class="text-sm text-gray-700">Background</label>
                                                        <input type="color" bind:value={form.meta.backgroundColor}
                                                                class="w-10 h-8 p-0 border-0 bg-transparent cursor-pointer" />
                                                </div>

                                                <div class="flex items-center justify-between">
                                                        <label class="text-sm text-gray-700">Question</label>
                                                        <input type="color" bind:value={form.meta.questionColor}
                                                                class="w-10 h-8 p-0 border-0 bg-transparent cursor-pointer" />
                                                </div>

                                                <div class="flex items-center justify-between">
                                                        <label class="text-sm text-gray-700">Answer</label>
                                                        <input type="color" bind:value={form.meta.answerColor}
                                                                class="w-10 h-8 p-0 border-0 bg-transparent cursor-pointer" />
                                                </div>

                                                <div class="flex items-center justify-between">
                                                        <label class="text-sm text-gray-700">Button</label>
                                                        <input type="color" bind:value={form.meta.buttonColor}
                                                                class="w-10 h-8 p-0 border-0 bg-transparent cursor-pointer" />
                                                </div>

                                                <div class="flex items-center justify-between">
                                                        <label class="text-sm text-gray-700">Button Text</label>
                                                        <input type="color" bind:value={form.meta.buttonTextColor}
                                                                class="w-10 h-8 p-0 border-0 bg-transparent cursor-pointer" />
                                                </div>

                                        </div>
                                </section>

                                <!-- TYPOGRAPHY -->
                                <section class="space-y-4 border-t border-gray-100 pt-6">
                                        <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-400">
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

                                <div class="h-6"></div>
                        </div>
                </Sheet.Content>
        </Sheet.Root>
</div>
