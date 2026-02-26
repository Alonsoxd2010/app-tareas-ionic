import { Injectable, inject } from '@angular/core'; // 👈 Añadir inject
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, filter, switchMap, take } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  // 👇 Usar inject en lugar de constructor
  private supabaseSvc = inject(SupabaseService);
  private utilsSvc = inject(UtilsService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {

    return this.supabaseSvc.loaded$.pipe(
      filter(loaded => loaded),
      switchMap(() => this.supabaseSvc.getAuthState()),
      take(1),
      map(user => {
        if (!user) return true;

        this.utilsSvc.routerLink('/tabs/home');
        return false;
      })
    );
  }
}