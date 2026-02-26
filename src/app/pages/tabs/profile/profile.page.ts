import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderComponent
  ]
})
export class ProfilePage implements OnInit {
  user = {} as User;

  // 👇 Usar inject en lugar de constructor
  private supabaseSvc = inject(SupabaseService);
  private utilsSvc = inject(UtilsService);

  ngOnInit() { }

  ionViewWillEnter() {
    this.getUser();
  }

  getUser() {
    return this.user = this.utilsSvc.getElementFromLocalStorage('user');
  }

  async signOut() {
    await this.utilsSvc.presentAlert({
      header: 'Cerrar Sesión',
      message: '¿Quieres cerrar sesión?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, 
        {
          text: 'Sí, cerrar',
          handler: async () => {
            await this.utilsSvc.presentLoading({ message: 'Cerrando sesión...' });
            try {
              await this.supabaseSvc.logout();
              this.utilsSvc.removeItemFromLocalStorage('user');
              await this.utilsSvc.routerLink('/auth');
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              this.utilsSvc.presentToast({
                message: 'Error al cerrar sesión',
                duration: 3000,
                color: 'danger'
              });
            } finally {
              await this.utilsSvc.dismissLoading();
            }
          }
        }
      ]
    });
  }
}