import { Injectable, inject } from '@angular/core';
import { ModalOptions, ModalController, AlertOptions, AlertController, LoadingController, LoadingOptions, ToastController, ToastOptions } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  
  private loadingController = inject(LoadingController);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);
  private modalController = inject(ModalController);

  constructor() { }

  async presentLoading(opts?: LoadingOptions) {
    const loading = await this.loadingController.create(opts);
    await loading.present();
  }

  async dismissLoading() {
    return await this.loadingController.dismiss();
  }

  setElementInLocalstorage(key: string, element: any) {
    return localStorage.setItem(key, JSON.stringify(element));
  }

  getElementFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key) || 'null');
  }

  removeItemFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  async presentToast(opts: ToastOptions) {
    const toast = await this.toastController.create(opts);
    toast.present();
  }

  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }
  
  async presentAlert(opts: AlertOptions) {
    const alert = await this.alertController.create(opts);
    await alert.present();
  }
  
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalController.create(opts);
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if (data) {
      return data;
    }
  }
  
  dismissModal(data?: any) {
    this.modalController.dismiss(data);
  }
  
  getPercentage(task: Task){
    let completedItems = task.items.filter(item => item.completed).length;
    let totalItems = task.items.length;
    let percentage = (100 / totalItems) * completedItems;

    return parseInt(percentage.toString());
  }
}