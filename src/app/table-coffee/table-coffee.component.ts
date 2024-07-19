import { Component, Directive, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren,SimpleChanges, OnChanges  } from '@angular/core';
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

export type SortColumn = keyof Coffee | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };
const compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

export interface SortEvent {
	column: SortColumn;
	direction: SortDirection;
}

@Directive({
	selector: 'th[sortable]',
	standalone: true,
	host: {
		'[class.asc]': 'direction === "asc"',
		'[class.desc]': 'direction === "desc"',
		'(click)': 'rotate()',
	},
})
export class NgbdSortableHeader {
	@Input() sortable: SortColumn = '';
	@Input() direction: SortDirection = '';
	@Output() sort = new EventEmitter<SortEvent>();

	rotate() {
		this.direction = rotate[this.direction];
		this.sort.emit({ column: this.sortable, direction: this.direction });
		console.log("Click" + this.sortable)
		console.log("Click" + this.direction)
	}
}

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
		NgbdSortableHeader,
		ToastModule,
	],
  templateUrl: './table-coffee.component.html',
  styleUrl: './table-coffee.component.css'
})
export class TableCoffeeComponent implements OnInit, OnChanges{
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

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
	directionHTMLId:string = "";
	directionHTMLName:string = "";
	directionHTMLRoast:string = "";
	directionHTMLFormat:string = "";
	constructor(
		private coffeeHttp: CoffeeHttpService
	) {}
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



	coffeeSort = this.coffeeData;
	onSort({ column, direction }: SortEvent) {
		// resetting other headers
		for (const header of this.headers) {
			if (header.sortable !== column) {
				header.direction = '';
			}
		}
		this.selectDirection(direction,column);
		// sorting countries
		if (direction === '' || column === '') {
			this.coffeeData = [...this.coffeeData].sort((a, b) => {
				const res = compare(a.id, b.id);
				return direction === '' ? res : -res;
			});
		} else {
			if(column=="id") {
				this.coffeeData = [...this.coffeeData].sort((a, b) => {
					const res = compare(a.id, b.id);
					return direction === 'asc' ? res : -res;
				});
			}else if(column=="roaster") {
				this.coffeeData = [...this.coffeeData].sort((a, b) => {
					const res = compare(a.roaster, b.roaster);
					return direction === 'asc' ? res : -res;
				});
			}else if(column=="roast") {
				this.coffeeData = [...this.coffeeData].sort((a, b) => {
					const res = compare(a.roast, b.roast);
					return direction === 'asc' ? res : -res;
				});
			}else if(column=="format") {
				this.coffeeData = [...this.coffeeData].sort((a, b) => {
					const res = compare(a.format, b.format);
					return direction === 'asc' ? res : -res;
				});
			}
		}
	}

	selectDirection(dir:string,col:string) {
		if (col == "id") {
			if (dir == "asc") {
				this.directionHTMLId = "▲";
				this.directionHTMLName="";
				this.directionHTMLRoast="";
				this.directionHTMLFormat="";
			} else if (dir == "desc") {
				this.directionHTMLId = "▼";
				this.directionHTMLName="";
				this.directionHTMLRoast="";
				this.directionHTMLFormat="";
			} else {
				this.directionHTMLId = "";
				this.directionHTMLName="";
				this.directionHTMLRoast="";
				this.directionHTMLFormat="";
			}
		}else if (col == "roaster") {
			if (dir == "asc") {
				this.directionHTMLId = "";
				this.directionHTMLName="▲";
				this.directionHTMLRoast="";
				this.directionHTMLFormat="";
			} else if (dir == "desc") {
				this.directionHTMLId = "";
				this.directionHTMLName="▼";
				this.directionHTMLRoast="";
				this.directionHTMLFormat="";
			} else {
				this.directionHTMLId = "";
				this.directionHTMLName="";
				this.directionHTMLRoast="";
				this.directionHTMLFormat="";
			}
		}else if (col == "roast") {
			if (dir == "asc") {
				this.directionHTMLId = "";
				this.directionHTMLName="";
				this.directionHTMLRoast="▲";
				this.directionHTMLFormat="";
			} else if (dir == "desc") {
				this.directionHTMLId = "";
				this.directionHTMLName="";
				this.directionHTMLRoast="▼";
				this.directionHTMLFormat="";
			} else {
				this.directionHTMLId = "";
				this.directionHTMLName="";
				this.directionHTMLRoast="";
				this.directionHTMLFormat="";
			}
		}else if (col == "format") {
			if (dir == "asc") {
				this.directionHTMLId = "";
				this.directionHTMLName="";
				this.directionHTMLRoast="";
				this.directionHTMLFormat="▲";
			} else if (dir == "desc") {
				this.directionHTMLId = "";
				this.directionHTMLName="";
				this.directionHTMLRoast="";
				this.directionHTMLFormat="▼";
			} else {
				this.directionHTMLId = "";
				this.directionHTMLName="";
				this.directionHTMLRoast="";
				this.directionHTMLFormat="";
			}
		}
	}

}
