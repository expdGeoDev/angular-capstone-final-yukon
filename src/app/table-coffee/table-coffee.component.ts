import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { Coffee, FormType } from '../common/coffee-model';
import { CoffeeHttpService } from '../services/coffee-http.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CoffeeFormComponent } from '../coffee-form/coffee-form.component';
import { DeleteCoffeeComponent } from '../delete-coffee/delete-coffee.component';
import { DetailsViewCoffeeComponent } from '../details-view-coffee/details-view-coffee.component';
import { SortingInterface } from '../sorting-interface';
import { map } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { CoffeeDataService } from '../services/coffee-data.service';

@Component({
  selector: 'app-table-coffee',
  standalone: true,
	imports: [
		NgForOf,
		NgIf,
		NgClass,
		NgxPaginationModule,
		CoffeeFormComponent,
		DeleteCoffeeComponent,
		NgSwitchCase,
		NgSwitch,
		DetailsViewCoffeeComponent,
		ToastModule,
	],
  templateUrl: './table-coffee.component.html',
  styleUrl: './table-coffee.component.css'
})
export class TableCoffeeComponent implements OnInit, OnChanges{

	FormType = FormType

	p=0;
	coffeeRow?:Coffee;
	coffeeData! : Coffee[];
	sortIcon='▼'
	sorting:SortingInterface = {
		column:'Id',
		order:'desc'
}
	constructor(private coffeeService: CoffeeDataService, private coffeeHttp: CoffeeHttpService) {
	optionModal: number = 0;
	title: any;
	@Output() iDFromTable = new EventEmitter<string>();
	@Input() updateObs?: boolean;
	@Output() updateObsChange = new EventEmitter<boolean>();


	ngOnChanges(changes: SimpleChanges) {
		console.log(this.updateObs);
		this.getData();
		this.updateObsChange.emit(false);
	}

	ngOnInit() {
		this.getData();
	}

	expanded: boolean =false;
	checkExpanded(data:any){

		if(this.expanded) {
			this.iDFromTable.emit(data.id);
			console.log('Index: ' + data.id);
		}else{
			this.iDFromTable.emit('');
		}
		return this.expanded;
	}

	getDetailsFromCoffee(data:Coffee, option:number){

		const modelDiv= document.getElementById('myModalDetails');
		if(modelDiv){
			modelDiv.style.display='block';
		}

		let idValue = +data.id;
		this.coffeeRow =  this.getDetailsById(idValue);
		this.optionModal = option;
	}

	closeModal(){

		const modelDiv= document.getElementById('myModalDetails');
		if(modelDiv){
			modelDiv.style.display='none';
		}
	}

	getDetailsById(id:number){

		const el = this.coffeeData.find(x=>x.id===id);
		console.log(el);
		return this.coffeeData.find(x=>x.id===id);
	}

	changeActivation(coffee: Coffee){
		console.log(coffee);
		coffee.active = false;
		this.coffeeHttp.updateCoffee(coffee)
			.subscribe({
				next: d=>{}
				,error: err => {}
				,complete: () => {this.getData()}
			});
	}

	sortingColumn(column:string){
		if(this.sortIcon =='▼'){
			this.sortIcon= '▲';
			return this.sorting.column===column && this.sorting.order ==='desc'
		}else {
			this.sortIcon= '▼';
			return this.sorting.column===column && this.sorting.order ==='desc'
		}
	}

	fetchData(){
		this.coffeeHttp.getAllCoffees().subscribe(
			{next:(data)=>{
					this.coffeeData = data
					console.log(this.coffeeData);
				}
			})
	}

	getData(){
		this.coffeeHttp.getAllCoffees()
			.pipe(
				map(c =>
					c.filter( r => r.active )
				)
			)
			.subscribe(
				{next:(data)=>{
						this.coffeeData = data;
					}
				})
	}



}
