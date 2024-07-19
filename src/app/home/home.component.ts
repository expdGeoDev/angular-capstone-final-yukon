import { Component, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CoffeeFormComponent } from '../coffee-form/coffee-form.component';
import { DeleteCoffeeComponent } from '../delete-coffee/delete-coffee.component';
import { NgSwitch, NgSwitchCase } from '@angular/common';
import { TableCoffeeComponent } from '../table-coffee/table-coffee.component';
import { FormType } from '../common/coffee-model';

@Component({
  selector: 'app-home',
  standalone: true,
	imports: [
		CoffeeFormComponent,
		DeleteCoffeeComponent,
		NgSwitchCase,
		TableCoffeeComponent,
		NgSwitch,
	],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

	protected readonly FormType = FormType;

	title = 'angular-capstone';
	optionModal = 0;
	option = '';
	titleModal = '';
	updateObs = false;
	updateObsChange= false	;


	openModal(op: number) {

		const modelDiv = document.getElementById('myModal');
		if (modelDiv != null) {
			modelDiv.style.display = 'block';
			if (op == 1) {
				this.titleModal = 'Add Coffee';
				this.optionModal = 1;
			} else if (op == 2) {
				this.titleModal = 'Delete Item';
				this.optionModal = 2;
			}
		}
	}

	closeModal() {

		const modelDiv = document.getElementById('myModal');
		if (modelDiv != null) {
			modelDiv.style.display = 'none';
		}
	}

	closeModalCom(){
		this.updateObs = true;
		this.closeModal()
	}

	updateObsC(event: Boolean){
		this.updateObs = false;
	}

}
