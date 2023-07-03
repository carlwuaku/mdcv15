import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

function getApplicationSettings(path: string) {
  return new Promise<string>(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        // The request is done; did it work?
        if (xhr.status == 200) {
          // Yes, use `xhr.responseText` to resolve the promise
          resolve(xhr.responseText);
        } else {
          // No, reject the promise
          reject(xhr);
        }
      }
    };
    xhr.open("GET", path);
    xhr.send();
  });
}

// Do the request
getApplicationSettings("app.settings.json")
  .then(function (value: unknown) {
    const fileData = value as string;
    environment.appSettings = JSON.parse(fileData) as {
      featureToggles: {};
      config: {
        production: boolean;
        useSessionStorage: boolean;
      };
      api: {
        host: string;
        namespace: string;
      };
      googleAnalyticsTrackingId: string;
    };
  })
  .catch(function (xhr) {
    // The call failed, look at `xhr` for details
  })
  .finally(function () {
    if (environment.appSettings.config?.production) {
      enableProdMode();
    }
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch(err => console.error(err));
  });
