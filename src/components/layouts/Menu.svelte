<script>
  import { Hammer, PenTool, Link, Settings, Share2, BarChart2 } from "lucide-svelte";
  import { route } from '@mateothegreat/svelte5-router';
  import { DashboardButton, OpenFormLinkButton, CopyLinkButton } from '../../components/ui';
  import { APP_URL } from '../../utils/global.js';
  let { formName = '', activeMenuLabel = '', currentFormId = '', formId = '' } = $props();

  const navigationItems = [
    { icon: Hammer, label: "Build", url: `/form/build/${currentFormId}` },
    { icon: PenTool, label: "Design", url: `/form/design/${currentFormId}` },
    { icon: Link, label: "Integrate", url: "/integrate" },
    // { icon: Settings, label: "Settings", url: `/settings/${currentFormId}` },
    { icon: Share2, label: "Share", url: `/share/${currentFormId}` },
    { icon: BarChart2, label: "Responses", url: `/responses/${currentFormId}` }
  ];
</script>

<!-- Full-width nav bar with minimal height -->
<div class="w-full fixed top-0 left-0 z-50 bg-white border-b border-gray-200 shadow-sm">
  <nav class="w-full flex items-center justify-between px-4 py-2">

    <div class="flex items-center space-x-2">
  <DashboardButton />
  <p class="ml-4 font-semibold ">{formName}</p>
</div>

    <!-- Navigation center -->
    <div class="flex items-center space-x-6">
      {#each navigationItems as { icon, label, url }}
        <a use:route
          href={url}
          class={`flex flex-col items-center transition-all duration-200 cursor-pointer
                  ${label === activeMenuLabel
                    ? 'text-blue-600 font-semibold scale-110'
                    : 'text-gray-600 hover:text-blue-500'}`}
        >
          <svelte:component this={icon} size={24} />
          <span class="text-xs mt-0.5">{label}</span>
        </a>
      {/each}
    </div>

    <!-- Link buttons (right) -->
<div class="flex items-center gap-2">
  <OpenFormLinkButton url={`${APP_URL}/v/${currentFormId}`} />
  <CopyLinkButton link={`${APP_URL}/v/${currentFormId}`} />
</div>
  </nav>
</div>
