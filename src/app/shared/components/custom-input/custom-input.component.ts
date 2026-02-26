import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class CustomInputComponent implements OnInit {
  @Input() control: FormControl;
  @Input() label: string;
  @Input() icon: string;
  @Input() type: string;
  @Input() autocomplete: string;

  @Input() isPassword: boolean;
  hide: boolean = true;
  constructor() { }
  ngOnInit() {
    if (this.type == 'pasword') this.isPassword = true;
  }
  showOrHidePassword() {
    this.hide = !this.hide;
    if (this.hide) { this.type = 'password' } else { this.type = 'text' }
  }
}