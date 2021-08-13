import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    $(document).ready(function () {
      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('.MenuDiv').toggleClass('d-none');
        $('.iconDiv').toggleClass('d-none');
       // $(this).find("i").toggleClass("fa fa-chevron-left fa fa-chevron-right");
      });



      $('#sidebarCollapseRemove').on('click', function () {
        $('.MenuDiv').toggleClass('d-none');
         $('.iconDiv').toggleClass('d-none');
        $('#sidebar').toggleClass('active');
        //$(this).find("i").toggleClass("fa fa-chevron-left fa fa-chevron-right");
      });


    });

  }

}
