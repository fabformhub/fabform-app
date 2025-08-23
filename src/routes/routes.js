import { Dashboard, Login, Signup, FormViewer, FormResponses, FormBuilder, Test, Share, Settings } from '../pages';
import { goto } from '@mateothegreat/svelte5-router';
import { authService } from '../services/authService.svelte.js';

const requireAuth = () => {
  if (!authService.userSession.user) {
    goto('/login');
    return false;
  }
  return true;
};

export default [
  { path: '', hooks: { pre: () => goto('/dashboard') } },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'dashboard', component: Dashboard, hooks: { pre: requireAuth } },
  { path: 'share/(?<id>.*)', component: Share, hooks: { pre: requireAuth } },
  { path: 'settings/(?<id>.*)', component: Settings, hooks: { pre: requireAuth } },  
  { path: 'responses/(?<id>.*)', component: FormResponses, hooks: { pre: requireAuth } },
  { path: 'form/(?<mode>[^/]+)/(?<id>[^/]+)', component: FormBuilder, hooks: { pre: requireAuth } },
  { path: 'v/(?<id>.*)', component: FormViewer },
  { path: 'test', component: Test,  }
];