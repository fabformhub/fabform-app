<script>
  import { authService } from '../services/authService.svelte.js';
  import { createProfile } from '../services/profileService.js';
  import { goto } from '@mateothegreat/svelte5-router';

  const { state, createUser } = authService;

  let email = '';
  let password = '';
  let confirmPassword = '';

  // Reactive computed value to check if passwords match
  $: passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSignup = async () => {
    state.error = '';

    // Validate fields
    if (!email || !password || !confirmPassword) {
      state.error = 'All fields are required!';
      return;
    }

    // Password match check
    if (!passwordsMatch) {
      state.error = 'Passwords do not match!';
      return;
    }

    state.loading = true;

    try {
      const user = await createUser(email, password);
      if (!user) throw new Error('Signup failed');

      // Create a profile for the new user
      const profileResult = await createProfile(user.id);
      if (!profileResult.success) {
        console.warn('Profile creation failed:', profileResult.error);
      }

      state.user = user; // set session
      goto('/dashboard');
    } catch (err) {
      state.error = err?.message || 'Signup failed';
    } finally {
      state.loading = false;
    }
  };
</script>
