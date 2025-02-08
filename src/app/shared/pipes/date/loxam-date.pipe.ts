import {
  Pipe,
  PipeTransform,
  OnDestroy
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { LocalisationService } from "src/app/core/services/localisation/localisation.service";
import { Subscription } from "rxjs";

// loxamDate pipe
// ==============
// Provides date formatting into the user's locale, with on-the-fly updating when the user language changes.
//
// Usage:
//    {{ myDate | loxamDate }}            - Date format defaults to longDate
//
//    or
//
//    {{ mydate | loxamDate:dateFormat}}  - dateFormat can be a date format name, or a custom date format string.
//                                          See localisationService for predefined date formats.

@Pipe({
    name: "loxamDate",
    pure: false,
    standalone: false
})
export class LoxamDatePipe implements PipeTransform, OnDestroy {
  private subscription!: Subscription;
  private lastLanguage: string = "";
  private lastOutput: string = "";
  private lastInput: string = "";

  constructor(
    private localisationService: LocalisationService,) { }

  public transform(value: any, formatParam: string = "longDate"): string {
    if (!value) {
      return "";
    }

    if (value == "-") { return "-" };

    const languageCode = navigator.language;

    // impure pipes will run very often. Only continue if the user language has changed since last time.
    if (languageCode === this.lastLanguage && this.lastInput === value) {
      return this.lastOutput;
    }

    this.lastLanguage = languageCode;

    let dateValue: Date = new Date(value);
    if (dateValue.toString() == "Invalid Date") {
      return "Invalid Date";
    }
    if (!dateValue) {
      this.lastOutput = "";
      return "";
    }

    // The format param can be either a format name such as "longDate",
    // or a custom format string such as "dd-MM-y".
    // Whatever it is, convert it into a custom format string to pass into the built-in date pipe.
    const rawFormat: string = this.localisationService.getFormat(
      languageCode,
      formatParam
    );
    let formattedDate: string = new DatePipe("en-us").transform(
      dateValue,
      rawFormat
    ) ?? "";

    // If the user language isn't en, and the format includes either full (MMMM) or abreviated (MMM) month names,
    // then translate those English month names into the user's language.
    if (languageCode !== "en" && rawFormat.includes("MMM")) {
      let enMonthName: string;
      let translatedMonthName: string;
      if (rawFormat.includes("MMMM")) {
        // Replace the full month names with translated text
        enMonthName = this.localisationService.getLongMonthName(
          "en",
          dateValue.getMonth()
        );
        translatedMonthName = this.localisationService.getLongMonthName(
          languageCode,
          dateValue.getMonth()
        );
      } else {
        // Replace the abbreviated month names with translated text
        enMonthName = this.localisationService.getShortMonthName(
          "en",
          dateValue.getMonth()
        );
        translatedMonthName = this.localisationService.getShortMonthName(
          languageCode,
          dateValue.getMonth()
        );
      }

      formattedDate = formattedDate.replace(enMonthName, translatedMonthName);
    }

    // Store the output so that it can be quickly returned again if the pipe is re-run (impure pipe) with no chnges.
    this.lastOutput = formattedDate;
    this.lastInput = value;

    return formattedDate;
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
