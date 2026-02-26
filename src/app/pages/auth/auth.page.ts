import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomInputComponent } from 'src/app/shared/components/custom-input/custom-input.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { IonicModule } from '@ionic/angular';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { SupabaseService } from '../../services/supabase.service';
import { User } from '../../models/user.model';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderComponent,
    LogoComponent,
    CustomInputComponent,
    RouterModule,
  ]
})
export class AuthPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  // 👇 Usar inject en lugar de constructor
  private supabaseSvc = inject(SupabaseService);
  private utilsSvc = inject(UtilsService);

  ngOnInit() { }

  async submit() {
    if (!this.form.valid) return;
    
    await this.utilsSvc.presentLoading({ message: 'Autenticando...' });
    
    try {
      const res = await this.supabaseSvc.login(this.form.value as unknown as User);
      
      if (!res.data.user) {
        await this.utilsSvc.dismissLoading();
        return;
      }
      
      const { data: userData } = await this.supabaseSvc.getUserById(res.data.user.id);
      
      const user: User = {
        uid: res.data.user.id,
        name: userData?.name ?? 'Usuario',
        email: res.data.user.email!
      };
      
      this.utilsSvc.setElementInLocalstorage('user', user);
      await this.utilsSvc.dismissLoading();
      await this.utilsSvc.routerLink('/tabs/home');
      
      this.utilsSvc.presentToast({
        message: `Bienvenido ${user.name}`,
        duration: 1500,
        color: 'primary',
        icon: 'person-outline'
      });
      
      this.form.reset();
    } catch (error) {
      await this.utilsSvc.dismissLoading();
      
      this.utilsSvc.presentToast({
        message: String(error),
        duration: 5000,
        color: 'warning',
        icon: 'alert-circle-outline'
      });
    }
  }
}