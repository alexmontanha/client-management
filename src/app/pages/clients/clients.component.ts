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
[x: string]: any;
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

  updateClient(client: any) {
    this.clientService.updateClient(client).subscribe(
      () => this.loadClients(),
      error => console.error('Erro ao atualizar cliente:', error)
    );
  }

  deleteClient(client: any) {
    this.clientService.deleteClient(client.id).subscribe(
      () => this.loadClients(),
      error => console.error('Erro ao deletar cliente:', error)
    );
  }
}
