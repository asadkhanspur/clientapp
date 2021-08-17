import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // ***************** CheckValidation Method *****************// 
  public validateForm = (form: FormGroup, controlName: string, errorName: string) => {
    return form.controls[controlName].hasError(errorName);
  }
  // ***************** CheckValidation Method *****************// 


  // ***************** Filter Type Check Method *****************//
  public validDocumentExt(fileName: string): boolean {
    var ext = fileName.split('.')[fileName.split('.').length - 1];
    if (ext === 'txt' || ext === 'csv' || ext === 'pdf' || ext === 'xlsx' || ext === 'zip' || ext === 'doc' || ext === 'docx' || ext === 'xml' || ext === 'xls' || ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'ppt' || ext === 'rpt' || ext === 'aci' || ext === 'zap' || ext === 'zoo') {
      return true;
    }
    return false;
  }
  // ***************** Filter Type Check Method *****************// 

  // ***************** Data Sorting Method *****************// 
  sort(column, array) {
    if (array._sortColumn == undefined) {
      array._sortColumn = true;
    }
    if (array._sortColumn) {
      this.ascendic(column, array);
    }
    else {
      this.descendic(column, array);
    }
    array._sortColumn = !array._sortColumn;
  }

  ascendic(column, list) {
    list = list.sort((n1, n2) => {
      if (n1[column] < n2[column]) {
        return 1;
      }
      if (n1[column] > n2[column]) {
        return -1;
      }
      return 0;
    });
  }

  descendic(column, list) {
    list = list.sort((n1, n2) => {
      if (n1[column] > n2[column]) {
        return 1;
      }
      if (n1[column] < n2[column]) {
        return -1;
      }
      return 0;
    });
  }
  // ***************** Data Sorting Method *****************// 

}
