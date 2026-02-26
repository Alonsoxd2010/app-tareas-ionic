import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private _loaded = new BehaviorSubject<boolean>(false);
  loaded$ = this._loaded.asObservable();
  supabase: SupabaseClient;

  private _authState = new BehaviorSubject<SupabaseUser | null>(null);
  authState$ = this._authState.asObservable();

  private utilsSvc = inject(UtilsService);

  constructor() {
    this.supabase = createClient(
      'https://dgzkepbvfcdzepnvutkg.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnemtlcGJ2ZmNkemVwbnZ1dGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzkxMDAsImV4cCI6MjA4NzQ1NTEwMH0.8qVhfN2dBTUiX8xWuFgVDkWEAOBbhZB-2ARJbwbBbqI'
    );

    this.supabase.auth.onAuthStateChange((event, session) => {
      this._authState.next(session?.user ?? null);
    });

    this.supabase.auth.getSession().then(({ data }) => {
      this._authState.next(data.session?.user ?? null);
      this._loaded.next(true);
    });
  }

  login(user: User) {
    return this.supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password
    });
  }

  signUp(user: User) {
    return this.supabase.auth.signUp({
      email: user.email,
      password: user.password
    });
  }

  updateUser(user: any) {
    return this.supabase.auth.updateUser({
      data: user
    });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  async logout() {
    try {
      await this.signOut();
      localStorage.removeItem('user');
      // No hacer routerLink aquí, mejor hacerlo desde el componente
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  getUserById(uid: string) {
    return this.supabase.from('users').select('*').eq('uid', uid).single();
  }

  async createUser(user: any) {
    return await this.supabase
      .from('users')
      .insert([user]);
  }

  getAuthState() {
    return this.authState$;
  }
  // ========== TASKS CRUD ==========

  // Obtener tareas de un usuario
  getUserTasks(uid: string) {
    return this.supabase
      .from('tasks')
      .select('*')
      .eq('uid', uid);
  }

  // Crear tarea
  createTask(task: any) {
    return this.supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();
  }

  // Actualizar tarea
  updateTask(id: string, updates: any) {
    return this.supabase
      .from('tasks')
      .update(updates)
      .eq('id', id);
  }

  // Eliminar tarea
  deleteTask(id: string) {
    return this.supabase
      .from('tasks')
      .delete()
      .eq('id', id);
  }
}