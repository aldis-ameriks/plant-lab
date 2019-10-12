import { differenceInDays, differenceInMinutes } from 'date-fns';
import { ema } from 'moving-averages';
import { Readings } from './graphql';

export const parseReadings = (readings: Readings) => {
  const { moisture, temperature, batteryVoltage, watered } = readings;

  const currentReading = {
    time: moisture[moisture.length - 1].time,
    moisture: moisture[moisture.length - 1].value,
    temperature: temperature[temperature.length - 1].value,
    batteryVoltage: batteryVoltage[batteryVoltage.length - 1].value,
  };

  const daysSinceLastWatered = watered ? differenceInDays(new Date(), new Date(watered)) : null;
  const minutesSinceLastReading = differenceInMinutes(new Date(), new Date(currentReading.time));

  const temperatureValues = temperature.map(t => t.value);
  const emaValues = ema(temperatureValues, temperatureValues.length / 2).map((value: number) => Math.round(value));
  const temperatureMovingAverage = emaValues
    .map((tr: number, index: number) => ({ time: temperature[index].time, value: tr }))
    .filter(Boolean);

  return {
    moisture,
    temperature: temperatureMovingAverage,
    batteryVoltage,
    currentReading,
    minutesSinceLastReading,
    daysSinceLastWatered,
  };
};
