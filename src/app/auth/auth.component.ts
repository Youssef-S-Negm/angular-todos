import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { SpinnerComponent } from "../spinner/spinner.component";

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, SpinnerComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  private authService = inject(AuthService);
  isLoading = this.authService.isLoading;
}
