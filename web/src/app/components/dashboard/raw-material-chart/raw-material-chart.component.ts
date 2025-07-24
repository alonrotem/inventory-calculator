import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import 'chartjs-adapter-date-fns'; 
import { enUS } from 'date-fns/locale'; 
import { InfoService } from '../../../services/info.service';
import { QuantityHistoryRecord } from '../../../../types';
import { GlobalsService } from '../../../services/globals.service';

@Component({
  selector: 'app-raw-material-chart',
  standalone: true,
  imports: [],
  templateUrl: './raw-material-chart.component.html',
  styleUrl: './raw-material-chart.component.scss'
})
export class RawMaterialChartComponent implements OnInit, OnChanges {

  @Input() data :any[] = [];
  @Input() raw_material_quantity_units :string = "";
  @Input() color :string = "green";
  chart: any;

  constructor(private infoService: InfoService, private globalService: GlobalsService){
    globalService.themeChanged.subscribe((theme: string) => {
      //console.log("Theme: " + theme);
      this.reloadChart(this.data);
    });
  }

  ngOnInit(): void {
  }

  dateStr(value: any): string {
    let d: Date = new Date();
    if(typeof value == "string")
    {
        d = new Date(value);
    }
    else
    {
        d = value;
    }
    return d.getFullYear() + "-" + 
      (d.getMonth()+1).toString().padStart(2, '0') + "-" + 
      d.getDate().toString().padStart(2, '0');
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.infoService.getRawMaterialsQuantityHistory(this.raw_material_quantity_units).subscribe({
      next: (history_records:QuantityHistoryRecord[])=>{
        this.data = history_records.map((rec) => ({ x: this.dateStr(rec.date), y: rec.cumulative_amount }));
        //console.log(this.data);
        /*data = [
          { x: "2024-10-12", y: 10 },
          { x: "2024-10-13", y: 12 },
          { x: "2024-10-14", y: 6 },
          { x: "2024-10-15", y: 9 },
          { x: "2024-10-16", y: 20 },
          { x: "2024-10-17", y: 3 },
          { x: "2024-10-18", y: 29 },
        ];*/
        this.reloadChart(this.data);
      }
    });
  }

  reloadChart(data: any){
    //console.log(this.globalService.currentTheme());
    let grid_color = (this.globalService.currentTheme() == "dark") ?
      "rgba(255, 255, 255, 0.65)" : "black";
    
    if(this.chart)
      this.chart.destroy();

    this.chart = new Chart('MyChart' + this.raw_material_quantity_units, {
      type: 'line',
      data: {
        datasets: [{
          label: this.raw_material_quantity_units,
          data: data,               
          backgroundColor: 'transparent',
          borderColor: this.color,
          borderWidth: 2,
          tension: 0.5
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                  minute: 'yyyy-MM-dd',
                  day: 'yyyy-MM-dd'
              },
              tooltipFormat: 'yyyy-MM-dd'
            },
            title: {
              display: true,
              text: 'Date'
            },
            grid: {
              color: grid_color
            }
          },
          y: {
            title: {
              display: true,
              text: this.raw_material_quantity_units
            },
            grid: {
              color: grid_color
            }
          }
        },
        aspectRatio: 1
      }
    });
  }
}
