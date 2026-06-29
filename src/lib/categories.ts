export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: Subcategory[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'engine',
    name: 'Engine Parts',
    icon: '⚙️',
    subcategories: [
      { id: 'timing', name: 'Timing & Belts' },
      { id: 'pistons', name: 'Pistons & Rings' },
      { id: 'gaskets', name: 'Gaskets & Seals' },
      { id: 'oil-pump', name: 'Oil Pump' },
      { id: 'crankshaft', name: 'Crankshaft' },
      { id: 'camshaft', name: 'Camshaft & Valves' },
      { id: 'turbo', name: 'Turbo & Supercharger' },
      { id: 'intake', name: 'Intake Manifold' },
      { id: 'exhaust-engine', name: 'Exhaust Manifold' },
      { id: 'engine-mount', name: 'Engine Mounts' },
    ],
  },
  {
    id: 'brakes',
    name: 'Brakes',
    icon: '🛑',
    subcategories: [
      { id: 'brake-discs', name: 'Brake Discs & Rotors' },
      { id: 'brake-pads', name: 'Brake Pads & Shoes' },
      { id: 'calipers', name: 'Calipers' },
      { id: 'brake-drums', name: 'Brake Drums' },
      { id: 'brake-lines', name: 'Brake Lines & Hoses' },
      { id: 'abs', name: 'ABS System' },
      { id: 'master-cylinder', name: 'Master Cylinder' },
      { id: 'handbrake', name: 'Handbrake / Parking Brake' },
    ],
  },
  {
    id: 'suspension',
    name: 'Suspension & Steering',
    icon: '🔩',
    subcategories: [
      { id: 'shock-absorbers', name: 'Shock Absorbers' },
      { id: 'springs', name: 'Springs & Coilovers' },
      { id: 'control-arms', name: 'Control Arms' },
      { id: 'tie-rods', name: 'Tie Rods & Rack' },
      { id: 'ball-joints', name: 'Ball Joints & Bushings' },
      { id: 'sway-bars', name: 'Sway Bars & Links' },
      { id: 'wheel-bearings', name: 'Wheel Bearings & Hubs' },
      { id: 'steering-pump', name: 'Power Steering Pump' },
    ],
  },
  {
    id: 'body',
    name: 'Body & Exterior',
    icon: '🚗',
    subcategories: [
      { id: 'bumpers', name: 'Bumpers' },
      { id: 'doors', name: 'Doors & Door Panels' },
      { id: 'hood-trunk', name: 'Hoods & Trunks' },
      { id: 'fenders', name: 'Fenders & Quarter Panels' },
      { id: 'mirrors', name: 'Wing Mirrors' },
      { id: 'glass', name: 'Windows & Windscreens' },
      { id: 'grilles', name: 'Grilles & Air Vents' },
      { id: 'spoilers', name: 'Spoilers & Body Kits' },
      { id: 'underbody', name: 'Underbody & Skid Plates' },
    ],
  },
  {
    id: 'electrical',
    name: 'Electrical',
    icon: '⚡',
    subcategories: [
      { id: 'ecu', name: 'ECU & Control Modules' },
      { id: 'sensors', name: 'Sensors (MAF, O2, MAP…)' },
      { id: 'alternators', name: 'Alternators' },
      { id: 'starters', name: 'Starters' },
      { id: 'batteries', name: 'Batteries' },
      { id: 'wiring', name: 'Wiring Harnesses' },
      { id: 'lighting', name: 'Headlights & Taillights' },
      { id: 'ac-electrics', name: 'A/C Electrical Parts' },
      { id: 'ignition', name: 'Ignition System' },
    ],
  },
  {
    id: 'transmission',
    name: 'Transmission & Drivetrain',
    icon: '🔧',
    subcategories: [
      { id: 'gearbox', name: 'Gearboxes (Manual / Auto)' },
      { id: 'clutch', name: 'Clutch Kit & Flywheel' },
      { id: 'differential', name: 'Differentials' },
      { id: 'driveshaft', name: 'Driveshafts' },
      { id: 'cv-joints', name: 'CV Joints & Axles' },
      { id: 'transfer-case', name: 'Transfer Cases (4WD)' },
    ],
  },
  {
    id: 'cooling',
    name: 'Cooling System',
    icon: '💧',
    subcategories: [
      { id: 'radiator', name: 'Radiators' },
      { id: 'thermostat', name: 'Thermostats' },
      { id: 'water-pump', name: 'Water Pumps' },
      { id: 'cooling-fan', name: 'Cooling Fans' },
      { id: 'intercooler', name: 'Intercoolers' },
      { id: 'hoses', name: 'Coolant Hoses & Clamps' },
    ],
  },
  {
    id: 'exhaust',
    name: 'Exhaust System',
    icon: '💨',
    subcategories: [
      { id: 'muffler', name: 'Mufflers & Silencers' },
      { id: 'catalytic', name: 'Catalytic Converters' },
      { id: 'dpf', name: 'DPF (Diesel Particulate Filter)' },
      { id: 'exhaust-pipes', name: 'Exhaust Pipes & Tips' },
    ],
  },
  {
    id: 'interior',
    name: 'Interior',
    icon: '💺',
    subcategories: [
      { id: 'seats', name: 'Seats & Seat Parts' },
      { id: 'dashboard', name: 'Dashboard & Cluster' },
      { id: 'door-cards', name: 'Door Cards & Trim' },
      { id: 'carpets', name: 'Carpets & Floor Mats' },
      { id: 'interior-mirrors', name: 'Interior Mirrors' },
      { id: 'steering-wheel', name: 'Steering Wheel' },
      { id: 'ac-interior', name: 'A/C & Heating' },
    ],
  },
  {
    id: 'tyres',
    name: 'Tyres & Wheels',
    icon: '🎯',
    subcategories: [
      { id: 'summer-tyres', name: 'Summer Tyres' },
      { id: 'winter-tyres', name: 'Winter Tyres' },
      { id: 'all-season', name: 'All-Season Tyres' },
      { id: 'alloy-wheels', name: 'Alloy Wheels' },
      { id: 'steel-wheels', name: 'Steel Wheels' },
      { id: 'spare', name: 'Spare Wheels & Kits' },
    ],
  },
  {
    id: 'filters',
    name: 'Filters & Fluids',
    icon: '🛢️',
    subcategories: [
      { id: 'oil-filter', name: 'Oil Filters' },
      { id: 'air-filter', name: 'Air Filters' },
      { id: 'fuel-filter', name: 'Fuel Filters' },
      { id: 'cabin-filter', name: 'Cabin Filters' },
      { id: 'engine-oil', name: 'Engine Oil' },
      { id: 'transmission-fluid', name: 'Transmission Fluid' },
    ],
  },
];

export const CATEGORIES_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
