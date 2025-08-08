<script>
let { route } = $props();
let formId = $state(route.result.path.params.id);
import { DefaultLayout } from '../components/layouts/';
  
</script>

<DefaultLayout bind:formId={formId} activeMenuLabel="Settings" >
<div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
<h2>Settings for My Form</h2>
<p1>coming soon</p1>
</div>
</DefaultLayout>