<script>
  let { blockId = 0 } = $props();  // Destructuring blockId with a default value of 0
  import { Sparkle, RectangleHorizontal, RectangleVertical, CircleDot, Check, ChevronDown, Star, Calendar, Hash, Gauge, Phone, ScrollText, Signature, Link, Calendar1, Upload, Mail, ToggleLeft, SquareCheck, Smile,CreditCard } from 'lucide-svelte';

  const icons = [Sparkle, RectangleHorizontal, RectangleVertical, CircleDot, Check, ChevronDown, Star, Calendar, Hash, Gauge, Phone, ScrollText, Signature, Link, Calendar1, Upload, Mail, ToggleLeft, SquareCheck,Smile,CreditCard];
  const totalIcons = icons.length;

  // Ensure blockId is within the valid range
  const IconComponent = icons[Math.min(blockId, totalIcons - 1)];
</script>

<!-- Render the selected icon component -->
<IconComponent class="w-5 h-5 text-blue-600" />
