import { Component, ElementRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'contractor-overview',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loading: boolean;
  imagePath: string; 
  contractorId: string;
  locale: string;
  contractorApi: string;
  projectsPath: string;
  procurementPath: string;
  apiResponse: any;  

  constructor(private http: Http, private element: ElementRef) {   
    this.imagePath = this.element.nativeElement.getAttribute('imagePath'); 
    this.contractorApi = this.element.nativeElement.getAttribute('contractor-api');
    this.contractorId = this.element.nativeElement.getAttribute('contractor-id');
    this.locale = this.element.nativeElement.getAttribute('locale');
    this.projectsPath = this.element.nativeElement.getAttribute('projects-path');
    this.procurementPath = this.element.nativeElement.getAttribute('procurement-path');
    
    this.loading = true;
    let url = this.contractorApi + '&contr_id=' + this.contractorId + '&apilang=' + this.locale;
    let response = this.http.post(url, '').map((response: Response) => {           
      return response.json();
    }).catch((error: Response) => {    
      return Observable.throw(error);
    } );

    response.subscribe(apiResponse => {    
      this.loading = false;          	      
      this.apiResponse = apiResponse;
    });     
  }   
}
