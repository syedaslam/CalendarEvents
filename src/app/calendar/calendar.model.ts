export class CalanderMonthModel {
    eventList!: EventDetailsModel[];
    date!: number;
    previousMonthDay!: boolean;
}

export class EventDetailsModel {
    eventDate!: number;
    eventName!: string;
    isFullDay!: boolean;
    eventStartTime!: number;
    eventEndTime!: number;
    eventDescription!: string;
    eventLocation!: string;
    eventId!: any;
}
