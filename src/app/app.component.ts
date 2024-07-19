import { Component } from '@angular/core';
import { UIRouterModule } from '@uirouter/angular';
import { TableCoffeeComponent } from './table-coffee/table-coffee.component';
import { DeleteCoffeeComponent } from './delete-coffee/delete-coffee.component';
import { CoffeeFormComponent } from './coffee-form/coffee-form.component';
import { NgStyle, NgSwitch, NgSwitchCase } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
	imports: [UIRouterModule, TableCoffeeComponent, DeleteCoffeeComponent, CoffeeFormComponent, NgSwitch, NgSwitchCase, NgStyle],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}
