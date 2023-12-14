import { Injectable, isDevMode } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { CoreModule } from "../../core.module";
declare let gtag: Function;

/**
 * We want to avoid exposing anything that could be sensitive.
 * Implement this approach where a developer might want to leave some form of an error
 * code to help track issues
 *
 * Error Code   | Description
 * -------------| -----------
 * 0xAS0001     | Google analytics tracking code missing from config
 *              |
 *              |
 *              |
 */

@Injectable({
  providedIn: CoreModule
})
export class AnalyticsService {
  public trackingId: string = "";

  constructor() {
    if (isDevMode()) {
      console.info("[AS] Using dev-env analytics ID")
      this.trackingId = "UA-6345280-1";
    } else {
      if (environment.googleAnalyticsTrackingId != null) {
        this.trackingId = environment.googleAnalyticsTrackingId;
      }
    }
  }

  /**
   * Start google analytic services
   */
  startGoogleAnalytics(): void {
    console.info("[AS] Starting...")

    // early exit if no tracking id found
    if (!this.trackingId) {
      console.warn("[AS] Failed to start. Error=0xAS0001")
      return;
    }

    // insert gtag to html and start
    let gaScript = document.createElement("script");
    gaScript.setAttribute("async", "true");
    gaScript.setAttribute(
      "src",
      `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`
    );

    let gaScript2 = document.createElement("script");
    gaScript2.innerText = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag(\'js\', new Date());gtag(\'config\', \'${this.trackingId}\');`;

    if (document.documentElement.firstChild != null) {
      document.documentElement.firstChild.appendChild(gaScript);
    }
    if (document.documentElement.firstChild != null) {
      document.documentElement.firstChild.appendChild(gaScript2);
    }

    // disabe default page tracking as it doesn't work well on SPA's
    gtag("config", this.trackingId, {
      send_page_view: false
    });

    console.info("[AS] Started")
  }

  trackPages(router: Router): void {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag("config", this.trackingId, {
          page_path: event.urlAfterRedirects
        });
      }
    });
  }

  public sendCustomEvent(
    eventName: string,
    eventCategory: string,
    eventAction: string,
    eventLabel: string,
    eventValue: number = 0
  ): void {
    gtag("event", eventName, {
      "event_category": eventCategory,
      "event_label": eventLabel,
      "event_action": eventAction,
      "event_value": eventValue
    });
  }
}
