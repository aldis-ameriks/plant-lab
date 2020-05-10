import { CronJob } from 'cron';
import { Logger } from 'fastify';

import { NotificationType } from 'notifications/models';
import { NotificationsService } from 'notifications/service';
import { Reading } from 'readings/models';
import { ReadingService } from 'readings/service';

export class NotificationsCron {
  private readonly readingService: ReadingService;
  private readonly notificationsService: NotificationsService;
  private readonly job;
  private readonly logger;

  constructor(logger: Logger) {
    this.logger = logger;
    this.readingService = new ReadingService();
    this.notificationsService = new NotificationsService();
    this.job = new CronJob('*/10 * * * * *', this.handleNotificationCron);
  }

  public start() {
    this.job.start();
  }

  handleNotificationCron = async () => {
    const readings = await this.readingService.getAllSensorLastAverageReadings();
    readings.forEach(this.handleReading);
  };

  handleReading = async (reading: Reading): Promise<void> => {
    if (reading.moisture < 20) {
      await this.handleLowMoisture(reading);
    } else if (reading.battery_voltage < 2.5) {
      await this.handleLowBattery(reading);
    }
  };

  handleLowMoisture = async (reading: Reading) => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const lastNotificationTimestamp = await this.notificationsService.getLastNotificationTimestamp(
      reading.device_id,
      NotificationType.low_moisture
    );

    if (lastNotificationTimestamp && lastNotificationTimestamp > oneDayAgo) {
      return;
    }

    this.logger.info('Creating low_moisture notification', reading.device_id);

    const title = 'Low moisture';
    const body = `Sensor ${reading.device_id} is reporting low moisture. Plant needs watering.`;

    await this.notificationsService.createDeviceNotification(
      reading.device_id,
      NotificationType.low_moisture,
      title,
      body
    );
  };

  handleLowBattery = async (reading: Reading) => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const lastNotificationTimestamp = await this.notificationsService.getLastNotificationTimestamp(
      reading.device_id,
      NotificationType.low_battery
    );

    if (lastNotificationTimestamp && lastNotificationTimestamp > oneDayAgo) {
      return;
    }

    this.logger.info('Creating low_battery notification', reading.device_id);

    const title = 'Low battery';
    const body = `Sensor ${reading.device_id} is reporting low battery. Change the battery.`;

    await this.notificationsService.createDeviceNotification(
      reading.device_id,
      NotificationType.low_battery,
      title,
      body
    );
  };
}
