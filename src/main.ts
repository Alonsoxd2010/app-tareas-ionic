import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { createOutline, addCircleOutline, trashOutline, personCircleOutline, logOutOutline, homeOutline, alertCircleOutline, checkmarkCircleOutline, personOutline, personAddOutline, logInOutline, moonOutline, sunnyOutline, closeCircleOutline, mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { addIcons } from 'ionicons';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { importProvidersFrom } from '@angular/core';

addIcons({ createOutline, addCircleOutline, trashOutline, personCircleOutline, logOutOutline, homeOutline, alertCircleOutline, checkmarkCircleOutline, personOutline, personAddOutline, logInOutline, moonOutline, sunnyOutline, closeCircleOutline, mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline });
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({
      mode: 'md',
    }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom(
      NgCircleProgressModule.forRoot({
        radius: 100,
        outerStrokeWidth: 16,
        innerStrokeWidth: 8,
        outerStrokeColor: "#5260ff",
        innerStrokeColor: "#45c4ff56",
        animationDuration: 300,
      })
    )
  ],
});