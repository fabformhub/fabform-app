<script>
  export let blockTypeId = 0; // numeric ID of the block

  import { 
    Sparkle, RectangleHorizontal, CircleDot, Check, 
    ChevronDown, Star, Hash, Gauge, Phone, 
    ScrollText, Link, Upload, Mail, ToggleLeft, 
    SquareCheck, Smile, CalendarCheck, Signature
  } from 'lucide-svelte';

  // Map blockTypeId to icons explicitly
  const iconsById = {
    0: Sparkle,
    1: RectangleHorizontal,
    2: CircleDot,
    3: Check,
    4: ChevronDown,
    5: Star,
    6: Hash,
    7: Gauge,
    8: Phone,
    9: ScrollText,
    10: Link,
    11: Upload,
    12: Mail,
    13: ToggleLeft,
    14: SquareCheck,
    15: Smile,
    16: CalendarCheck,
    17: Signature
  };

  // Safe fallback if ID not found
  const IconComponent = iconsById[blockTypeId];
</script>

<IconComponent class="w-5 h-5 text-blue-600" />
