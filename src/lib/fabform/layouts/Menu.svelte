<script>
  import { Hammer, PenTool, Link, Share2, BarChart2 } from "lucide-svelte";
  import { route } from '@mateothegreat/svelte5-router';
  import { DashboardButton, OpenFormLinkButton, CopyLinkButton } from '$lib/fabform/ui';
  import { APP_URL } from '$lib/utils/global.js';

  let { form, setActive } = $props();

  const navigationItems = [
    { icon: Hammer, label: "Build", url: `/form/build/${form.id}` },

/* Temporarily disabled
  
  { icon: PenTool, label: "Design", url: `/form/design/${form.id}` },

*/

    { icon: Link, label: "Integrate", url: `/integrate/${form.id}` },
    { icon: Share2, label: "Share", url: `/share/${form.id}` },
    { icon: BarChart2, label: "Responses", url: `/responses/${form.id}` }
  ];
</script>

<div class="w-full fixed top-0 left-0 z-50 bg-white border-b border-gray-200 shadow-sm">
  <nav class="w-full flex items-center justify-between px-4 py-2">

    <div class="flex items-center space-x-2">
      <DashboardButton />
      <p class="ml-4 font-semibold">{form.name}</p>
    </div>

    <div class="flex items-center space-x-6">
      {#each navigationItems as { icon, label, url }}
        <a
          use:route
          href={url}
          on:click={() => setActive(label)}
          class="flex flex-col items-center transition-all duration-200 cursor-pointer"
        >
          <svelte:component this={icon} size={24} />
          <span class="text-xs mt-0.5">{label}</span>
        </a>
      {/each}
    </div>

    <div class="flex items-center gap-2">
      <OpenFormLinkButton url={`${APP_URL}/v/${form.slug}`} />
      <CopyLinkButton link={`${APP_URL}/v/${form.slug}`} />
    </div>

  </nav>
</div>

