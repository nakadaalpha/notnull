const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateSpecs = (brandName, model, year) => {
  // Generic but realistic high-end specs
  const condition = Math.random() > 0.5 ? "Baru" : "Pre-Owned";
  const mileage = condition === "Baru" ? "0 km" : `${Math.floor(Math.random() * 50) + 5}.000 km`;
  const trim = model.includes("GT") ? "GT Premium" : model.includes("RS") ? "RS Sport" : "Luxury Trim";
  
  const isElectric = model.includes("Taycan") || model.includes("Tron") || brandName === "Tesla";

  if (isElectric) {
    return {
      hero_specs: {
        trim,
        condition,
        mileage
      },
      performance: {
        engine_type: "Dual Electric Motors",
        horsepower: "600 HP (Combined)",
        torque: "800 Nm Instant Torque",
        transmission: "Single-Speed Direct Drive",
        drivetrain: "AWD",
        acceleration: "3.2s (0-100 km/h)"
      },
      dimensions: {
        length_width_height: "4963 x 1966 x 1379 mm",
        wheelbase: "2900 mm",
        curb_weight: "2140 kg",
        ground_clearance: "128 mm",
        fuel_capacity: "93.4 kWh Battery"
      },
      interior: {
        comfort: [
          "Material Jok: Sustainable Race-Tex / Leather-Free",
          "Pengaturan Kursi: Elektrik 14-Arah dengan Pemanas & Pendingin",
          "AC: Advanced Climate Control (Quad-zone)"
        ],
        infotainment: [
          "Layar: 16.8 inci Curved Display",
          "Konektivitas: Wireless Apple CarPlay & Android Auto",
          "Audio: Burmester 3D High-End Surround Sound",
          "Port: 4x USB-C Fast Charging, Wireless Charger"
        ],
        cockpit: [
          "Kemudi: Sport Multifungsi",
          "Instrumen: Full Digital Instrument Cluster",
          "Spion: Frameless Auto-dimming"
        ],
        utility: [
          "Trim: Carbon Fiber & Matte Black",
          "Bagasi: 407 Liter (Belakang) + 84 Liter (Depan/Frunk)",
          "Atap: Panoramic Glass Roof"
        ]
      },
      safety_and_features: {
        active_safety: ["Blind Spot Monitoring", "Lane Keep Assist", "Adaptive Cruise Control", "Night Vision Assist"],
        passive_safety: ["Advanced 8 Airbags System", "High-Strength Steel Chassis", "ISOFIX"],
        exterior_features: ["Matrix LED Headlights", "21-inch Aero Blades Wheels", "Active Aerodynamics"]
      }
    };
  }

  // ICE Engine Specs
  const hp = Math.floor(Math.random() * (650 - 300) + 300);
  const torque = hp + 150;
  
  return {
    hero_specs: {
      trim,
      condition,
      mileage
    },
    performance: {
      engine_type: "4.0L Twin-Turbo V8",
      horsepower: `${hp} HP @ 6500 RPM`,
      torque: `${torque} Nm @ 3500 RPM`,
      transmission: "8-Speed Dual Clutch (DCT)",
      drivetrain: "AWD (Rear-biased)",
      acceleration: "3.8s (0-100 km/h)"
    },
    dimensions: {
      length_width_height: "4924 x 1983 x 1696 mm",
      wheelbase: "2995 mm",
      curb_weight: "2200 kg",
      ground_clearance: "190 mm",
      fuel_capacity: "85 L"
    },
    interior: {
      comfort: [
        "Material Jok: Kulit Nappa Premium dengan Alcantara",
        "Pengaturan Kursi: Elektrik 18-Arah dengan Pijat & Pemanas",
        "AC: Auto Climate Control (Quad-zone)"
      ],
      infotainment: [
        "Layar: 12.3 inci Touchscreen System",
        "Konektivitas: Wireless Apple CarPlay & Android Auto",
        "Audio: Bang & Olufsen 3D Premium Sound System",
        "Port: 2x USB-C, 1x 12V, Wireless Smartphone Charger"
      ],
      cockpit: [
        "Kemudi: Berlapis Kulit dengan Tilt & Telescopic, Paddle Shifters",
        "Instrumen: Virtual Cockpit Digital Display",
        "Spion: Auto-dimming dengan Compass"
      ],
      utility: [
        "Trim: Open-pore Wood & Brushed Aluminium",
        "Bagasi: 605 Liter (Bisa diekspansi)",
        "Atap: Panoramic Sunroof"
      ]
    },
    safety_and_features: {
      active_safety: ["Blind Spot Monitoring", "Lane Keep Assist", "Adaptive Cruise Control", "Autonomous Emergency Braking"],
      passive_safety: ["10 Airbags", "Reinforced Rigid Chassis", "ISOFIX"],
      exterior_features: ["Laser LED Headlights", "22-inch Forged Alloy Wheels", "Soft-close Doors"]
    }
  };
};

async function main() {
  const cars = await prisma.car.findMany({ include: { brand: true } });
  let updatedCount = 0;

  for (const car of cars) {
    const specs = generateSpecs(car.brand.name, car.model, car.yearMade);
    await prisma.car.update({
      where: { id: car.id },
      data: { specifications: specs }
    });
    updatedCount++;
    console.log(`Updated specs for ${car.brand.name} ${car.model}`);
  }

  console.log(`\nSuccessfully updated ${updatedCount} cars with dynamic specifications.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
