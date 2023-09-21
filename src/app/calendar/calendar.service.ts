import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  eventList: any = {};

  eventOnChangeObs = new Subject();

  setEventDataToLocal() {
    localStorage.setItem('eventData', JSON.stringify(this.eventList));
  }

  getEventDataFromLocal() {
    if (localStorage.getItem('eventData')) {
      this.eventList = JSON.parse(localStorage.getItem('eventData') || '');
    }
  }

  clearLocalStorage() {
    localStorage.removeItem('eventData');
    this.eventList = {};
  }

  generateTimeSequence(intervalMinutes: number, numberOfIntervals: number) {
    const timeSequence = [];
    for (let i = 0; i < numberOfIntervals; i++) {
      const hours = Math.floor(i * intervalMinutes / 60);
      const minutes = i * intervalMinutes % 60;
      const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      const milliseconds = i * intervalMinutes * 60 * 1000;
      timeSequence.push({ title: formattedTime, value: milliseconds });
    }
    return timeSequence;
  }


}
