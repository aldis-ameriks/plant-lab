import { CronJob } from 'cron';
import { Logger } from 'fastify';
import { Inject, Service } from 'typedi';

import { NotificationType } from 'common/types/entities';
import { NotificationsService } from 'notifications/service';
import { Reading } from 'readings/models';
import { ReadingService } from 'readings/service';

@Service()
export class NotificationsCron {
  private readonly job;

  @Inject()
  private readonly readingService: ReadingService;

  @Inject()
  private readonly notificationsService: NotificationsService;

  @Inject('logger')
  private readonly logger: Logger;

  constructor() {
    this.job = new CronJob('* 0 * * * *', this.handleNotificationCron);
  }

  public start() {
    this.job.start();
  }

  handleNotificationCron = async () => {
    try {
      const readings = await this.readingService.getAllSensorLastAverageReadings();
      readings.forEach(this.handleReading);
    } catch (e) {
      this.logger.error('Notifications cron job failed', e);
    }
  };

  handleReading = async (reading: Reading): Promise<void> => {
    if (reading.moisture < 20) {
      await this.handleLowMoisture(reading);
    } else if (reading.battery_voltage < 2.5) {
      await this.handleLowBattery(reading);
    }
  };

  handleLowMoisture = async (reading: Reading) => {
    if (await this.hasUnsentNotification(reading.device_id, NotificationType.low_moisture)) {
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
    if (await this.hasUnsentNotification(reading.device_id, NotificationType.low_battery)) {
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

  hasUnsentNotification = async (deviceId: string, type: NotificationType) => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const lastNotificationTimestamp = await this.notificationsService.getLastNotificationTimestamp(deviceId, type);

    return (
      lastNotificationTimestamp &&
      (!lastNotificationTimestamp.sent_at ||
        (lastNotificationTimestamp && lastNotificationTimestamp.created_at > oneDayAgo))
    );
  };
}
