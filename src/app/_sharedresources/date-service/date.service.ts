import { Injectable } from '@angular/core';
import { format, formatISO, parse, parseISO } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  formatDate(date: Date | string, dateFormat: string = 'MM/dd/yyyy'): string {
    return format(new Date(date), dateFormat);
  }

  parseDate(date: string, dateFormat: string = 'MM/dd/yyyy'): Date {
    return parse(date, dateFormat, new Date());
  }

  timeToISO(value: string){
    const currentDate = new Date();
    const parsedTime = parse(value, 'hh:mm a', currentDate); // Parse the time
    const isoDate = formatISO(parsedTime); // Convert to ISO format
    return isoDate
  }

  paeseTime(value: string){
   
    const parsedTime = format(parseISO(value), 'hh:mm a');
    return parsedTime
  }
}
