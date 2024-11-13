# ClientManagement: Projeto Tutorial Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.11.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Tutorial

### Passo 1: Criando o Projeto

1. No terminal, crie o projeto com o Angular CLI:

   ```bash
   ng new client-management --standalone
   ```

   Selecione `CSS` como o estilo padrão. Isso criará uma estrutura de projeto sem a necessidade de um módulo principal (`AppModule`).

### Passo 2: Criando Componentes Standalone

Para esta aplicação, criaremos os componentes `Home`, `Login`, e `Clients`.

```bash
ng generate component pages/home --standalone
ng generate component pages/login --standalone
ng generate component pages/clients --standalone
```

Agora, cada componente possui a propriedade `standalone: true` no decorator `@Component`, tornando-os independentes de módulos.

### Passo 3: Configurando o Roteamento com Componentes Standalone

Em `main.ts`, substitua a configuração inicial para que a aplicação use o roteamento diretamente no bootstrap do Angular.

1. Abra `main.ts` e configure as rotas usando componentes standalone:

   ```typescript
   import { bootstrapApplication } from '@angular/platform-browser';
   import { provideRouter, RouterModule } from '@angular/router';
   import { importProvidersFrom } from '@angular/core';
   import { AppComponent } from './app/app.component';
   import { HomeComponent } from './app/pages/home/home.component';
   import { LoginComponent } from './app/pages/login/login.component';
   import { ClientsComponent } from './app/pages/clients/clients.component';

   bootstrapApplication(AppComponent, {
     providers: [
       provideRouter([
         { path: '', component: HomeComponent },
         { path: 'login', component: LoginComponent },
         { path: 'clients', component: ClientsComponent }
       ])
     ]
   }).catch(err => console.error(err));
   ```

2. No `AppComponent`, configure o `<router-outlet>` para renderizar as rotas:

   ```typescript
   import { Component } from '@angular/core';
   import { RouterOutlet } from '@angular/router';

   @Component({
     selector: 'app-root',
     standalone: true,
     imports: [RouterOutlet],
     template: `<router-outlet></router-outlet>`,
     styles: []
   })
   export class AppComponent {}
   ```

### Passo 4: Criando o Serviço de Autenticação

Agora, vamos criar o serviço de autenticação para realizar o login.

1. Crie o serviço:

   ```bash
   ng generate service services/auth
   ```

2. No arquivo `auth.service.ts`, adicione o código para a requisição `POST` de login:

   ```typescript
   import { Injectable } from '@angular/core';
   import { HttpClient } from '@angular/common/http';
   import { Observable } from 'rxjs';

   @Injectable({
     providedIn: 'root'
   })
   export class AuthService {
     private apiUrl = 'https://api.exemplo.com';

     constructor(private http: HttpClient) {}

     login(user: string, password: string): Observable<any> {
       return this.http.post(`${this.apiUrl}/auth/login`, {
         user,
         password
       });
     }
   }
   ```

> **Nota**: Altere `https://api.exemplo.com` para a URL real da sua API.

### Passo 5: Tela de Login

1. Em `login.component.ts`, adicione a lógica para o formulário de login e o redirecionamento.

   ```typescript
   import { Component } from '@angular/core';
   import { AuthService } from '../../services/auth.service';
   import { Router } from '@angular/router';
   import { FormsModule } from '@angular/forms';

   @Component({
     selector: 'app-login',
     standalone: true,
     imports: [FormsModule],
     templateUrl: './login.component.html',
     styleUrls: ['./login.component.css']
   })
   export class LoginComponent {
     user = '';
     password = '';

     constructor(private authService: AuthService, private router: Router) {}

     onLogin() {
       this.authService.login(this.user, this.password).subscribe(
         response => this.router.navigate(['/clients']),
         error => console.error('Erro ao logar:', error)
       );
     }
   }
   ```

2. Em `login.component.html`, crie o formulário de login:

   ```html
   <div class="login-container">
     <h2>Login</h2>
     <form (ngSubmit)="onLogin()">
       <label for="user">User</label>
       <input id="user" type="text" [(ngModel)]="user" name="user" required />

       <label for="password">Password</label>
       <input id="password" type="password" [(ngModel)]="password" name="password" required />

       <button type="submit">Login</button>
     </form>
   </div>
   ```

3. Em `login.component.css`, adicione estilos básicos:

   ```css
   .login-container {
     max-width: 300px;
     margin: auto;
     padding: 1em;
     border: 1px solid #ccc;
     border-radius: 5px;
   }

   .login-container h2 {
     text-align: center;
   }

   .login-container input {
     width: 100%;
     margin-bottom: 1em;
   }

   .login-container button {
     width: 100%;
     background-color: #4CAF50;
     color: white;
   }
   ```

### Passo 6: CRUD de Clientes

1. Crie o serviço `ClientService`:

   ```bash
   ng generate service services/client
   ```

2. Adicione os métodos de CRUD no `client.service.ts`:

   ```typescript
   import { Injectable } from '@angular/core';
   import { HttpClient } from '@angular/common/http';
   import { Observable } from 'rxjs';

   @Injectable({
     providedIn: 'root'
   })
   export class ClientService {
     private apiUrl = 'https://api.exemplo.com';

     constructor(private http: HttpClient) {}

     getClients(): Observable<any> {
       return this.http.get(`${this.apiUrl}/clients`);
     }

     addClient(client: any): Observable<any> {
       return this.http.post(`${this.apiUrl}/clients`, client);
     }

     updateClient(client: any): Observable<any> {
       return this.http.put(`${this.apiUrl}/clients/${client.id}`, client);
     }

     deleteClient(clientId: string): Observable<any> {
       return this.http.delete(`${this.apiUrl}/clients/${clientId}`);
     }
   }
   ```

3. Em `clients.component.ts`, configure o componente para exibir e gerenciar os clientes:

   ```typescript
   import { Component, OnInit } from '@angular/core';
   import { ClientService } from '../../services/client.service';
   import { CommonModule } from '@angular/common';

   @Component({
     selector: 'app-clients',
     standalone: true,
     imports: [CommonModule],
     templateUrl: './clients.component.html',
     styleUrls: ['./clients.component.css']
   })
   export class ClientsComponent implements OnInit {
     clients: any[] = [];

     constructor(private clientService: ClientService) {}

     ngOnInit() {
       this.loadClients();
     }

     loadClients() {
       this.clientService.getClients().subscribe(
         data => this.clients = data,
         error => console.error('Erro ao carregar clientes:', error)
       );
     }
   }
   ```

4. Em `clients.component.html`, defina a interface para visualizar e interagir com os clientes:

   ```html
   <div class="clients-container">
     <h2>Clientes</h2>
     <ul>
       <li *ngFor="let client of clients">
         {{ client.name }} - {{ client.email }}
         <button (click)="updateClient(client)">Editar</button>
         <button (click)="deleteClient(client.id)">Excluir</button>
       </li>
     </ul>
   </div>
   ```

    **Nota**: Customize `addClient` e `updateClient` para exibir formulários.

## Tutorial em Vídeo

Para mais detalhes, assista ao tutorial em vídeo:

[![Curso Angular 4: Angular e Rest Parte 1](https://img.youtube.com/vi/UecYDGB5m64/0.jpg)](https://youtu.be/UecYDGB5m64?si=wpmWHtu6FRR-sb-1)
