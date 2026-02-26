import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private router = inject(Router);

  ngOnInit() {
    console.log('🚀 App iniciada');
    
    // Verificar si hay usuario en localStorage
    const user = localStorage.getItem('user');
    console.log('👤 Usuario en localStorage:', user ? 'Sí' : 'No');
    
    // Redirigir según el estado de autenticación
    if (user) {
      console.log('📍 Redirigiendo a /tabs/home');
      this.router.navigateByUrl('/tabs/home');
    } else {
      console.log('📍 Redirigiendo a /auth');
      this.router.navigateByUrl('/auth');
    }
  }
}