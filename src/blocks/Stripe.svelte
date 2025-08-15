<script>
  import { onMount } from 'svelte';
  import { loadStripe } from '@stripe/stripe-js';

  // Props from form builder
  export let stripePublicKey = 'pk_live_51NWE0DCY085sygSQpVlTybLDA7Xyb9TckA5ftXQpaPZUFlS1kvHuuas3Ovs8XQ2RM6Fy0w8u5Z0kIU38iRrV8RGW00Ex8ympb8'; // Your Stripe public key
  export let formMode = false;     // Whether the form is active
  export let props = {};           // Optional props (icon, placeholder, name)

  let { icon = null, placeholder = 'Card Details', name = '' } = props ?? {};

  let stripe;
  let elements;
  let card;

  onMount(async () => {
    stripe = await loadStripe(stripePublicKey);
    elements = stripe.elements();

    card = elements.create('card', {
      style: {
        base: {
          fontSize: '1rem',
          color: formMode ? '#1f2937' : '#9ca3af', // gray-900 vs gray-400
          '::placeholder': { color: '#9ca3af' },
          iconColor: '#9ca3af'
        },
        invalid: { color: '#e53e3e' }
      },
      hidePostalCode: true
    });

    card.mount('#card-element');
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !card) return;

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card,
      billing_details: { name }
    });

    if (error) {
      console.error(error);
      alert(error.message);
    } else {
      console.log('Payment Method created:', paymentMethod);
      // Send paymentMethod.id to your backend to complete payment
    }
  }
</script>

<div class="relative w-full m-0 p-0">
  {#if icon}
    <span class="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-6 h-6 flex items-center justify-center">
      {@html icon}
    </span>
  {/if}

  <!-- Stripe CardElement container -->
  <div
    id="card-element"
    class={`peer block w-full bg-transparent border-0 border-b-2 py-2 px-0 text-xl transition-all duration-300
      ${icon ? 'pl-8' : ''}
      ${formMode
        ? 'border-gray-400 focus:border-indigo-500'
        : 'border-gray-200 cursor-not-allowed'}
    `}
  ></div>

  {#if formMode}
    <!-- Underline animation -->
    <span class="absolute bottom-0 left-0 h-0.5 w-0 bg-indigo-500 transition-all duration-300 peer-focus:w-full origin-left"></span>
  {/if}

  <button
    class="mt-4 px-4 py-2 bg-indigo-500 text-white rounded disabled:opacity-50"
    type="button"
    on:click={handleSubmit}
    disabled={!formMode}
  >
    Pay
  </button>
</div>
