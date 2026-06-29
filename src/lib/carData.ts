export interface CarBrand {
  id: string;
  name: string;
  models: string[];
}

export const CAR_BRANDS: CarBrand[] = [
  { id: 'bmw', name: 'BMW', models: ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'M3', 'M4', 'M5', 'Z4'] },
  { id: 'mercedes', name: 'Mercedes-Benz', models: ['A-Class', 'B-Class', 'C-Class', 'E-Class', 'S-Class', 'CLA', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'AMG GT', 'SLK/SLC', 'Sprinter', 'Vito'] },
  { id: 'toyota', name: 'Toyota', models: ['Corolla', 'Camry', 'Yaris', 'Auris', 'Avensis', 'Prius', 'RAV4', 'Land Cruiser', 'Land Cruiser Prado', 'Hilux', 'Fortuner', 'CHR', 'Sequoia', 'Tundra'] },
  { id: 'volkswagen', name: 'Volkswagen', models: ['Golf', 'Polo', 'Passat', 'Jetta', 'Tiguan', 'Touareg', 'Touran', 'Sharan', 'Arteon', 'T-Roc', 'T-Cross', 'ID.3', 'ID.4', 'Transporter', 'Crafter'] },
  { id: 'audi', name: 'Audi', models: ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'e-tron', 'RS3', 'RS4', 'RS6'] },
  { id: 'ford', name: 'Ford', models: ['Fiesta', 'Focus', 'Mondeo', 'Fusion', 'Kuga', 'Explorer', 'Edge', 'Mustang', 'Ranger', 'Transit', 'Transit Connect', 'Galaxy'] },
  { id: 'opel', name: 'Opel / Vauxhall', models: ['Astra', 'Corsa', 'Insignia', 'Zafira', 'Mokka', 'Crossland', 'Grandland', 'Vectra', 'Meriva', 'Combo', 'Vivaro'] },
  { id: 'honda', name: 'Honda', models: ['Civic', 'Accord', 'CR-V', 'HR-V', 'Pilot', 'Jazz', 'Fit', 'Passport', 'Ridgeline', 'Element', 'Stream'] },
  { id: 'nissan', name: 'Nissan', models: ['Micra', 'Note', 'Juke', 'Qashqai', 'X-Trail', 'Murano', 'Pathfinder', 'Navara', 'Leaf', 'Primera', 'Almera', 'Patrol'] },
  { id: 'hyundai', name: 'Hyundai', models: ['i10', 'i20', 'i30', 'i40', 'Accent', 'Elantra', 'Tucson', 'Santa Fe', 'Kona', 'Ioniq', 'Sonata', 'H1', 'Creta'] },
  { id: 'kia', name: 'Kia', models: ['Picanto', 'Rio', 'Ceed', 'Sportage', 'Sorento', 'Stinger', 'Niro', 'Telluride', 'Carnival', 'Seltos', 'EV6'] },
  { id: 'mazda', name: 'Mazda', models: ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-5', 'CX-7', 'CX-9', 'MX-5', 'BT-50', 'RX-8'] },
  { id: 'subaru', name: 'Subaru', models: ['Impreza', 'Legacy', 'Outback', 'Forester', 'XV / Crosstrek', 'Ascent', 'BRZ', 'Trezia', 'Tribeca'] },
  { id: 'mitsubishi', name: 'Mitsubishi', models: ['Colt', 'Lancer', 'Galant', 'Eclipse', 'Outlander', 'Eclipse Cross', 'ASX', 'Pajero', 'L200', 'Montero Sport'] },
  { id: 'chevrolet', name: 'Chevrolet', models: ['Spark', 'Aveo', 'Cruze', 'Cobalt', 'Captiva', 'Equinox', 'Trailblazer', 'Malibu', 'Impala', 'Tahoe', 'Suburban', 'Silverado'] },
  { id: 'peugeot', name: 'Peugeot', models: ['107', '108', '206', '207', '208', '301', '307', '308', '408', '508', '2008', '3008', '5008', 'Partner', 'Expert', 'Boxer'] },
  { id: 'renault', name: 'Renault', models: ['Clio', 'Twingo', 'Megane', 'Laguna', 'Talisman', 'Fluence', 'Duster', 'Kadjar', 'Captur', 'Koleos', 'Scenic', 'Trafic', 'Master'] },
  { id: 'skoda', name: 'Škoda', models: ['Fabia', 'Rapid', 'Scala', 'Octavia', 'Superb', 'Karoq', 'Kodiaq', 'Kamiq', 'Yeti', 'Roomster'] },
  { id: 'seat', name: 'SEAT / Cupra', models: ['Ibiza', 'Arona', 'Leon', 'Ateca', 'Arona', 'Tarraco', 'Alhambra', 'Toledo', 'Exeo', 'Mii'] },
  { id: 'lexus', name: 'Lexus', models: ['CT', 'ES', 'IS', 'GS', 'LS', 'NX', 'RX', 'GX', 'LX', 'UX', 'LC', 'RC'] },
  { id: 'volvo', name: 'Volvo', models: ['S40', 'S60', 'S80', 'S90', 'V40', 'V60', 'V70', 'V90', 'XC40', 'XC60', 'XC70', 'XC90'] },
  { id: 'land-rover', name: 'Land Rover / Range Rover', models: ['Defender', 'Discovery', 'Discovery Sport', 'Freelander', 'Range Rover', 'Range Rover Sport', 'Range Rover Evoque', 'Range Rover Velar'] },
  { id: 'porsche', name: 'Porsche', models: ['911', 'Cayenne', 'Macan', 'Panamera', 'Boxster', 'Cayman', 'Taycan'] },
  { id: 'jeep', name: 'Jeep', models: ['Wrangler', 'Cherokee', 'Grand Cherokee', 'Compass', 'Renegade', 'Gladiator'] },
  { id: 'lada', name: 'Lada / AvtoVAZ', models: ['Vesta', 'Granta', 'XRAY', 'Niva', 'Samara', 'Priora', 'Kalina', '2106', '2107', '2109', '2110'] },
];

export const CAR_BRANDS_MAP = Object.fromEntries(CAR_BRANDS.map((b) => [b.id, b]));

export const GENERATION_YEARS: number[] = Array.from({ length: 36 }, (_, i) => 2025 - i);
