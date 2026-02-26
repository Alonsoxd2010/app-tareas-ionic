import { Component, OnInit, inject } from '@angular/core';
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { IonicModule } from '@ionic/angular';
import { LogoComponent } from '../../../shared/components/logo/logo.component';
import { RouterModule } from '@angular/router';
import { CustomValidators } from '../../../utils/custom-validators';
import { SupabaseService } from '../../../services/supabase.service';
import { User } from '../../../models/user.model';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    IonicModule, 
    HeaderComponent, 
    LogoComponent, 
    CustomInputComponent, 
    RouterModule
  ]
})
export class SignUpPage implements OnInit {
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('')
  });

  // 👇 Usar inject en lugar de constructor
  private supabaseSvc = inject(SupabaseService);
  private utilsSvc = inject(UtilsService);

  ngOnInit() {
    this.confirmPasswordValidator();

    this.form.controls.password.valueChanges.subscribe(() => {
      this.form.controls.confirmPassword.updateValueAndValidity();
    });
  }

  confirmPasswordValidator() {
    this.form.controls.confirmPassword.setValidators([
      Validators.required,
      CustomValidators.matchValues(this.form.controls.password)
    ]);
    this.form.controls.confirmPassword.updateValueAndValidity();
  }

  async submit() {
    if (!this.form.valid) return;

    await this.utilsSvc.presentLoading({ message: 'Registrando...' });

    try {
      const res = await this.supabaseSvc.signUp({
        email: this.form.value.email,
        password: this.form.value.password
      } as unknown as User);

      if (!res.data.user) {
        await this.utilsSvc.dismissLoading();
        return;
      }

      // guardar nombre en metadata de Supabase
      await this.supabaseSvc.updateUser({
        data: { displayName: this.form.value.name }
      });

      const user: User = {
        uid: res.data.user.id,
        name: this.form.value.name!,
        email: this.form.value.email!,
        password: this.form.value.password!
      };

      // insertar en tabla users
      await this.supabaseSvc.createUser(user);

      this.utilsSvc.setElementInLocalstorage('user', user);
      await this.utilsSvc.dismissLoading();
      await this.utilsSvc.routerLink('/tabs/home');

      this.utilsSvc.presentToast({
        message: `Te damos la bienvenida ${user.name}`,
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