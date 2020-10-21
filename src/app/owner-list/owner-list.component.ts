import { Component, OnInit } from '@angular/core';
import { OwnerService } from '../shared/owner/owner.service';

import {CarService} from '../shared/car/car.service';
import { throwMatDuplicatedDrawerError } from '@angular/material';

@Component({
  selector: 'app-owner-list',
  templateUrl: './owner-list.component.html',
  styleUrls: ['./owner-list.component.css']

})
export class OwnerListComponent implements OnInit {
  owners: Array<any>;
  public vector=[];
  cars: Array<any>;

  constructor(private ownerService: OwnerService, private carService: CarService) { }

  ngOnInit() {
    this.ownerService.getAll().subscribe(data => {
      
      this.owners=data._embedded.owners;
      console.log(this.owners);
    });
    //console.log(this.owners);
  }
  obtenerDni(href){
    
    let id=href.lastIndexOf("/"); // esto trae la posicion en la que se encuentra el simbolo"/"
    
    return href.substring(id++,href.length); //luego retorno el substring desde la posicion despues de el simbolo hasta el final del href.
  }

  cambio(href,otrovalor){
    if(otrovalor==true){
      this.vector.push(href);

    }else{
      let posi=this.vector.indexOf(href);
      this.vector.slice(posi,1);

    }
    
  }
  borrar(){
    
   
    this.carService.getAll().subscribe(data => {
      //this.cars = data;
      this.cars=data._embedded.cars;
      for(let i of this.vector){
        for(let j of this.owners){
          if(i==j._links.self.href){
            for (const car of this.cars) {
              if(car.ownerDni==j.dni){
                car.ownerDni=null;
                car.href=car._links.self.href;
                this.carService.save(car).subscribe();
                
              }
              
            }
          }
        }
        this.ownerService.remove(i).subscribe();
      
      }
      

    });
  window.location.reload();
  }
}
 