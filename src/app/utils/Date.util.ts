export class DateUtils {
  static today(): Date {
    let d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  static parse(date: string | Date): Date {
    let s;
    if (typeof date === 'string') s = date;
    else s = date.toString();

    if (s.length === 10)
      return new Date(date + 'T00:00:00'); // Ignoring timezone
    else return new Date(date);
  }

  static format(
    date: Date | undefined,
    formatS?:
      | 'YYYY-MM-DDThh:mm:ss'
      | 'YYYY-MM-DD'
      | 'DD/MM/YYYY'
      | 'hh:mm'
      | 'hh:mm:ss'
      | 'DD/MM/YYYY HH:mm'
      | 'DD/MM'
  ): string {
    if (!date) {
      return 'ERROR!';
    }
    let d = this.parse(date);
    switch (formatS) {
      case 'YYYY-MM-DDThh:mm:ss':
        return `${d.getFullYear()}-${this.getMmMonth(d)}-${this.getDdDay(
          d
        )}T${this.getHhHours(d)}:${this.getMmMinutes(d)}:${this.getSsSeconds(
          d
        )}`;
      case 'YYYY-MM-DD':
        return d.toISOString().split('T')[0];
      case 'DD/MM/YYYY':
        return `${this.getDdDay(d)}/${this.getMmMonth(d)}/${d.getFullYear()}`;
      case 'hh:mm':
        return `${this.getHhHours(d)}:${this.getMmMinutes(d)}`;
      case 'hh:mm:ss':
        return `${this.getHhHours(d)}:${this.getMmMinutes(
          d
        )}:${this.getSsSeconds(d)}`;
      case 'DD/MM/YYYY HH:mm':
        return `${this.getDdDay(d)}/${this.getMmMonth(
          d
        )}/${d.getFullYear()} ${this.getHhHours(d)}:${this.getMmMinutes(d)}`;
      case 'DD/MM':
        return `${this.getDdDay(d)}/${this.getMmMonth(d)}`;
      default:
        return d.toISOString();
    }
  }

  static getDdDay(date: Date): string {
    const dateD = date.getDate();
    return dateD < 10 ? '0' + dateD : dateD.toString();
  }

  static getMmMonth(date: Date): string {
    const dateM = date.getMonth() + 1;
    return dateM < 10 ? '0' + dateM : dateM.toString();
  }

  static getHhHours(date: Date): string {
    const dateH = date.getHours();
    return dateH < 10 ? '0' + dateH : dateH.toString();
  }

  static getMmMinutes(date: Date): string {
    const dateM = date.getMinutes();
    return dateM < 10 ? '0' + dateM : dateM.toString();
  }

  static getSsSeconds(date: Date): string {
    const dateS = date.getSeconds();
    return dateS < 10 ? '0' + dateS : dateS.toString();
  }

  static isAfter(date: Date, date2: Date): boolean {
    return date.getTime() > date2.getTime();
  }

  static isBefore(date: Date, date2: Date): boolean {
    return date.getTime() < date2.getTime();
  }

  static isSameDay(date: Date, date2: Date): boolean {
    if (!date || !date2) return false;
    return (
      date.getFullYear() === date2.getFullYear() &&
      date.getMonth() === date2.getMonth() &&
      date.getDate() === date2.getDate()
    );
  }
}
