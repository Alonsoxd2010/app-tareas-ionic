import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Task } from 'src/app/models/task.model';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AddUpdateTaskComponent } from 'src/app/shared/components/add-update-task/add-update-task.component';
import { UtilsService } from 'src/app/services/utils.service';
import { SupabaseService } from 'src/app/services/supabase.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [AddUpdateTaskComponent, HeaderComponent, IonicModule, CommonModule, FormsModule, NgCircleProgressModule]
})
export class HomePage implements OnInit {
  user = {} as User;
  private supabaseSvc = inject(SupabaseService);
  private utilsSvc = inject(UtilsService);

  tasks: Task[] = []
  loading: boolean = false;

  ngOnInit() { }

  async ionViewWillEnter() {
    await this.getTasks(true);
    await this.getUser();
  }

  getUser() {
    return this.user = this.utilsSvc.getElementFromLocalStorage('user');
  }

  getPercentage(task: Task) {
    return this.utilsSvc.getPercentage(task);
  }

  addOrUpdateTask(task?: Task) {
    this.utilsSvc.presentModal({
      component: AddUpdateTaskComponent,
      componentProps: { task },
      cssClass: 'add-update-modal'
    }).then((res) => {
      if (res && res.success) {
        this.getTasks(true);
      }
    });
  }

  async getTasks(showLoading: boolean = true) {
    if (showLoading) {
      this.loading = true;  // 👈 MUESTRA CARDS DE CARGA
    }

    let user: User = this.utilsSvc.getElementFromLocalStorage('user');
    const { data, error } = await this.supabaseSvc.getUserTasks(user.uid);

    if (data) {
      this.tasks = data;
    }

    if (showLoading) {
      this.loading = false;  // 👈 OCULTA CARDS DE CARGA
    }
  }

  confirmDeleteTask(task: Task) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar tarea',
      message: '¿Quieres eliminar esta tarea?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sí, eliminar',
          handler: () => {
            this.deleteTask(task);
          }
        }
      ]
    });
  }

  async deleteTask(task: Task) {
    await this.utilsSvc.presentLoading({ message: 'Eliminando...' });

    try {
      await this.supabaseSvc.deleteTask(task.id!);

      this.utilsSvc.presentToast({
        message: 'Tarea eliminada exitosamente',
        color: 'success',
        icon: 'checkmark-circle-outline',
        duration: 1500
      });

      // 👇 ACTIVA CARDS MANUALMENTE
      this.loading = true;

      // 👇 CARGA LAS TAREAS (sin loading del utils)
      let user: User = this.utilsSvc.getElementFromLocalStorage('user');
      const { data, error } = await this.supabaseSvc.getUserTasks(user.uid);

      if (data) {
        this.tasks = data;
      }

      // 👇 DESACTIVA CARDS
      this.loading = false;

    } catch (error: any) {
      this.utilsSvc.presentToast({
        message: error.message || 'Error al eliminar',
        color: 'warning',
        icon: 'alert-circle-outline',
        duration: 5000
      });
    } finally {
      await this.utilsSvc.dismissLoading();
    }
  }
}