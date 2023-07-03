import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class LocalisationService {
  // Until Angular v8, angular cannot change locale on-the-fly - a complete app refresh is performed.
  // To get around this, we define our own locale date formats here and use these to format our dates/times.

  private readonly formats: any = {
    de: {
      shortDate: "dd.M.y",
      mediumDate: "d. MMM y",
      longDate: "d. MMMM y",
      shortDateTime: "HH:mm:ss dd.M.y",
      mediumDateTime: "HH:mm d. MMM y",
      longDateTime: "HH:mm d. MMMM y",
      monthNames: [
        { short: "Jan", long: "Januar" },
        { short: "Feb", long: "Februar" },
        { short: "März", long: "März" },
        { short: "Apt", long: "April" },
        { short: "Mai", long: "Mai" },
        { short: "Juni", long: "Juni" },
        { short: "Juli", long: "Juli" },
        { short: "Aug", long: "August" },
        { short: "Sept", long: "September" },
        { short: "Okt", long: "Oktober" },
        { short: "Nov", long: "November" },
        { short: "Dez", long: "Dezember" }
      ]
    },
    en: {
      shortDate: "dd/MM/y",
      mediumDate: "d MMM y",
      longDate: "d MMMM y",
      shortDateTime: "HH:mm:ss dd/MM/y",
      mediumDateTime: "HH:mm, dd MMM y",
      longDateTime: "HH:mm, dd MMMM y",
      shortTime: "HH:mm",
      monthNames: [
        { short: "Jan", long: "January" },
        { short: "Feb", long: "February" },
        { short: "Mar", long: "March" },
        { short: "Apr", long: "April" },
        { short: "May", long: "May" },
        { short: "Jun", long: "June" },
        { short: "Jul", long: "July" },
        { short: "Aug", long: "August" },
        { short: "Sep", long: "September" },
        { short: "Oct", long: "October" },
        { short: "Nov", long: "November" },
        { short: "Dec", long: "December" }
      ]
    },
    es: {
      shortDate: "d/M/y",
      mediumDate: "d MMM y",
      longDate: "d MMMM y",
      shortDateTime: "HH:mm:ss d/M/y",
      mediumDateTime: "HH:mm d MMM y",
      longDateTime: "h:mm d MMMM y",
      shortTime: "HH:mm",
      monthNames: [
        { short: "enero", long: "enero" },
        { short: "feb", long: "febrero" },
        { short: "marzo", long: "marzo" },
        { short: "abr", long: "abril" },
        { short: "mayo", long: "mayo" },
        { short: "jun", long: "junio" },
        { short: "jul", long: "julio" },
        { short: "agosto", long: "agosto" },
        { short: "set", long: "septiembre" },
        { short: "oct", long: "octubre" },
        { short: "nov", long: "noviembre" },
        { short: "dic", long: "diciembre" }
      ]
    },
    fr: {
      shortDate: "d/M/y",
      mediumDate: "d MMM y",
      longDate: "d MMMM y",
      shortDateTime: "HH:mm:ss d/M/y",
      mediumDateTime: "HH:mm, d MMM y",
      longDateTime: "HH:mm, d MMMM y",  
      shortTime: "HH:mm",
      monthNames: [
        { short: "janv", long: "janvier" },
        { short: "févr", long: "février" },
        { short: "mars", long: "mars" },
        { short: "avr", long: "avril" },
        { short: "mai", long: "mai" },
        { short: "juin", long: "juin" },
        { short: "juil", long: "juillet" },
        { short: "août", long: "août" },
        { short: "sept", long: "septembre" },
        { short: "oct", long: "octobre" },
        { short: "nov", long: "novembre" },
        { short: "déc", long: "décembre" }
      ]
    },
    it: {
      shortDate: "d/M/y",
      mediumDate: "d MMM y",
      longDate: "d MMMM y",
      shortDateTime: "HH:mm:ss d/M/y",
      mediumDateTime: "HH:mm d MMM y",
      longDateTime: "HH:mm d MMMM y",
      shortTime: "HH:mm",
      monthNames: [
        { short: "genn", long: "gennaio" },
        { short: "febbr", long: "febbraio" },
        { short: "mar", long: "marzo" },
        { short: "apr", long: "aprile" },
        { short: "magg", long: "maggio" },
        { short: "giugno", long: "giugno" },
        { short: "luglio", long: "luglio" },
        { short: "ag", long: "agosto" },
        { short: "sett", long: "settembre" },
        { short: "ott", long: "ottobre" },
        { short: "nov", long: "novembre" },
        { short: "dic", long: "dicembre" }
      ]
    },
    nl: {
      shortDate: "dd-MM-y",
      mediumDate: "d. MMM. y",
      longDate: "d MMMM y",
      shortDateTime: "HH:mm:ss dd-MM-y",
      mediumDateTime: "HH:mm d. MMM. y",
      longDateTime: "HH:mm d MMMM y",
      shortTime: "HH:mm",
      monthNames: [
        { short: "jan", long: "januari" },
        { short: "febr", long: "februari" },
        { short: "mrt", long: "maart" },
        { short: "apr", long: "april" },
        { short: "mei", long: "mei" },
        { short: "juni", long: "juni" },
        { short: "juli", long: "juli" },
        { short: "aug", long: "augustus" },
        { short: "sep", long: "september" },
        { short: "okt", long: "oktober" },
        { short: "nov", long: "november" },
        { short: "dec", long: "december" }
      ]
    },
    pl: {
      shortDate: "y-MM-dd",
      mediumDate: "d MMM y",
      longDate: "d MMMM y",
      shortDateTime: "y-MM-dd HH:mm:ss",
      mediumDateTime: "HH:mm d MMM y",
      longDateTime: "HH:mm d MMMM y",
      shortTime: "HH:mm",
      monthNames: [
        { short: "stycz", long: "styczeń" },
        { short: "luty", long: "luty" },
        { short: "mar", long: "marzec" },
        { short: "kwiec", long: "kwiecień" },
        { short: "maj", long: "maj" },
        { short: "czerw", long: "czerwiec" },
        { short: "lip", long: "lipiec" },
        { short: "sierp", long: "sierpień" },
        { short: "wrzes", long: "wrzesień" },
        { short: "pazdz", long: "październik" },
        { short: "listop", long: "listopad" },
        { short: "grudz", long: "grudzień" }
      ]
    }
  };

  constructor() {}

  public getFormat(locale: string, format: string = "shortDate"): string {
    if (
      ![
        "shortDate",
        "mediumDate",
        "longDate",
        "shortDateTime",
        "mediumDateTime",
        "longDateTime",
        "shortTime"
      ].includes(format)
    ) {
      format = "shortDate";
    }
    if (!this.formats[locale]) locale = "en";

    return this.formats[locale][format];
  }

  public getMonthName(locale: string, monthNumber: number): MonthName {
    if (!this.formats[locale]) locale = "en"; // Default to en if locale not supported.

    return this.formats[locale].monthNames[monthNumber] as MonthName;
  }

  public getLongMonthName(locale: string, monthNumber: number): string {
    return this.getMonthName(locale, monthNumber).long;
  }

  public getShortMonthName(locale: string, monthNumber: number): string {
    return this.getMonthName(locale, monthNumber).short;
  }

  
}

export interface MonthName {
  short: string;
  long: string;
}
