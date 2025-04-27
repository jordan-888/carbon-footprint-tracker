const EMISSION_FACTORS = {
  transport: {
    car: 0.2, // kgCO2e per km
    bus: 0.1, // kgCO2e per km
    train: 0.05, // kgCO2e per km
    plane: 0.25 // kgCO2e per km
  },
  energy: {
    electricity: 0.5, // kgCO2e per kWh
    gas: 0.2, // kgCO2e per kWh
    oil: 0.3 // kgCO2e per kWh
  },
  food: {
    meat: 6.0, // kgCO2e per kg
    dairy: 2.0, // kgCO2e per kg
    vegetables: 0.5 // kgCO2e per kg
  }
};

const calculateCarbonFootprint = (type, category, amount) => {
  if (!EMISSION_FACTORS[type] || !EMISSION_FACTORS[type][category]) {
    return {
      value: 0,
      unit: 'kgCO2e'
    };
  }

  const emissionFactor = EMISSION_FACTORS[type][category];
  const carbonValue = amount.value * emissionFactor;

  return {
    value: parseFloat(carbonValue.toFixed(2)),
    unit: 'kgCO2e'
  };
};

module.exports = {
  calculateCarbonFootprint
};
