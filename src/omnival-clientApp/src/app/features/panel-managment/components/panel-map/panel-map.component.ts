
import { Component, OnInit } from '@angular/core';

import * as $ from 'jquery';
import { finalize, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, style, animate, transition, animation } from '@angular/animations';

import * as Highcharts from "highcharts/highmaps";
import Drilldown from 'highcharts/modules/drilldown';
Drilldown(Highcharts);

// ********* Services Import ********* //
import { PanelManagmentService } from './../../service';
// ********* Services Import ********* //


@Component({
  selector: 'app-panel-map',
  templateUrl: './panel-map.component.html',
  styleUrls: ['./panel-map.component.css']
})
export class PanelMapComponent implements OnInit {


  // ***** General Variables ***** //
  loadingforgot = false
  gifLoader = false
  errorMessage:any
  // ***** General Variables ***** //


  // ***** variables Use in Different Calls ***** //
  mapstateCode: string
  isStateFromMap: boolean = false;
  states: any;
  resetValueState: any
  // ***** variables Use in Different Calls ***** //


  // ***** High Chart Variables ***** //
  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor = "mapChart";
  chartOptions: Highcharts.Options;
  updateFromInput = false;
  chart;
  chartCallback;
  // ***** High Chart Variables ***** //

  constructor(
    private snackBar: MatSnackBar,
    private PanelManagmentService: PanelManagmentService,
  ) { 

    
    this.chartCallback = (chart: typeof Highcharts) => {
      this.chart = chart;
      this.chart.drilldownLevels = [];
    };
  }

  ngOnInit() {
    this.generateMap(); 
  }


  
  // *****************  Click on Map State Get Data Method  ***************** //
  methodMap(stateCode: string) {
    this.mapstateCode = stateCode;
    this.isStateFromMap = true;
    // this.states = this.stateList.find(x => x.stateCode == this.mapstateCode).stateName;
    this.resetValueState = this.mapstateCode;
    // this.applyFilter();
    // this.getCurrentVendorByStateCode(this.mapstateCode)
    // this.getAvailableVendorByStateCode(this.mapstateCode)
    // this.getPendingVendorByStateCode(this.mapstateCode);
    // this.getVendorProductStatsByStateCode(this.mapstateCode);
    // this.getVendorStatsByStateCode(this.mapstateCode);
  }
  // *****************  Click on Map State Get Data Method  ***************** //


  

  // *****************  Hight Chart Map Method  ***************** //
  // require:any
  generateMap() {
    const self = this;
    self.Highcharts = Highcharts;

    const usMapData = require("@highcharts/map-collection/countries/us/us-all.geo.json");
    const usMap = Highcharts.geojson(usMapData);
    self.chartOptions = {
      chart: {
        height: (10 / 16) * 100 + "%",
        events: {
          drilldown: function (e: any) {
            setTimeout(() => {
              self.methodMap(e.point.splitName);
              const mapKey = "countries/us/" + e.point.drilldown + "-all";
              const mapData = require(`@highcharts/map-collection/${mapKey}.geo.json`);
              const provinceData = Highcharts.geojson(mapData);
              self.chart.hideLoading();
              self.chart.addSeriesAsDrilldown(e.point, {
                name: e.point.name,
                data: provinceData,
                tooltip: {
                  pointFormat: '{point.name}'
                },
                dataLabels: {
                  enabled: true,
                  format: '{point.name}',
                  style: {
                    fontSize:'1rem',
                    fontFamily: "Segoe UI"
                  }
                }
              } as Highcharts.SeriesOptionsType);
              self.chart.setTitle(null, { text: e.point.name });
              
            }, 100);
          },
          drillup() {
            //self.resetMethod();
          }
        }
      },
      title: {
        text: ""
      },
      colorAxis: {
        min: 0,
        // minColor: '#c8d6e5',
        // maxColor: '#218c74',
        dataClasses: [{
          from: 10,
          to: 30,
          color: '#922291'
        }],
      },
      legend:{ enabled:false },
      mapNavigation: {
        enabled: false,
        buttonOptions: {
          verticalAlign: "top"
        }
      },
      plotOptions: {
        map: {
          states: {
            hover: {
              color: "#F8BA03"
            }
          }
        }
      },
      series: [
        {
          type: "map",
          name: "United States",
          data: null,
          dataLabels: {
            enabled: true,
            format: `{point.splitName}`,
            style: {
              fontSize:'1rem',
              fontFamily: 'Segoe UI',
              textTransform: 'uppercase',
              textDecoration: ''
            }
          }
        }
      ],
      drilldown: {}
    };
    
    var clientId = localStorage.getItem("clientID");
    self.PanelManagmentService.getAllVendorStates(clientId).pipe(
      tap(result => {
        self.chart.showLoading();
        
        usMap.forEach((el: any, i) => {
          el.splitName = el.properties["hc-key"].split('-')[1].toUpperCase();
          el.drilldown = el.properties["hc-key"];
          const getFirstMatchedVendor = result.data.find(vendorObj => vendorObj.State_Code == el.splitName);
          if (getFirstMatchedVendor) {
            el.value = getFirstMatchedVendor.Vendor_Count;
          }
        });

        self.chartOptions.series = [
          {
            type: "map",
            data: usMap
          }
        ];
        
        self.updateFromInput = true;
        self.chart.hideLoading();
      },
        (error: any) => {
          self.gifLoader = false
          self.errorMessage = error.error.message;
          self.snackBar.open(self.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving all vendors state list : ${error}`);
        }
      ),
      finalize(() => {})).subscribe();
  }


  defaultState() {
    // if (this.chart.drilldownLevels.length > 0) {
    //     this.chart.drillUp();
    //     this.mapstateCode = ''
    //     this.resetValueState = null;
    //     this.isStateFromMap = false;
    //     this.stateCode = null;
    //     if((this.vendorTypeId === undefined || this.vendorTypeId === null || this.vendorTypeId === 0) && (this.productCategory === 0 || this.productCategory === null || this.productCategory === undefined))
    //     {
    //       this.getCurrentVendor();
    //       this.getAvailableVendor();
    //       this.getAvailableVendor();

    //     }
    //     else
    //     {
    //       this.applyFilter();
    //       this.getCurrentVendor(this.filter);
    //       this.getAvailableVendor(this.filter);
    //       this.getPendingVendor(this.filter);
    //     }
    //     this.getVendorProductStats();
    //     this.getVendorStats();
    // }
  }

  //  *************************************   Map Section TS  ************************************* //

}
