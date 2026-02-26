import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ThemeService } from 'src/app/services/theme';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../logo/logo.component';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, LogoComponent]
})
export class HeaderComponent implements OnInit {
  @Input() title: string;
  @Input() backButton: string;
  @Input() isModal: boolean;
  @Input() color: string;
  @Input() centerTitle: boolean;

  darkMode: BehaviorSubject<boolean>;

  constructor(
    private themeSvc: ThemeService,
    private utilsSvc: UtilsService
  ) { }
  ngOnInit() {
    this.darkMode = this.themeSvc.darkMode;
  }
  dismissModal(){
    this.utilsSvc.dismissModal()
  }
  setTheme(darkMode: boolean) {
    this.themeSvc.setTheme(darkMode);
  }

}