import { Component } from '@angular/core';
import { UIRouterModule } from '@uirouter/angular';
import { TableCoffeeComponent } from './table-coffee/table-coffee.component';
import { DeleteCoffeeComponent } from './delete-coffee/delete-coffee.component';
import { CoffeeFormComponent } from './coffee-form/coffee-form.component';
import { NgSwitch, NgSwitchCase } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
	imports: [UIRouterModule, TableCoffeeComponent, DeleteCoffeeComponent, CoffeeFormComponent, NgSwitch, NgSwitchCase],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-capstone';
	optionModal=0;
	option = '';
	titleModal='';

	openModal(){
		const modelDiv= document.getElementById('myModal');
		if(modelDiv != null){
			modelDiv.style.display='block';
			this.titleModal = 'Delete Item';
			this.optionModal=2;
		}
	}
	closeModal(){
		const modelDiv= document.getElementById('myModal');
		if(modelDiv != null){
			modelDiv.style.display='none';
		}
	}

}
