import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { CalendarService } from '../calendar.service';
import { EventDetailsModel } from '../calendar.model';

@Component({
  selector: 'app-create-update-even',
  templateUrl: './create-update-even.component.html',
  styleUrls: ['./create-update-even.component.scss']
})
export class CreateUpdateEvenComponent {


  eventDate = new Date().setHours(0, 0, 0, 0);
  eventName = new FormControl('');
  isFullDay = new FormControl(false);
  eventLocation = new FormControl('');
  startTime = new FormControl(0);
  endTime = new FormControl(0);
  eventDescription = new FormControl('');
  eventId = new FormControl(undefined);
  timings!: { title: string, value: number }[];
  isDeleteClicked: boolean = false;
  selectedEvent!: EventDetailsModel;
  eventList: any;

  constructor(public dialogRef: MatDialogRef<CreateUpdateEvenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private calService: CalendarService) {

  }

  ngOnInit(): void {
    this.timings = this.calService.generateTimeSequence(30, 48);
    if (this.data['eventDate']) this.eventDate = this.data['eventDate'];
    this.eventList = this.data['eventList'];
  }


  setIsAllDay(isFullDay: boolean) {
    this.isFullDay.setValue(isFullDay);
    if (isFullDay) {
      this.startTime.setValue(0);
      this.endTime.setValue(0);
    }
  }

  onSaveEvent() {
    this.dialogRef.close({
      eventDate: this.eventDate,
      eventName: this.eventName.value,
      isFullDay: this.isFullDay.value,
      eventStartTime: this.startTime.value,
      eventEndTime: this.endTime.value,
      eventDescription: this.eventDescription.value,
      eventLocation: this.eventLocation.value,
      eventId: this.eventId.value
    })
  }

  deleteEvent(eventData: EventDetailsModel) {
    this.isDeleteClicked = true;
    this.selectedEvent = eventData;
  }

  editEvent(eventData: EventDetailsModel) {
    this.selectedEvent = eventData;
    this.eventDate = eventData['eventDate'];
    this.eventName.setValue(eventData['eventName'])
    this.isFullDay.setValue(eventData['isFullDay'])
    this.eventLocation.setValue(eventData['eventLocation'])
    this.startTime.setValue(eventData['eventStartTime'])
    this.endTime.setValue(eventData['eventEndTime'])
    this.eventDescription.setValue(eventData['eventDescription'])
    this.eventId.setValue(eventData['eventId']);
    this.eventList = undefined;
  }

  conformDelete(isDelete: boolean) {
    if (isDelete) {
      this.eventList = this.eventList.filter((ele: EventDetailsModel) => ele.eventId != this.selectedEvent.eventId)
      this.isDeleteClicked = false;
      this.calService.eventOnChangeObs.next({ type: 'delete', eventData: this.selectedEvent })
    } else {
      this.isDeleteClicked = false;
    }
  }

}
