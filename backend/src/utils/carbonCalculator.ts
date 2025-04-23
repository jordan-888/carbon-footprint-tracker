// Emission factors (kg CO2e per unit)
const EMISSION_FACTORS = {
  transportation: {
    car: 0.2, // kg CO2e per km
    bus: 0.1, // kg CO2e per km
    train: 0.05, // kg CO2e per km
    plane: 0.25, // kg CO2e per km
    motorcycle: 0.15, // kg CO2e per km
    bicycle: 0, // kg CO2e per km
    walking: 0 // kg CO2e per km
  },
  energy: {
    electricity: 0.5, // kg CO2e per kWh
    natural_gas: 2.1, // kg CO2e per m³
    heating_oil: 2.7, // kg CO2e per liter
    propane: 1.5, // kg CO2e per liter
    wood: 0.4 // kg CO2e per kg
  },
  food: {
    beef: 27, // kg CO2e per kg
    pork: 12.1, // kg CO2e per kg
    chicken: 2.9, // kg CO2e per kg
    fish: 3, // kg CO2e per kg
    dairy: 2.4, // kg CO2e per kg
    vegetables: 0.2, // kg CO2e per kg
    fruits: 0.3, // kg CO2e per kg
    grains: 0.5 // kg CO2e per kg
  },
  waste: {
    general: 2.53, // kg CO2e per kg
    recycling: -0.21, // kg CO2e per kg (negative because it reduces emissions)
    composting: -0.1 // kg CO2e per kg (negative because it reduces emissions)
  }
};

export function calculateCarbonFootprint(
  type: string,
  category: string,
  amount: number
): number {
  const emissionFactor = EMISSION_FACTORS[type]?.[category];
  
  if (emissionFactor === undefined) {
    throw new Error(`Invalid activity type or category: ${type}, ${category}`);
  }

  return Number((emissionFactor * amount).toFixed(2));
} 