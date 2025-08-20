{#if errorMessage && blocks.length === 0}
  <!-- Error visual when data failed to load -->
  <div class="flex flex-col items-center justify-center mt-20 px-4 text-center">
    <img src="/assets/no-data-illustration.svg" alt="No form data" class="w-48 h-48 mb-4" />
    <p class="text-red-600 text-lg font-semibold">{errorMessage}</p>
    <p class="text-gray-500 mt-2 text-sm">
      The form could not be loaded. Please check the link or try again later.
    </p>
  </div>
{:else if submitted}
  <ThankYou />
{:else if blocks[blockNo]?.meta}
  <!-- form block code here -->
{/if}
