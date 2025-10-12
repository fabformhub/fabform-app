<script>
  import { authService } from '../services/authService.svelte.js';
  import { goto } from '@mateothegreat/svelte5-router';
  import toast from 'svelte-5-french-toast';

  let email = '';
  let password = '';
  let confirmPassword = '';
  let error = '';
  let loading = false;

  async function handleSignup() {
    error = '';
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmedEmail || !trimmedPassword || !trimmedConfirm) {
      error = 'All fields are required';
      return;
    }

    if (trimmedPassword !== trimmedConfirm) {
      error = 'Passwords do not match';
      setTimeout(() => (error = ''), 4000); // clear after 4s
      return;
    }

    if (trimmedPassword.length < 6) {
      error = 'Password must be at least 6 characters';
      return;
    }

    loading = true;
    try {
      // 1️⃣ Create user
      const created = await authService.createUser(trimmedEmail, trimmedPassword);
      if (!created) throw new Error(authService.state.error || 'Signup failed');

      // 2️⃣ Send welcome email after short delay
      setTimeout(async () => {
        try {
          const response = await fetch(
            'https://lbwtzoxtlssyjeututrs.supabase.co/functions/v1/send_welcome_email',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: trimmedEmail })
            }
          );

          if (response.ok) {
            toast.success('Welcome email sent!', {
              position: 'top-right',
              icon: '📧',
              duration: 4000
            });
          }
        } catch (err) {
          console.error('Failed to send welcome email:', err);
        }
      }, 1500);

      // 3️⃣ Show account created toast immediately (10s)
      authService.state.user = null;
      toast.success(`Account created for ${trimmedEmail}. Please log in.`, {
        position: 'top-right',
        icon: '✅',
        duration: 10000
      });

      // Redirect after 2 seconds
      setTimeout(() => goto('/login'), 2000);
    } catch (err) {
      error = err.message || 'Signup failed';
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen flex justify-center items-center bg-gray-100">
  <div class="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg space-y-4">
    <h2 class="text-2xl font-bold text-center">Sign Up</h2>

    {#if error}
      <p class="text-red-500 text-center">{error}</p>
    {/if}

    <form on:submit|preventDefault={handleSignup} class="space-y-3">
      <input
        type="email"
        placeholder="Email"
        bind:value={email}
        class="w-full border px-3 py-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        bind:value={password}
        class="w-full border px-3 py-2 rounded"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        bind:value={confirmPassword}
        class="w-full border px-3 py-2 rounded"
      />
      <button
        type="submit"
        class="w-full py-2 bg-blue-600 text-white rounded"
        disabled={loading}
      >
        {loading ? 'Creating…' : 'Sign Up'}
      </button>
    </form>

    <p class="text-center text-gray-600 text-sm">
      Already have an account?
      <a
        href="/login"
        class="text-blue-600 hover:underline font-medium"
        on:click|preventDefault={() => goto('/login')}
      >
        Log in
      </a>
    </p>
  </div>
</div>
