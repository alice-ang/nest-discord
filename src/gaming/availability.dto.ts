import { StringOption } from 'necord';

export class AvailabilityDto {
  @StringOption({
    name: 'start_time',
    description: 'When you start being available (YYYY-MM-DD HH:mm)',
    required: true,
  })
  startTime: string;

  @StringOption({
    name: 'end_time',
    description: 'When you stop being available (YYYY-MM-DD HH:mm)',
    required: true,
  })
  endTime: string;
}
