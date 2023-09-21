import { Component } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { CalanderMonthModel, EventDetailsModel } from '../calendar.model';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { CreateUpdateEvenComponent } from '../create-update-even/create-update-even.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calander-view',
  templateUrl: './calander-view.component.html',
  styleUrls: ['./calander-view.component.scss']
})
export class CalanderViewComponent {

  viewDate = new Date();
  totalDaysOfMonth!: number;
  daysInMonth: CalanderMonthModel[] = [];
  today: number = new Date().setHours(0, 0, 0, 0);
  dropedData: any;
  eventChangeSubs!: Subscription;


  constructor(private calService: CalendarService, public dialog: MatDialog) {
    this.calService.getEventDataFromLocal();
  }

  ngOnInit(): void {
    this.getCurrentMonth();
    this.eventChangeSubs = this.calService.eventOnChangeObs.subscribe((res: any) => {
      if (res['type'] == 'create_update') {
        this.daysInMonth.forEach((ele: any) => {
          if (this.calService.eventList[ele['date']]) {
            ele['eventList'] = this.calService.eventList[ele['date']];
          }
        })
      } else if (res['type'] == 'delete') {
        this.daysInMonth.forEach((ele: any) => {
          if (ele['date'] == res['eventData']['eventDate']) {
            this.calService.eventList[res['eventData']['eventDate']].forEach((element: any, index: number) => {
              if (element['eventId'] == res['eventData']['eventId']) {
                this.calService.eventList[res['eventData']['eventDate']].splice(index, 1);
              }
            })
            ele['eventList'] = ele['eventList'].filter((event: any) => event['eventId'] != res['eventData']['eventId']);
            this.calService.setEventDataToLocal();
          }
        })
      } else if (res['type'] == 'clear_events') {
        this.calService.clearLocalStorage();
        this.daysInMonth.forEach((ele: any) => {
          ele['eventList'] = [];
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.eventChangeSubs.unsubscribe();
  }

  getCurrentMonth() {
    const day = new Date(this.viewDate).setDate(1);
    const monthStarts = new Date(day).setHours(0, 0, 0, 0);
    let firstDayMills = 0;
    const remDay = (new Date(day).getDay()) === 0 ? 7 : (new Date(day).getDay());
    let temp = 1;
    // To get Previous month dates.
    while (remDay > temp) {
      firstDayMills = new Date(moment(monthStarts).subtract(temp, 'days').format('LLLL')).getTime();
      this.daysInMonth.unshift({
        eventList: [],
        date: firstDayMills,
        previousMonthDay: true
      });
      temp++
    }
    // --------------------------------------
    this.totalDaysOfMonth = new Date(new Date(this.viewDate).getFullYear(), new Date(this.viewDate).getMonth() + 1, 0).getDate();
    for (let index = 1; index <= this.totalDaysOfMonth; index++) {
      const lastDayMills = new Date(new Date(this.viewDate).setDate(index)).setHours(0, 0, 0, 0);
      this.daysInMonth.push({
        eventList: this.calService.eventList[lastDayMills] || [],
        date: lastDayMills,
        previousMonthDay: false
      })
    }
  }

  changeMonth(isNextMonth: boolean) {
    this.viewDate = moment(this.viewDate).add(isNextMonth ? 1 : -1, 'month').toDate();
    this.daysInMonth = [];
    this.getCurrentMonth();
  }

  createEvent(date?: any, eventList?: EventDetailsModel[]) {
    if (!eventList && date < this.today) {
      return;
    }
    const dialogRef = this.dialog.open(CreateUpdateEvenComponent, {
      data: { eventDate: date, eventList: eventList },
      width: '40vw',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: EventDetailsModel) => {
      if (result) {
        this.renderEventData(result);
      }
    });
  }

  renderEventData(eventData: EventDetailsModel) {
    if (this.calService.eventList[eventData['eventDate']]) {
      if (eventData['eventId']) {
        const newArray = this.calService.eventList[eventData['eventDate']].map((element: EventDetailsModel) => {
          if (element['eventId'] == eventData['eventId']) {
            return eventData;
          } else {
            return element;
          }
        });
        this.calService.eventList[eventData['eventDate']] = newArray;
      } else {
        eventData['eventId'] = uuidv4();
        this.calService.eventList[eventData['eventDate']].push(eventData);
      }
    } else {
      eventData['eventId'] = uuidv4();
      this.calService.eventList[eventData['eventDate']] = [eventData];
    }
    this.calService.setEventDataToLocal();
    this.calService.eventOnChangeObs.next({ type: 'create_update' })
  }

  clearLocalStorage() {
    this.calService.eventOnChangeObs.next({ type: 'clear_events' });
  }

  onDragDrop(eventData: any, type: string) {
    if (type == 'drop' && eventData['date'] < this.today) {
      return;
    }
    if (type == 'drag') {
      this.dropedData = eventData;
    } else if (type == 'drop') {
      this.calService.eventList[this.dropedData['eventDate']] = this.calService.eventList[this.dropedData['eventDate']].filter((event: any) => event['eventId'] != this.dropedData['eventId']);
      if (this.calService.eventList[eventData['date']]) {
        this.dropedData['eventDate'] = eventData['date'];
        this.calService.eventList[eventData['date']].push(this.dropedData);
      } else {
        this.dropedData['eventDate'] = eventData['date'];
        this.calService.eventList[eventData['date']] = [this.dropedData];
      }
      this.calService.eventOnChangeObs.next({ type: 'create_update' })
      this.dropedData = undefined;
      this.calService.setEventDataToLocal();
    }
  }

}
