import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

export interface Fruit {
  name: string;
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

interface ITab {
  title: string;
  content: string;
  removable?: boolean;
  disabled?: boolean;
  active?: boolean;
  customClass?: string;
}


@Component({
  selector: 'app-html-template',
  templateUrl: './html-template.component.html',
  styleUrls: ['./html-template.component.css']
})
export class HtmlTemplateComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

this.tabz = {content: 'Dynamic content 3', removable: true }
    
  }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();


  tabz:any
  removeTabHandler(tab: ITab): void {
    
    console.log('Remove Tab handler');
  }

  // **** Input Chips Type Script **** //
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  fruits: Fruit[] = [
    {name: 'Lemon'},
    {name: 'Lime'},
    {name: 'Apple'},
  ];

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push({name: value});
    }

    // Clear the input value
    // event.chipInput!.clear();
  }

  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }
  // **** Input Chips Type Script **** //


  // **** Tabs Script **** //
 
 
 
  // **** Tabs Script **** //




}
