export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  room: string;
  isNew?: boolean;
  rating: number;
  features: string[];
}

export const PRODUCTS: Product[] = [
  // LIVING ROOM (10 Items)
  {
    id: 'lr-1',
    name: 'Aumina Smart Hub',
    price: 24999,
    category: 'Central Control',
    image: 'https://images.unsplash.com/photo-1544111300-84c47f9f303a?auto=format&fit=crop&q=80&w=400',
    description: 'The brain of your futuristic home. AI-powered voice and gesture control.',
    room: 'Living Room',
    isNew: true,
    rating: 4.9,
    features: ['Holographic Display', 'AI Neural Sync', 'Zero-Latency']
  },
  {
    id: 'lr-2',
    name: 'Ghost Speaker Gen 3',
    price: 15999,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&q=80&w=400',
    description: 'Crystal clear spatial audio with transparent aesthetics for any minimal living space.',
    room: 'Living Room',
    rating: 4.8,
    features: ['Lossless Audio', 'Glass Body', '360 Sound']
  },
  {
    id: 'lr-3',
    name: 'Zenith Plant Sensor',
    price: 1999,
    category: 'Garden',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=400',
    description: 'Real-time hydration and sunlight tracking for your indoor flora.',
    room: 'Living Room',
    rating: 4.4,
    features: ['Solar Powered', 'AI Gardener', 'Moisture Sync']
  },
  {
    id: 'lr-4',
    name: 'Neural Sofa System',
    price: 124999,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400',
    description: 'Adaptive memory foam that adjusts firmness based on posture and relaxation needs.',
    room: 'Living Room',
    rating: 5.0,
    features: ['Micro-vibration Massage', 'Integrated Chargers', 'Climate Control']
  },
  {
    id: 'lr-5',
    name: 'Holographic Frame',
    price: 34999,
    category: 'Decor',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400',
    description: 'Display 3D memories and digital art in mid-air within your lounge.',
    room: 'Living Room',
    rating: 4.7,
    features: ['Depth Sensing', 'Cloud NFT Support', 'Gesture Change']
  },
  {
    id: 'lr-6',
    name: 'Kinetic Coffee Table',
    price: 59999,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=400',
    description: 'Moving parts that evolve with your usage, featuring a hidden induction charging surface.',
    room: 'Living Room',
    rating: 4.9,
    features: ['Induction Surface', 'Hidden Storage', 'Moving Top']
  },
  {
    id: 'lr-7',
    name: 'Atmosphere Scrubber',
    price: 18999,
    category: 'Climate',
    image: 'https://images.unsplash.com/photo-1585336139118-b31bdec86dd1?auto=format&fit=crop&q=80&w=400',
    description: 'Molecular level filtration that removes carbon and pollutants instantly.',
    room: 'Living Room',
    rating: 4.8,
    features: ['HEPA-9 Ionizer', 'VOC Detection', 'Silence Mode']
  },
  {
    id: 'lr-8',
    name: 'Grav-Lift Bookcase',
    price: 74999,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&q=80&w=400',
    description: 'Electromagnetic shelving that holds your data and books in mid-air.',
    room: 'Living Room',
    rating: 4.6,
    features: ['Floating Shelves', 'LED Backlighting', 'Security Lock']
  },
  {
    id: 'lr-9',
    name: 'Photon Drapes',
    price: 12999,
    category: 'Decor',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400',
    description: 'Light-sensitive curtains that transition from opaque to transparent based on sun intensity.',
    room: 'Living Room',
    rating: 4.5,
    features: ['Voice Control', 'Heat Blocking', 'Color Shift']
  },
  {
    id: 'lr-10',
    name: 'AI Fireplace Node',
    price: 45999,
    category: 'Climate',
    image: 'https://images.unsplash.com/photo-1549468057-5b6fb300121a?auto=format&fit=crop&q=80&w=400',
    description: 'Virtual flame simulation with physical heat emission and scent emitters.',
    room: 'Living Room',
    rating: 4.8,
    features: ['Safe-Touch', 'Scent Diffuser', 'Custom Flames']
  },

  // BEDROOM (10 Items)
  {
    id: 'br-1',
    name: 'Neon Ambient Strips',
    price: 2999,
    category: 'Lighting',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400',
    description: 'Sync your home with your mood. Over 16 million colors with dynamic flow.',
    room: 'Bedroom',
    rating: 4.7,
    features: ['Music Sync', 'App Control', 'Ultra-Bright']
  },
  {
    id: 'br-2',
    name: 'Aura Sleep Mask',
    price: 3499,
    category: 'Health',
    image: 'https://images.unsplash.com/photo-1512446813333-e7a932ce7c69?auto=format&fit=crop&q=80&w=400',
    description: 'Smart light therapy for deeper REM sleep and gentle wake-up calls.',
    room: 'Bedroom',
    rating: 4.9,
    features: ['Light Therapy', 'Sleep Tracking', 'Comfort Fit']
  },
  {
    id: 'br-3',
    name: 'Deep Sleep Pod',
    price: 289999,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80&w=400',
    description: 'Isolation chamber with climate control and spatial audio for the ultimate rest.',
    room: 'Bedroom',
    rating: 5.0,
    features: ['Oxygen Enrich', 'Zero-G Mode', 'Soundproof']
  },
  {
    id: 'br-4',
    name: 'Scent Synth Diffuser',
    price: 7999,
    category: 'Health',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400',
    description: 'Digitally recreate any relaxing environment through precise molecular scent synthesis.',
    room: 'Bedroom',
    rating: 4.6,
    features: ['App Scheduled', 'Refill Alerts', 'Multi-Scent']
  },
  {
    id: 'br-5',
    name: 'Zero-G Mattress Node',
    price: 149999,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1505693415957-285a9bc47346?auto=format&fit=crop&q=80&w=400',
    description: 'Floating sensation bed with smart support that prevents any pressure points.',
    room: 'Bedroom',
    rating: 4.9,
    features: ['Heating/Cooling', 'Snore Detect', 'Massage Hub']
  },
  {
    id: 'br-6',
    name: 'Circadian Light Panel',
    price: 14999,
    category: 'Lighting',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=400',
    description: 'Simulate natural sunrise and sunset rhythms to regulate your internal biological clock.',
    room: 'Bedroom',
    rating: 4.8,
    features: ['Full Spectrum', 'Gradual Wake', 'App Sync']
  },
  {
    id: 'br-7',
    name: 'Bio-Metric Nightstand',
    price: 22999,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1551298370-9d3d5a3e2872?auto=format&fit=crop&q=80&w=400',
    description: 'Unlocks via fingerprint. Features 50W wireless charging and self-cleaning tech.',
    room: 'Bedroom',
    rating: 4.7,
    features: ['Biometric Lock', 'UV Cleaner', 'Quick Charge']
  },
  {
    id: 'br-8',
    name: 'Dream Capture Module',
    price: 54999,
    category: 'Health',
    image: 'https://images.unsplash.com/photo-1526733158173-e1b231f31f21?auto=format&fit=crop&q=80&w=400',
    description: 'Non-invasive brainwave sensor that journals your sleep themes and patterns.',
    room: 'Bedroom',
    rating: 4.3,
    features: ['Neural Mapping', 'Privacy Lock', 'Insight Reports']
  },
  {
    id: 'br-9',
    name: 'Soundproof Void Curtains',
    price: 19999,
    category: 'Decor',
    image: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&q=80&w=400',
    description: 'Multi-layer acoustic fabric that blocks 95% of external city noise.',
    room: 'Bedroom',
    rating: 4.6,
    features: ['Blackout Tech', 'Magnetic Seal', 'Dust Repellent']
  },
  {
    id: 'br-10',
    name: 'Thermal Comfort Duvet',
    price: 11999,
    category: 'Health',
    image: 'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?auto=format&fit=crop&q=80&w=400',
    description: 'Phase-change material that maintains a constant 22°C regardless of room temperature.',
    room: 'Bedroom',
    rating: 4.7,
    features: ['Hypoallergenic', 'Breathable', 'Self-Ironing']
  },

  // KITCHEN (10 Items)
  {
    id: 'kt-1',
    name: 'Cyber Kettle Pro',
    price: 5499,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3ecc50f1?auto=format&fit=crop&q=80&w=400',
    description: 'Boil water at precise temperatures via your smartphone.',
    room: 'Kitchen',
    rating: 4.5,
    features: ['Precision Temp', 'Remote Start', 'Energy Save']
  },
  {
    id: 'kt-2',
    name: 'Molecular Food Printer',
    price: 389999,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1582281227203-73a97e5e3d19?auto=format&fit=crop&q=80&w=400',
    description: 'Construct gourmet meals from base nutrients with micron-level precision.',
    room: 'Kitchen',
    rating: 4.9,
    features: ['3D Texture Map', 'Nutrient Mix', 'Self-Clean']
  },
  {
    id: 'kt-3',
    name: 'Cryo-Freeze Refrigerator',
    price: 249999,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
    description: 'Maintains freshness indefinitely using gas-shielded storage technology.',
    room: 'Kitchen',
    rating: 4.8,
    features: ['Inventory Scan', 'Auto-Order', 'Gas Shield']
  },
  {
    id: 'kt-4',
    name: 'Induction Flux Hob',
    price: 65999,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1583002237000-845a76da0592?auto=format&fit=crop&q=80&w=400',
    description: 'High-speed cookware detection and instant energy transfer with 99% efficiency.',
    room: 'Kitchen',
    rating: 4.7,
    features: ['Cool-Touch', 'Multi-Zone', 'Timer Sync']
  },
  {
    id: 'kt-5',
    name: 'Nutrient Scanner Pro',
    price: 12999,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=400',
    description: 'Instant analysis of chemical composition and nutritional value of any ingredient.',
    room: 'Kitchen',
    rating: 4.4,
    features: ['Allergen Alert', 'Calorie Count', 'Pocket Size']
  },
  {
    id: 'kt-6',
    name: 'Sonic Dish Purifier',
    price: 44999,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1584622781564-1d9876ef9669?auto=format&fit=crop&q=80&w=400',
    description: 'Uses ultrasound waves to disintegrate oils and bacteria without water waste.',
    room: 'Kitchen',
    rating: 4.6,
    features: ['Waterless', 'Sanitizing UV', 'Fast Cycle']
  },
  {
    id: 'kt-7',
    name: 'Hydro-Mist Herb Garden',
    price: 8999,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=400',
    description: 'Automatic watering and nutrient misting for fresh kitchen herbs year-round.',
    room: 'Kitchen',
    rating: 4.5,
    features: ['LED Grow Light', 'Level Sensor', 'Compact']
  },
  {
    id: 'kt-8',
    name: 'Rapid-Chill Wine Cellar',
    price: 54999,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=400',
    description: 'Peltier-effect cooling that brings bottles to optimal temperature in 120 seconds.',
    room: 'Kitchen',
    rating: 4.7,
    features: ['Dual Zone', 'Vibration Damp', 'Sommelier AI']
  },
  {
    id: 'kt-9',
    name: 'AI Recipe Holoscreen',
    price: 19999,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=400',
    description: 'Voice-guided cooking assistant that projects instructions onto your counter.',
    room: 'Kitchen',
    rating: 4.8,
    features: ['Gesture Control', 'Kitchen Guard', 'Recipe Library']
  },
  {
    id: 'kt-10',
    name: 'Smart Waste Recycler',
    price: 32999,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400',
    description: 'Automatically sorts and compacts waste, converting organics into plant compost.',
    room: 'Kitchen',
    rating: 4.9,
    features: ['Odor Control', 'Auto Sorting', 'Compost Mode']
  },

  // BATHROOM (10 Items)
  {
    id: 'bt-1',
    name: 'Nexus Smart Mirror',
    price: 49999,
    category: 'Bathroom',
    image: 'https://images.unsplash.com/photo-1610494162455-d14ef46085a6?auto=format&fit=crop&q=80&w=400',
    description: 'Display your morning routine and vitality stats while you get ready.',
    room: 'Bathroom',
    rating: 4.7,
    features: ['Touch Display', 'Vitality Scan', 'Anti-Fog']
  },
  {
    id: 'bt-2',
    name: 'Sonic Rain Shower',
    price: 89999,
    category: 'Bathroom',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
    description: 'Haptic water pressure combined with aromatherapy for a neural reset.',
    room: 'Bathroom',
    rating: 4.9,
    features: ['LED Rainfall', 'Scent Infusion', 'Eco Purge']
  },
  {
    id: 'bt-3',
    name: 'Heat-Sync Towel Rail',
    price: 12999,
    category: 'Bathroom',
    image: 'https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?auto=format&fit=crop&q=80&w=400',
    description: 'Intelligent heating that warms towels exactly 5 minutes before you finish showering.',
    room: 'Bathroom',
    rating: 4.6,
    features: ['Auto Timer', 'Energy Opt', 'Sanitizing']
  },
  {
    id: 'bt-4',
    name: 'Bio-Health Seat',
    price: 114999,
    category: 'Bathroom',
    image: 'https://images.unsplash.com/photo-1585338927000-1c787b17eb5e?auto=format&fit=crop&q=80&w=400',
    description: 'Full analysis of hydration and electrolyte levels daily.',
    room: 'Bathroom',
    rating: 4.8,
    features: ['Self Clean', 'Heated Seat', 'Air Dryer']
  },
  {
    id: 'bt-5',
    name: 'Aqua-Flow Reclaimer',
    price: 67999,
    category: 'Bathroom',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400',
    description: 'Real-time gray water filtration for a zero-waste bathroom cycle.',
    room: 'Bathroom',
    rating: 4.5,
    features: ['UV Filter', 'Compact Dev', 'Leak Guard']
  },
  {
    id: 'bt-6',
    name: 'Nano-Mist Skin Node',
    price: 28999,
    category: 'Health',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400',
    description: 'Dispense microscopic skincare droplets for optimal transdermal absorption.',
    room: 'Bathroom',
    rating: 4.7,
    features: ['Skin Scan', 'Formula Mix', 'Cooling']
  },
  {
    id: 'bt-7',
    name: 'UV Sterilization Chamber',
    price: 15999,
    category: 'Health',
    image: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&q=80&w=400',
    description: 'Ensures 99.9% hygiene for your toothbrushes and makeup tools.',
    room: 'Bathroom',
    rating: 4.8,
    features: ['Fast Cycle', 'Wireless Power', 'Ozone Free']
  },
  {
    id: 'bt-8',
    name: 'Ambient Floor Warmers',
    price: 42999,
    category: 'Climate',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=400',
    description: 'Networked heating elements that track your early morning steps.',
    room: 'Bathroom',
    rating: 4.6,
    features: ['Zone Control', 'Neural Sync', 'Waterproof']
  },
  {
    id: 'bt-9',
    name: 'Digital Scale Nexus',
    price: 5999,
    category: 'Health',
    image: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=400',
    description: 'Measures body composition and syncs to your personal health cloud.',
    room: 'Bathroom',
    rating: 4.7,
    features: ['Body Fat %', 'Muscle Mass', 'App Sync']
  },
  {
    id: 'bt-10',
    name: 'Chromatherapy Bath',
    price: 154999,
    category: 'Health',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=400',
    description: 'Rejuvenating water treatments using specific light frequencies for stress relief.',
    room: 'Bathroom',
    rating: 4.9,
    features: ['Full Spectrum', 'Silent Pump', 'Ozone Clean']
  },

  // HOME OFFICE (10 Items)
  {
    id: 'of-1',
    name: 'Neural Link Workdesk',
    price: 184999,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=400',
    description: 'Intelligent height adjustment and integrated touch surface for ultimate focus.',
    room: 'Home Office',
    rating: 4.9,
    features: ['Built-in OLED', 'Wireless Dock', 'Cable Void']
  },
  {
    id: 'of-2',
    name: 'Ergo-Flux Hover Chair',
    price: 94999,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&q=80&w=400',
    description: 'Dynamic weight distribution that minimizes spine strain during long sessions.',
    room: 'Home Office',
    rating: 4.8,
    features: ['Self Adjusting', 'Pore-Tech Fabric', 'Posture Guard']
  },
  {
    id: 'of-3',
    name: 'Quantum Desktop Node',
    price: 449999,
    category: 'Central Control',
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=400',
    description: 'The ultimate processing center for complex workflows and data simulation.',
    room: 'Home Office',
    rating: 5.0,
    features: ['Liquid Nitro Cool', 'Terabyte Sync', 'Zero Heat']
  },
  {
    id: 'of-4',
    name: 'Retina-Safe LED Blade',
    price: 18999,
    category: 'Lighting',
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=400',
    description: 'Flicker-free task light with adjustable color temp to prevent eye fatigue.',
    room: 'Home Office',
    rating: 4.7,
    features: ['Eye-Care Mode', 'Dimmable', 'Minimal Footprint']
  },
  {
    id: 'of-5',
    name: 'Focus Shield Canceller',
    price: 34999,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
    description: 'Active white-noise field generator that creates a personal cube of silence.',
    room: 'Home Office',
    rating: 4.6,
    features: ['AI Adaptive', 'Voice Isolate', 'USB-C Charging']
  },
  {
    id: 'of-6',
    name: 'Data-Stream Wall Panel',
    price: 79999,
    category: 'Central Control',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400',
    description: 'Large scale transparent display for monitoring global network logs.',
    room: 'Home Office',
    rating: 4.5,
    features: ['Multi-Touch', 'Glass Substrate', 'Low Power']
  },
  {
    id: 'of-7',
    name: 'Bio-Auth Keyboard',
    price: 12999,
    category: 'Central Control',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=400',
    description: 'Mechanical keys with integrated blood-oxygen and pulse sensors.',
    room: 'Home Office',
    rating: 4.7,
    features: ['Health Alerts', 'Tactile RGB', 'Wireless']
  },
  {
    id: 'of-8',
    name: 'Synapse Link Mouse',
    price: 8999,
    category: 'Central Control',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=400',
    description: 'Zero-friction gliding with ultra-high resolution biometric tracking.',
    room: 'Home Office',
    rating: 4.8,
    features: ['8000 DPI', 'Titanium Body', 'Sync Wheel']
  },
  {
    id: 'of-9',
    name: 'VR Collaboration Suite',
    price: 124999,
    category: 'Central Control',
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=400',
    description: 'High-fidelity headset for remote team syncs in virtual neural environments.',
    room: 'Home Office',
    rating: 4.9,
    features: ['Wide FOV', 'Eye Tracking', 'Haptic Pad']
  },
  {
    id: 'of-10',
    name: 'UPS Energy Pod',
    price: 24999,
    category: 'Central Control',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=400',
    description: 'Emergency battery backup that can power your main node for 12 hours.',
    room: 'Home Office',
    rating: 4.8,
    features: ['Graphene Tech', 'Fast Charge', 'Safe Shutdown']
  },
  // ENTRANCE (10 Items)
  {
    id: 'en-1',
    name: 'Iris Security Cam',
    price: 8999,
    category: 'Security',
    image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&q=80&w=400',
    description: 'Advanced biometric tracking and night vision. Total peace of mind.',
    room: 'Entrance',
    rating: 4.6,
    features: ['4K Vision', 'Neural Face ID', 'Cloud Backup']
  },
  {
    id: 'en-2',
    name: 'Bio-Scan Door Lock',
    price: 15499,
    category: 'Security',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=400',
    description: 'Multi-factor biometric entry system with neural palm-vein recognition.',
    room: 'Entrance',
    rating: 4.9,
    features: ['PalmVein ID', 'Remote Unlock', 'Anti-Tamper']
  },
  {
    id: 'en-3',
    name: 'Neural Guard Drone',
    price: 45999,
    category: 'Security',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=400',
    description: 'Autonomous patrol unit that monitors your perimeter with thermal optics.',
    room: 'Entrance',
    rating: 4.7,
    features: ['Thermal Vision', 'Auto Dock', 'Silent Prop']
  },
  {
    id: 'en-4',
    name: 'Smart Welcome Panel',
    price: 12999,
    category: 'Central Control',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=400',
    description: 'Greets guests and delivers messages using high-fidelity spatial audio.',
    room: 'Entrance',
    rating: 4.5,
    features: ['Face Recognition', 'Voice Synth', 'Guest Journal']
  },
  {
    id: 'en-5',
    name: 'Identity Prism',
    price: 3499,
    category: 'Security',
    image: 'https://images.unsplash.com/photo-1526733158173-e1b231f31f21?auto=format&fit=crop&q=80&w=400',
    description: 'Encrypted key fob with hardware-level biometric validation.',
    room: 'Entrance',
    rating: 4.8,
    features: ['AES-256', 'Fingerprint', 'Proximity Link']
  },
  {
    id: 'en-6',
    name: 'Atmospheric Air Lock',
    price: 89999,
    category: 'Climate',
    image: 'https://images.unsplash.com/photo-1510000084349-1b3b22e43c8d?auto=format&fit=crop&q=80&w=400',
    description: 'Ensures zero dust intrusion when entering from the external environment.',
    room: 'Entrance',
    rating: 4.6,
    features: ['Pressurized', 'Particle Sweep', 'UV Sterilize']
  },
  {
    id: 'en-7',
    name: 'Parcel Vault',
    price: 22999,
    category: 'Security',
    image: 'https://images.unsplash.com/photo-1586528116311-ad863c17d05f?auto=format&fit=crop&q=80&w=400',
    description: 'Secure, temperature-controlled delivery box for autonomous courier drops.',
    room: 'Entrance',
    rating: 4.7,
    features: ['Temp Control', 'Anti-Theft', 'App Notify']
  },
  {
    id: 'en-8',
    name: 'Neural Welcome Mat',
    price: 4999,
    category: 'Decor',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400',
    description: 'Detects weight signatures to identify who just arrived.',
    room: 'Entrance',
    rating: 4.2,
    features: ['Weight Tracking', 'Self Cleaning', 'RGB Edge']
  },
  {
    id: 'en-9',
    name: 'Light-Field Entry Wall',
    price: 124999,
    category: 'Decor',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=400',
    description: 'Dynamic light display that reacts to your presence as you walk in.',
    room: 'Entrance',
    rating: 4.9,
    features: ['Reactive Light', 'Energy Eff', 'Custom Art']
  },
  {
    id: 'en-10',
    name: 'Smart Mirror Entrance',
    price: 38999,
    category: 'Decor',
    image: 'https://images.unsplash.com/photo-1512446813333-e7a932ce7c69?auto=format&fit=crop&q=80&w=400',
    description: 'Provides last-minute weather and transport updates before you leave.',
    room: 'Entrance',
    rating: 4.7,
    features: ['Traffic Data', 'Outift Suggest', 'Touch Screen']
  },

  // GARAGE (10 Items)
  {
    id: 'gr-1',
    name: 'Hyper-Charge Dock',
    price: 54999,
    category: 'Energy',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=400',
    description: '800V rapid charging station with wireless induction plates.',
    room: 'Garage',
    rating: 4.9,
    features: ['Wireless Plate', '800V DC', 'Smart Grid']
  },
  {
    id: 'gr-2',
    name: 'Auto-Mech Toolbench',
    price: 129999,
    category: 'Maintenance',
    image: 'https://images.unsplash.com/photo-1530124560676-587cab91df31?auto=format&fit=crop&q=80&w=400',
    description: 'Robotic assembly station that assists with vehicle tuning and repair.',
    room: 'Garage',
    rating: 4.8,
    features: ['Robotic Arms', 'Parts Scan', 'Neural Guide']
  },
  {
    id: 'gr-3',
    name: 'Nano-Coat Sprayer',
    price: 14999,
    category: 'Maintenance',
    image: 'https://images.unsplash.com/photo-1532453288151-a3194a404394?auto=format&fit=crop&q=80&w=400',
    description: 'Applies a microscopic ceramic layer that repels all dirt and water.',
    room: 'Garage',
    rating: 4.7,
    features: ['Hydrophobic', 'UV Protection', 'Easy App']
  },
  {
    id: 'gr-4',
    name: 'Vehicle Health Node',
    price: 7999,
    category: 'Energy',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=400',
    description: 'OBD-III scanner that predicts maintenance needs using AI.',
    room: 'Garage',
    rating: 4.5,
    features: ['Predictive AI', 'Live Telemetry', 'App Alerts']
  },
  {
    id: 'gr-5',
    name: 'Grav-Lift Hoist',
    price: 84999,
    category: 'Maintenance',
    image: 'https://images.unsplash.com/photo-1568698338583-2f8016594d89?auto=format&fit=crop&q=80&w=400',
    description: 'Magnetic levitation system to lift vehicles for low-clearance inspection.',
    room: 'Garage',
    rating: 4.9,
    features: ['3-Ton Cap', 'Fail-Safe Lock', 'Silent Ops']
  },
  {
    id: 'gr-6',
    name: 'Clean-Room Scrubber',
    price: 24999,
    category: 'Climate',
    image: 'https://images.unsplash.com/photo-1582281227203-73a97e5e3d19?auto=format&fit=crop&q=80&w=400',
    description: 'Industrial grade filtration for workspaces with heavy chemical usage.',
    room: 'Garage',
    rating: 4.6,
    features: ['Fume Isolate', 'Hepa-14', 'Spark Safe']
  },
  {
    id: 'gr-7',
    name: 'Smart Storage Lockers',
    price: 18999,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&q=80&w=400',
    description: 'Inventory-tracking lockers that tell you exactly where your tools are.',
    room: 'Garage',
    rating: 4.4,
    features: ['RFID Tracking', 'Modular', 'Steal Plate']
  },
  {
    id: 'gr-8',
    name: 'Drone Bay Station',
    price: 32999,
    category: 'Maintenance',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=400',
    description: 'A launch and maintenance pad for your personal delivery and guard drones.',
    room: 'Garage',
    rating: 4.7,
    features: ['Auto Refuel', 'Data Sync', 'Weather Proof']
  },
  {
    id: 'gr-9',
    name: 'Workshop Cinema Node',
    price: 15999,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=400',
    description: 'Ruggedized spatial audio and projection for working environments.',
    room: 'Garage',
    rating: 4.5,
    features: ['Shock Proof', 'Dust Proof', 'High Bright']
  },
  {
    id: 'gr-10',
    name: 'Cyber-Energy Wall',
    price: 199999,
    category: 'Energy',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=400',
    description: 'Large scale solid-state battery for powering your entire AIT-THM ecosystem.',
    room: 'Garage',
    rating: 5.0,
    features: ['Solid State', 'Modular', 'Grid Backup']
  },

  // GARDEN (10 Items)
  {
    id: 'gd-1',
    name: 'Bio-Sphere Dome',
    price: 489999,
    category: 'Climate',
    image: 'https://images.unsplash.com/photo-1582281227203-73a97e5e3d19?auto=format&fit=crop&q=80&w=400',
    description: 'Intelligent geodesic structure that creates a micro-climate for exotic flora.',
    room: 'Garden',
    rating: 4.9,
    features: ['UV Filtering', 'Auto Vent', 'Hurricane Safe']
  },
  {
    id: 'gd-2',
    name: 'Hydro-Drone Swarm',
    price: 65999,
    category: 'Maintenance',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=400',
    description: 'Miniature drones that target individual leaves for precision hydration.',
    room: 'Garden',
    rating: 4.8,
    features: ['Precision Mist', 'Thermal Sensing', 'Quiet']
  },
  {
    id: 'gd-3',
    name: 'Neural Soil Monitors',
    price: 12999,
    category: 'Garden',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=400',
    description: 'Networked sensors that analyze nutrient levels at a molecular level.',
    room: 'Garden',
    rating: 4.7,
    features: ['NPK Analysis', 'PH Tracking', 'LoRa Sync']
  },
  {
    id: 'gd-4',
    name: 'Solar-Sails Gen 4',
    price: 89999,
    category: 'Energy',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=400',
    description: 'Flexible, high-efficiency solar fabric for shading and energy harvesting.',
    room: 'Garden',
    rating: 4.6,
    features: ['90% Eff', 'Flex-Poly', 'Auto Retract']
  },
  {
    id: 'gd-5',
    name: 'Acoustic Bird Drone',
    price: 8999,
    category: 'Decor',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=400',
    description: 'Mimics bird calls and behavior to create a natural acoustic environment.',
    room: 'Garden',
    rating: 4.4,
    features: ['Organic Move', 'Soundscape AI', 'Bio-Mimic']
  },
  {
    id: 'gd-6',
    name: 'Atmospheric Harvester',
    price: 54999,
    category: 'Climate',
    image: 'https://images.unsplash.com/photo-1585336139118-b31bdec86dd1?auto=format&fit=crop&q=80&w=400',
    description: 'Extracts pure drinking water from humidity with zero energy waste.',
    room: 'Garden',
    rating: 4.7,
    features: ['Self Filter', '10L/Day', 'Off-Grid Ready']
  },
  {
    id: 'gd-7',
    name: 'Kinetic Garden Light',
    price: 4999,
    category: 'Lighting',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=400',
    description: 'Wind-powered illuminators that sway and glow with the breeze.',
    room: 'Garden',
    rating: 4.5,
    features: ['Wind Powered', 'RGBW', 'Weatherproof']
  },
  {
    id: 'gd-8',
    name: 'Bio-Compost Node',
    price: 15999,
    category: 'Maintenance',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400',
    description: 'Microbial breakdown system that converts waste into high-grade fertilizer overnight.',
    room: 'Garden',
    rating: 4.8,
    features: ['Odor Filter', 'Fast Process', 'App Data']
  },
  {
    id: 'gd-9',
    name: 'Smart Irrigation Tap',
    price: 3499,
    category: 'Garden',
    image: 'https://images.unsplash.com/photo-1584622781564-1d9876ef9669?auto=format&fit=crop&q=80&w=400',
    description: 'Predictive watering based on upcoming weather patterns and soil data.',
    room: 'Garden',
    rating: 4.6,
    features: ['Zigbee 3.0', 'Leak Detect', 'Solar Power']
  },
  {
    id: 'gd-10',
    name: 'Nebula Mist System',
    price: 28999,
    category: 'Climate',
    image: 'https://images.unsplash.com/photo-1549468057-5b6fb300121a?auto=format&fit=crop&q=80&w=400',
    description: 'Creates a cooling holographic fog for evening relaxation.',
    room: 'Garden',
    rating: 4.9,
    features: ['Cooling Mist', 'Projection Map', 'Safe Fluid']
  },

  // HOME THEATER (10 Items)
  {
    id: 'th-1',
    name: 'Quantum Projector 8K',
    price: 549999,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1535016120720-40c646bebb70?auto=format&fit=crop&q=80&w=400',
    description: 'Laser-driven 8K resolution with infinite contrast and true black levels.',
    room: 'Home Theater',
    rating: 5.0,
    features: ['8K Laser', '10,000 Nits', 'HDR 2000']
  },
  {
    id: 'th-2',
    name: 'Audio-Spatial Sphere',
    price: 124999,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&q=80&w=400',
    description: 'True 360-degree object-based audio for a complete sonic immersion.',
    room: 'Home Theater',
    rating: 4.9,
    features: ['Atmos Gen 2', 'Wireless', 'Auto Calib']
  },
  {
    id: 'th-3',
    name: 'Neural Haptic Seat',
    price: 89999,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1544111300-84c47f9f303a?auto=format&fit=crop&q=80&w=400',
    description: 'Syncs with on-screen action to provide precise physical feedback.',
    room: 'Home Theater',
    rating: 4.8,
    features: ['Bass Shaker', 'Reclining', 'Integrated Cold-Cup']
  },
  {
    id: 'th-4',
    name: 'Black-Hole Screen',
    price: 299999,
    category: 'Decor',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba326b?auto=format&fit=crop&q=80&w=400',
    description: 'Ultra-absorbent material that eliminates all room reflections for perfect contrast.',
    room: 'Home Theater',
    rating: 4.9,
    features: ['VantaBlack Tech', 'Motorized', 'ALR']
  },
  {
    id: 'th-5',
    name: 'Atmos Purifier Node',
    price: 24999,
    category: 'Climate',
    image: 'https://images.unsplash.com/photo-1585336139118-b31bdec86dd1?auto=format&fit=crop&q=80&w=400',
    description: 'Silent air cleaning with oxygen enrichment to keep you alert during marathons.',
    room: 'Home Theater',
    rating: 4.7,
    features: ['O2 Boost', 'Zero DB', 'UV-C Clean']
  },
  {
    id: 'th-6',
    name: 'Smart Popcorn Synth',
    price: 15999,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1578912853046-0647ce98983f?auto=format&fit=crop&q=80&w=400',
    description: 'Perfectly seasons and pops snacks with custom flavor cartridges.',
    room: 'Home Theater',
    rating: 4.6,
    features: ['Flavor Injection', 'Rapid Heat', 'App Queue']
  },
  {
    id: 'th-7',
    name: 'Cinema Guard AI',
    price: 8999,
    category: 'Security',
    image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&q=80&w=400',
    description: 'Monitors external activity and pauses playback if someone is at the door.',
    room: 'Home Theater',
    rating: 4.5,
    features: ['Auto Pause', 'Notification HUD', 'Face Scan']
  },
  {
    id: 'th-8',
    name: 'Nebula Lighting Kit',
    price: 19999,
    category: 'Lighting',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=400',
    description: 'Dynamic backlighting that expands the screen color space into the room.',
    room: 'Home Theater',
    rating: 4.8,
    features: ['HDMI Sync', '800 Zones', 'Zero Latency']
  },
  {
    id: 'th-9',
    name: 'Fiber-Optic Star Ceiling',
    price: 74999,
    category: 'Decor',
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=400',
    description: 'Thousands of twinkling lights that simulate the night sky above your seat.',
    room: 'Home Theater',
    rating: 4.9,
    features: ['Shooting Stars', 'App Control', 'Dimmable']
  },
  {
    id: 'th-10',
    name: 'Media Vault Rack',
    price: 45999,
    category: 'Central Control',
    image: 'https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&q=80&w=400',
    description: 'High-speed storage node for housing thousands of 8K uncompressed films.',
    room: 'Home Theater',
    rating: 4.8,
    features: ['RAID 6', 'Hot Swap', '10Gb NIC']
  }
];

export const ROOMS = [
  { id: 'living-room', name: 'Living Room', icon: 'Sofa', bg: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200' },
  { id: 'bedroom', name: 'Bedroom', icon: 'Bed', bg: '/src/assets/images/regenerated_image_1778050201544.jpg' },
  { id: 'kitchen', name: 'Kitchen', icon: 'CookingPot', bg: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200' },
  { id: 'bathroom', name: 'Bathroom', icon: 'Bath', bg: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=1200' },
  { id: 'home-office', name: 'Home Office', icon: 'Monitor', bg: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200' },
  { id: 'entrance', name: 'Entrance', icon: 'DoorOpen', bg: '/src/assets/images/regenerated_image_1778050212009.jpg' },
  { id: 'garage', name: 'Garage', icon: 'Car', bg: '/src/assets/images/regenerated_image_1778050207730.png' },
  { id: 'garden', name: 'Garden', icon: 'Leaf', bg: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1200' },
  { id: 'home-theater', name: 'Home Theater', icon: 'Tv', bg: '/src/assets/images/regenerated_image_1778050203762.png' },
];
