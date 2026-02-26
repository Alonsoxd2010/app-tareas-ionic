import { Component, OnInit, Input } from '@angular/core';
import { IonicModule, ItemReorderEventDetail } from '@ionic/angular';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task, Item } from "src/app/models/task.model";
import { User } from 'src/app/models/user.model';
import { SupabaseService } from 'src/app/services/supabase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { CustomInputComponent } from 'src/app/shared/components/custom-input/custom-input.component';

@Component({
  selector: 'app-add-update-task',
  templateUrl: './add-update-task.component.html',
  styleUrls: ['./add-update-task.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, HeaderComponent, CustomInputComponent, FormsModule],
})
export class AddUpdateTaskComponent implements OnInit {
  @Input() task?: Task;

  user = {} as User;

  form = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.minLength(4)]),
    description: new FormControl('', [Validators.required, Validators.minLength(4)]),
    items: new FormControl<Item[]>([], [Validators.required, Validators.minLength(1)]),
  });

  constructor(
    private supabaseSvc: SupabaseService,
    private utilsSvc: UtilsService
  ) { }

  ngOnInit() {
    this.user = this.utilsSvc.getElementFromLocalStorage('user');

    if (this.task) {
      this.form.patchValue(this.task);
      this.form.updateValueAndValidity();
    }
  }

  async updateTask() {
    await this.utilsSvc.presentLoading({ message: 'Actualizando...' });

    const { id, ...taskData } = this.form.value;

    try {
      await this.supabaseSvc.updateTask(this.task!.id!, taskData);

      // 👇 ESTO HACE QUE SE ACTUALICE AUTOMÁTICAMENTE
      this.utilsSvc.dismissModal({ success: true, updated: true });

      this.utilsSvc.presentToast({
        message: 'Tarea actualizada exitosamente',
        color: 'success',
        icon: 'checkmark-circle-outline',
        duration: 1500
      });
    } catch (error: any) {
      this.utilsSvc.presentToast({
        message: error.message || 'Error al actualizar',
        color: 'warning',
        icon: 'alert-circle-outline',
        duration: 5000
      });
    } finally {
      await this.utilsSvc.dismissLoading();
    }
  }

  async createTask() {
    await this.utilsSvc.presentLoading({ message: 'Guardando...' });

    let user = this.utilsSvc.getElementFromLocalStorage('user');

    const { id, ...taskData } = this.form.value;

    const newTask = {
      ...taskData,
      uid: user.uid
    };

    try {
      await this.supabaseSvc.createTask(newTask);

      // 👇 ESTO HACE QUE SE ACTUALICE AUTOMÁTICAMENTE
      this.utilsSvc.dismissModal({ success: true, created: true });

      this.utilsSvc.presentToast({
        message: 'Tarea creada exitosamente',
        color: 'success',
        icon: 'checkmark-circle-outline',
        duration: 1500
      });
    } catch (error: any) {
      this.utilsSvc.presentToast({
        message: error.message || 'Error al crear',
        color: 'warning',
        icon: 'alert-circle-outline',
        duration: 5000
      });
    } finally {
      await this.utilsSvc.dismissLoading();
    }
  }

  getPercentage() {
    const items = this.form.get('items')?.value || [];
    if (items.length === 0) return 0;
    const completed = items.filter(i => i.completed).length;
    return Math.round((completed / items.length) * 100);
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    const items = ev.detail.complete(this.form.get('items')?.value || []);
    this.form.patchValue({ items });
    this.form.updateValueAndValidity();
  }

  removeItem(index: number) {
    const items = this.form.get('items')?.value || [];
    items.splice(index, 1);
    this.form.patchValue({ items: [...items] });
    this.form.updateValueAndValidity();
  }

  createItem() {
    this.utilsSvc.presentAlert({
      header: 'Nueva Actividad',
      backdropDismiss: false,
      inputs: [
        {
          name: 'name',
          type: 'textarea',
          placeholder: 'Hacer algo...'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Agregar',
          handler: (res) => {
            if (res.name?.trim()) {
              const currentItems = this.form.get('items')?.value || [];
              const newItem: Item = { name: res.name, completed: false };
              this.form.patchValue({ items: [...currentItems, newItem] });
              this.form.updateValueAndValidity();
            }
            return true;
          }
        }
      ]
    });
  }

  submit() {
    if (this.form.valid) {
      if (this.task) {
        this.updateTask();
      } else {
        this.createTask();
      }
    }
  }
}