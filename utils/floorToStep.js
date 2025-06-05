function floorToStep(quantity, stepSize) {
  const precision = Math.floor(Math.log10(1 / parseFloat(stepSize)));
  return (Math.floor(quantity * Math.pow(10, precision)) / Math.pow(10, precision)).toFixed(precision);
}

module.exports = floorToStep;