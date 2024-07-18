import { Component, EventEmitter, OnInit, Output, PipeTransform } from '@angular/core';
import { AsyncPipe, DecimalPipe, NgClass, NgForOf, NgIf, NgSwitchCase } from '@angular/common';
import { CoffeeDataService } from '../services/coffee-data.service';
import { Coffee } from '../common/coffee-model';
import { CoffeeHttpService } from '../services/coffee-http.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CoffeeFormComponent } from '../coffee-form/coffee-form.component';
import { DeleteCoffeeComponent } from '../delete-coffee/delete-coffee.component';
import { DetailsViewCoffeeComponent } from '../details-view-coffee/details-view-coffee.component';
import { map, Observable, of, startWith } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';

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
		DetailsViewCoffeeComponent,
		ReactiveFormsModule,DecimalPipe, AsyncPipe, ReactiveFormsModule, NgbHighlight
	],
  templateUrl: './table-coffee.component.html',
  styleUrl: './table-coffee.component.css',
	providers: [DecimalPipe],
})
export class TableCoffeeComponent implements OnInit{
	p=0;
	coffeeRow?:Coffee;

	coffeeData! : Coffee[];
	coffeeObj! : Observable<Coffee[]>
	filter = new FormControl('', { nonNullable: true });
	@Output() iDFromTable = new EventEmitter<string>();

	constructor(private coffeeService: CoffeeDataService, private coffeeHttp: CoffeeHttpService,pipe: DecimalPipe) {
		this.coffeeObj = this.filter.valueChanges.pipe(
			startWith(''),
			map((text) => this.search(text, pipe)),
		);
	}
	ngOnInit() {
		this.coffeeHttp.getAllCoffees().pipe(
			map(c =>
				c.filter( r => r.active )
			)
		).subscribe(
			{next:(data)=>{
				this.coffeeData = data;
					this.coffeeData.sort((a, b) =>
						a.id < b.id ? -1 : 1
					);
					this.coffeeObj = of(this.coffeeData);

			}
			})

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

	getDetailsFromCoffee(data:any){
		const modelDiv= document.getElementById('myModalDetails');
		if(modelDiv != null){
			modelDiv.style.display='block';
		}
		//this.iDFromTable.emit(data.id);
		let idValue = +data.id;
		this.coffeeRow =  this.getDetailsById(idValue);
		console.log("Stop   "+ this.coffeeRow?.roaster);
		console.log('Id: '+data.id);
	}

	closeModal(){
		const modelDiv= document.getElementById('myModalDetails');
		if(modelDiv != null){
			modelDiv.style.display='none';
		}
	}

	getDetailsById(id:number){
		console.log(this.coffeeData.find(x=>x.id==id));
		return this.coffeeData.find(x=>x.id==id);
	}

	search(text: string, pipe: PipeTransform): Observable<Coffee[]> {
		console.log(text)
		// return this.coffeeData.filter((coffee) => {
		// 	const term = text.toLowerCase();
		// 	return (
		// 		coffee.roaster.toLowerCase().includes(term)
		// 	);
		// });
		this.coffeeObj.pipe(map(cd =>{cd.filter(coffee => coffee.roaster === text)}))
			.subscribe({next:(data: any)=> {this.coffeeData = data},complete:()=>{}})

		return this.coffeeObj

	}



}
