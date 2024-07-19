import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgForOf } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { Coffee } from '../common/coffee-model';
import { CoffeeHttpService } from '../services/coffee-http.service';
import { map } from 'rxjs';
import { ToastsService } from '../services/toasts.service';

@Component({
  selector: 'app-coffee-deleted',
  standalone: true,
	imports: [
		NgForOf,
		NgxPaginationModule,
	],
  templateUrl: './coffee-deleted.component.html',
  styleUrl: './coffee-deleted.component.css',
	providers: [ToastsService]
})
export class CoffeeDeletedComponent implements OnInit{
	p=0;
	coffeeData! : Coffee[];
	constructor(private coffeeHttp: CoffeeHttpService) {
	}


	ngOnInit() {
		this.getData();
	}

	changeActivation(coffee: Coffee, event: Event){
		coffee.active = true;
		console.log(event)
		this.coffeeHttp.updateCoffee(coffee)
			.subscribe({
				next: d=>{}
				,error: err => {}
				,complete: () => {this.getData()}
			});
	}

	getData(){
		this.coffeeHttp.getAllCoffees()
			.pipe(
				map(c =>
					c.filter( r => !r.active )
				)
			)
			.subscribe(
				{next:(data)=>{
						this.coffeeData = data;
					}
				})
	}

}
