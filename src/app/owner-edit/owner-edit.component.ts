import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { OwnerService } from '../shared/owner/owner.service';
import { GiphyService } from '../shared/giphy/giphy.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-owner-edit',
  templateUrl: './owner-edit.component.html',
  styleUrls: ['./owner-edit.component.css']
})
export class OwnerEditComponent implements OnInit, OnDestroy {
  owner: any = {};

  sub: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private ownerService: OwnerService,
              private giphyService: GiphyService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.ownerService.get(id).subscribe((owner: any) => {
          if (owner) {
          this.owner = owner;
            this.owner.href = owner._links.self.href;
            this.giphyService.get(owner.name).subscribe(url => owner.giphyUrl = url);
          } else {
            console.log(`Owner with id '${id}' not found, returning to list O.O / `);
            this.gotoList(); //no encuentra el pinche owner entonces lo manda a donde quiere
          }
        });
      }
    });
  }
  
 
  
  ngOnDestroy() {  
    this.sub.unsubscribe();
  }

  gotoList() {
    this.router.navigate(['/owner-list']);
  }

  save(form: NgForm) {   
    console.log("hola");
    this.ownerService.save(form).subscribe(result => {
      this.gotoList();  //retorna al owner list
    }, error => console.error(error));//si no existe muestra en consola error
  }

  remove(href) {  //eliminar
    this.ownerService.remove(href).subscribe(result => {
      this.gotoList();
    }, error => console.error(error));
  }
}

  