<script>
    import { CloudUpload, X } from 'lucide-svelte';
    import { onDestroy } from 'svelte';

    let input;
    let image = null;

    let isDragging = false;

    function openPicker() {
        input.click();
    }

    function setFile(file) {

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            return;
        }

        if (image?.preview) {
            URL.revokeObjectURL(image.preview);
        }

        image = {
            file,
            preview: URL.createObjectURL(file)
        };
    }

    function handleChange(e) {

        const file = e.target.files[0];

        setFile(file);
    }

    function handleDrop(e) {

        e.preventDefault();

        isDragging = false;

        const file = e.dataTransfer.files[0];

        setFile(file);
    }

    function removeImage(e) {

        e.stopPropagation();

        if (image?.preview) {

            URL.revokeObjectURL(image.preview);
        }

        image = null;

        input.value = '';
    }

    onDestroy(() => {

        if (image?.preview) {

            URL.revokeObjectURL(image.preview);
        }

    });
</script>

<input
    bind:this={input}
    type="file"
    accept="image/*"
    class="hidden"
    on:change={handleChange}
/>

{#if !image}

<div

class="
group
relative

w-full

rounded-[32px]

border
border-dashed

border-slate-200

bg-white

hover:border-slate-300

transition-all
duration-300

cursor-pointer

overflow-hidden
"

class:border-sky-400={isDragging}
class:bg-sky-50={isDragging}

on:click={openPicker}

on:dragover|preventDefault={() => isDragging = true}

on:dragleave={() => isDragging = false}

on:drop={handleDrop}

>

<div class="py-24 px-8">

    <div

    class="
    w-24
    h-24

    rounded-full

    bg-slate-50

    mx-auto

    flex
    items-center
    justify-center

    transition

    group-hover:scale-105
    "

    >

        <CloudUpload

        size={42}

        class="text-slate-400"

        />

    </div>

    <h3

    class="
    mt-8

    text-center

    text-2xl

    font-semibold

    tracking-tight

    text-slate-900
    "

    >

        Drop your image here

    </h3>

    <p

    class="
    mt-3

    text-center

    text-slate-500
    "

    >

        or click to upload

    </p>

</div>

</div>

{:else}

<div

class="
group

relative

overflow-hidden

rounded-[32px]

cursor-pointer

bg-white
"

on:click={openPicker}

>

<img

src={image.preview}

alt="Uploaded image"

class="
w-full

aspect-[16/9]

object-cover

transition-transform

duration-700

group-hover:scale-[1.02]
"

/>

<div

class="
absolute

inset-0

bg-black/0

group-hover:bg-black/[0.04]

transition

duration-300
"

></div>

<button

on:click={removeImage}

class="
absolute

top-5
right-5

w-10
h-10

rounded-full

bg-white/85

backdrop-blur-md

shadow-sm

opacity-0

group-hover:opacity-100

transition-all

duration-300

flex

items-center

justify-center
"

>

<X

size={18}

class="text-slate-700"

/>

</button>

</div>

{/if}
