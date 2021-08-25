import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/components';

@Component({
  selector: 'app-template-document',
  templateUrl: './template-document.component.html',
  styleUrls: ['./template-document.component.css']
})
export class TemplateDocumentComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
