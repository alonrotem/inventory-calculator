import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { GlobalsService } from '../../../services/globals.service';
import { Point } from '../../../../types';
import { find_intersection_point, find_point_on_line, line_at_angle_from_point, line_at_angle_from_point2, line_length } from './graphics-helper';

@Component({
  selector: 'app-wing-diagram',
  standalone: true,
  imports: [ ],
  templateUrl: './wing-diagram.component.html',
  styleUrl: './wing-diagram.component.scss'
})

export class WingDiagramComponent implements AfterViewInit, OnChanges {

  //inputs
  @Input() rights = [6, 8 , 10];//[5.5, 7, 8, 8.5,10];
  @Input() top_length = [0];
  @Input() lefts =[5];//, 7, 8, 8.5, 10];
  @Input() crown = [10];
  //@Input() crown_length = 2;//4;
  @Input() scale = 1;

  //defaults
  text_margin: number= 10;
  top_angles: number = 10;
  pan:Point = new Point(0,0);
  thickness: number = 1;
  cm_px = 15 * this.scale;
  top_left_bondaries: Point = new Point(2000, 2000);
  bottom_right_bondaries: Point = new Point(-2000, -2000);

  adjustBoundariesToSize(p: Point){
    /*
    console.log("===========================")
    console.log("p ->" + p.x + "," + p.y);
    console.log("t_l ->" + this.top_left_bondaries.x + "," + this.top_left_bondaries.y);
    console.log("b_r ->" + this.bottom_right_bondaries.x + "," + this.bottom_right_bondaries.y);
    */
    let adjusted:boolean = false;
    let adjust_point:string ="";
    if (p.x < this.top_left_bondaries.x){
      let reason = " (because p.x " + p.x + " < this.top_left_bondaries.x " + this.top_left_bondaries.x + ")";
      this.top_left_bondaries.x = p.x;
      adjusted = true;
      adjust_point += ((adjust_point=="")? "": ", ") + "1" + reason;
    }
    if(p.y < this.top_left_bondaries.y){
      let reason = " (because p.y " + p.y + " < this.top_left_bondaries.y " + this.top_left_bondaries.y + ")";
      this.top_left_bondaries.y = p.y;
      adjusted = true;
      adjust_point += ((adjust_point=="")? "": ", ") + "2" + reason;
    }
    if(p.x > this.bottom_right_bondaries.x){
      let reason = " (because p.x " + p.x + " > this.bottom_right_bondaries.x " + this.bottom_right_bondaries.x + ")";
      this.bottom_right_bondaries.x = p.x;
      adjusted = true;
      adjust_point += ((adjust_point=="")? "": ", ") + "3" + reason;
    }
    if(p.y > this.bottom_right_bondaries.y){
      let reason = " (because p.y " + p.y + " > this.bottom_right_bondaries.y " + this.bottom_right_bondaries.y + ")";
      this.bottom_right_bondaries.y = p.y;
      adjusted = true;
      adjust_point += ((adjust_point=="")? "": ", ") + "4" + reason;
    }
    /*
    if(adjust_point != ""){
      console.log("Adjusted at " + adjust_point);
      console.log("top_lefts " + this.top_left_bondaries.x + "," + this.top_left_bondaries.y);
      console.log("bot_right " + this.bottom_right_bondaries.x + "," + this.bottom_right_bondaries.y);
    }
    else {
      console.log("=== Not adjusted");
    }
    */
    return p;
  }

  @ViewChild("diagram_canvas", { read: ElementRef }) diagram_canvas!: ElementRef;
  @ViewChild("tooltip", { read: ElementRef }) tooltip!: ElementRef;

  ctx: any;
  color: string = "white";
  backcolor: string = "white";
  cursor: Point = new Point(0, 0);

  mouseMove(e: any){
    this.cursor.x = e.offsetX;
    this.cursor.y = e.offsetY;
    this.tooltip.nativeElement.style.left = `${e.pageX + 10}px`;
    this.tooltip.nativeElement.style.top = `${e.pageY + 15}px`;
    this.hideTooltip();
  }

  showTooltip(text: string){
    this.tooltip.nativeElement.style.display = "block";
    this.tooltip.nativeElement.innerHTML = text;
  }

  hideTooltip(){
    this.tooltip.nativeElement.style.display = "none";
  }

  // LEFTS
  lefts_top = new Point(354 * this.scale + this.pan.x, 231.5 * this.scale + this.pan.y);
  lefts_bottom = new Point(234 * this.scale + this.pan.x, 301.5 * this.scale + this.pan.y);
  lefts_start = new Point (234 * this.scale + this.pan.x, 315 * this.scale + this.pan.y);
  lefts_start_angle = 180;
  lefts_end_angle = (270 - this.top_angles);

  //RIGHT
  rights_top = new Point(385 * this.scale + this.pan.x, 231.5 * this.scale + this.pan.y);
  rights_bottom = new Point(510 * this.scale + this.pan.x, 290 * this.scale + this.pan.y);
  rights_start_angle = 270 + this.top_angles;
  rights_end_angle = 360;

  crown_bottom = new Point (510 * this.scale + this.pan.x , 326 * this.scale + this.pan.y);
  central_circle_point = new Point(this.lefts_top.x + ((this.rights_top.x - this.lefts_top.x)/2), this.lefts_bottom.y);
  base_shape_bottom: number = 531.5 * this.scale + this.pan.y;
  
  path_items:any = [];

      /*    top
          9____8
          /    \ rights
    lefts/      \7
        /10      | crown
1/12 __|    5 ___|6
     |  11   /
     |     4/
     |    |
    2|____|3
    */
  wing_base_shape = [
    this.adjustBoundariesToSize(new Point(221 * this.scale + this.pan.x, 315 * this.scale + this.pan.y)),       //1
    this.adjustBoundariesToSize(new Point(221 * this.scale + this.pan.x , this.base_shape_bottom)),             //2
    this.adjustBoundariesToSize(new Point(358.5 * this.scale + this.pan.x , this.base_shape_bottom)),           //3
    this.adjustBoundariesToSize(new Point(358.5 * this.scale + this.pan.x , 495 * this.scale + this.pan.y)),    //4
    this.adjustBoundariesToSize(new Point(475 * this.scale + this.pan.x , 326 * this.scale + this.pan.y)),      //5
    this.adjustBoundariesToSize(new Point(this.crown_bottom.x, this.crown_bottom.y)),                           //6 //bottom of crown
    this.adjustBoundariesToSize(new Point(this.rights_bottom.x, this.rights_bottom.y)),                         //7 bottom of rights
    this.adjustBoundariesToSize(new Point(this.rights_top.x ,this.rights_top.y)),                               //8 top of righs
    this.adjustBoundariesToSize(new Point(this.lefts_top.x , this.lefts_top.y)),                                //9 top of lefts
    this.adjustBoundariesToSize(new Point(this.lefts_bottom.x, this.lefts_bottom.y)),                           //10 bottom of lefts line
    this.adjustBoundariesToSize(new Point(234 * this.scale + this.pan.x , 315 * this.scale + this.pan.y)),      //11
    this.adjustBoundariesToSize(new Point(221 * this.scale + this.pan.x , 315 * this.scale + this.pan.y))       //12
  ];
  height_of_base_shape = this.rights_top.y - this.base_shape_bottom;
  width_of_base_shape = this.crown_bottom.x - 221 * this.scale + this.pan.x;

  constructor (private globalService: GlobalsService){
    this.setColors(this.globalService.currentTheme());
    this.globalService.themeChanged.subscribe({
      next: (theme: string)=> {
        this.setColors(theme);
      }
    });
  }
  
  checkArrEquality(a:[], b:[]) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  ngOnChanges(changes: SimpleChanges): void {
    let rebuild = false;
    if(!this.checkArrEquality(changes["lefts"]["currentValue"], changes["lefts"]["previousValue"])) rebuild = true;
    if(!this.checkArrEquality(changes["rights"]["currentValue"], changes["rights"]["previousValue"])) rebuild = true;
    if(!this.checkArrEquality(changes["top_length"]["currentValue"], changes["top_length"]["previousValue"])) rebuild = true;
    if(!this.checkArrEquality(changes["crown"]["currentValue"], changes["crown"]["previousValue"])) rebuild = true;
    //if(changes["crown"]["currentValue"] != changes["crown"]["previousValue"])  rebuild = true;
    //if(changes["crown_length"]["currentValue"] != changes["crown_length"]["previousValue"])  rebuild = true;

    if(rebuild)
      this.Rebuild();
  }

  setColors(theme:string){
    this.color = (theme == "dark")? "#f8f9fa": "#212529";
    this.backcolor = (theme == "dark")? "#212529" : "#f8f9fa";
  }

  ngAfterViewInit(): void {
    this.Rebuild();
    requestAnimationFrame(() => { this.drawDiagram(); });
  }

  public Rebuild(){
    if(! this.diagram_canvas || ! this.diagram_canvas.nativeElement)
      return;

    console.log("Rebuilding...");
    this.path_items = [];
    //console.log("REBUILD!");
    //console.log(this.lefts);
    this.buildLefts();
    this.buildTop();
    this.buildRights();
    this.buildCrown();
    console.log("BUILT");
    //check if the canvas has been initialized yet


    this.ctx = this.diagram_canvas.nativeElement.getContext('2d');
    let new_height = (this.bottom_right_bondaries.y - this.top_left_bondaries.y);
    let new_width = (this.bottom_right_bondaries.x - this.top_left_bondaries.x);

    this.diagram_canvas.nativeElement.width = new_width + 30;
    this.diagram_canvas.nativeElement.height = new_height + 30;

    this.pan.y = (new_height - this.height_of_base_shape) - (810 * this.scale);
    this.pan.x = (new_width -  this.bottom_right_bondaries.x) + (15 * this.scale);    
  }

  drawPoint(point: Point, color: string, size: number){
    if(!color){
      color = 'yellow';
    }
    if(!size) {
      size = 2;
    }
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.arc(point.x, point.y, size, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  draw_main_wing(){
    //main sape wing
    let wing_path = new Path2D();
    for(let p=0; p < this.wing_base_shape.length; p++) {
      if(p==0){
        wing_path.moveTo(this.wing_base_shape[p].x + this.pan.x, this.wing_base_shape[p].y + this.pan.y);
      }
      else  {
        wing_path.lineTo(this.wing_base_shape[p].x + this.pan.x, this.wing_base_shape[p].y + this.pan.y);
      }
    }
    wing_path.closePath();
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.thickness;
    this.ctx.stroke(wing_path);   
  }

  buildLefts(){
    // divide the left line to equal segments and find coordinate starting wach
    //total line length
    let lefts_line_lengh = line_length(this.lefts_bottom, this.lefts_top);
    //the first baby has a special place on the most left. divide the line by one less part, find segment length
    let left_line_segment = lefts_line_lengh / (this.lefts.length - 1);
    //calculate by how much we need to increment the angle on each segment
    let left_angle_segment = (this.lefts_end_angle - this.lefts_start_angle) / this.lefts.length; //increment the angle by this, every time

    //initial points - mark the start points of each baby on the left line, equally spaced
    let segment_points_left_line = [this.lefts_start, this.lefts_bottom];
    let remaining_points = this.lefts.length;

    //prevent the left babies take all the width, make them be as thin as if they were 5
    if(this.lefts.length < 4){
      left_angle_segment = (this.lefts_end_angle - this.lefts_start_angle)/5;
      left_line_segment = lefts_line_lengh / 5;
      remaining_points = 4;
    }

    for(let i=1; i < remaining_points; i++) {
      let next_point = find_point_on_line(this.lefts_bottom, this.lefts_top, left_line_segment * i);
      segment_points_left_line.push(next_point);
    }
    //console.log(segment_points_left_line);

    let curr_angle = this.lefts_start_angle;
    
    //build the path shapes
    for(let i=0; i < this.lefts.length; i++) {

      let path = new Path2D();
      //start with the marked point
      let p1 = this.adjustBoundariesToSize(new Point(segment_points_left_line[i].x, segment_points_left_line[i].y));
      //find the point going up straight form the point (p1->p2), at the current angle
      let p2 = this.adjustBoundariesToSize(line_at_angle_from_point2(segment_points_left_line[i], this.lefts[i]*this.cm_px , curr_angle));
      //find the next point (p3) by caltuating its angle from the next segment point
      let p3 = this.adjustBoundariesToSize(line_at_angle_from_point2(segment_points_left_line[i+1], this.lefts[i]*this.cm_px , curr_angle + left_angle_segment));
      //p4 is just the next point on the segments
      let p4 = this.adjustBoundariesToSize(new Point(segment_points_left_line[i+1].x, segment_points_left_line[i+1].y));

      path.moveTo(p1.x, p1.y);
      path.lineTo(p2.x, p2.y);
      path.lineTo(p3.x, p3.y);
      path.lineTo(p4.x, p4.y);
      path.closePath();
      //console.log(p1, p2, p3, p4);
      
      curr_angle += left_angle_segment;

      //find the center point of this baby
      //first the point in the middle of the segment
      let mid_segment_point = (i>0)?
        find_point_on_line(segment_points_left_line[i], segment_points_left_line[i+1], left_line_segment/2)
      :
        new Point(this.lefts_start.x, this.lefts_start.y + ((this.lefts_bottom.y - this.lefts_start.y)/2));
      
      let mid_shape_point = this.adjustBoundariesToSize(line_at_angle_from_point(mid_segment_point, (this.lefts[i] * this.cm_px)/2, (curr_angle -  (left_angle_segment/2))));
      let length_text_point = this.adjustBoundariesToSize(line_at_angle_from_point(mid_segment_point, (this.lefts[i] * this.cm_px) + this.text_margin, (curr_angle -  (left_angle_segment/2))));
      
      this.path_items.push({
        path: path,
        title: "L" + (i+1),
        length: this.lefts[i],
        tooltip:  "<strong><span class='icon-feather-wing'></span> L" + (i+1) + "</strong><br/>" + this.lefts[i] + " cm",
        mid_point: mid_shape_point,
        length_info_point: length_text_point,
        show_tooltip: true,
        show_length: true,
        show_text: true
      });
    }
  }

  buildTop()
  {
    if(this.top_length[0] <= 0)
      return;
    // TOP
    // ==========
    let top_p1 = this.adjustBoundariesToSize(this.lefts_top);
    let top_p2 = this.adjustBoundariesToSize(line_at_angle_from_point(this.lefts_top, this.top_length[0] * this.cm_px, this.lefts_end_angle));
    let top_p3 = this.adjustBoundariesToSize(line_at_angle_from_point(this.rights_top, this.top_length[0] * this.cm_px, this.rights_start_angle));
    let top_p4 = this.adjustBoundariesToSize(this.rights_top);
    let top_path = new Path2D();
    top_path.moveTo(top_p1.x, top_p1.y);
    top_path.lineTo(top_p2.x, top_p2.y);
    top_path.lineTo(top_p3.x, top_p3.y);
    top_path.lineTo(top_p4.x, top_p4.y);
    top_path.closePath();
    //let top_center_point = line_at_angle_from_point(new Point(top_p1.x + ((top_p4.x-top_p1.x)/2), top_p1.y), ((this.top_length * this.cm_px)/2) , 270);
    let top_center_point = line_at_angle_from_point(new Point(this.lefts_top.x + ((this.rights_top.x-this.lefts_top.x)/2), this.lefts_top.y), ((this.top_length[0] * this.cm_px)/2) , 270);
    let top_measure_point = line_at_angle_from_point(new Point(this.lefts_top.x + ((this.rights_top.x-this.lefts_top.x)/2), this.lefts_top.y), (this.top_length[0] * this.cm_px) + this.text_margin , 270);
  
    this.path_items.push({
      path: top_path,
      title: "Top",
      length: this.top_length[0],
      mid_point: this.adjustBoundariesToSize(top_center_point),
      length_info_point: this.adjustBoundariesToSize(top_measure_point),
      tooltip:  "<strong><span class='icon-top'></span> Top</strong><br/>" + this.top_length[0] + " cm",
      show_tooltip: true,
      show_length: true,
      show_text: true
    });
  }

  buildRights() {
    // RIGHTS
    // ==========
    let rights_line_length = line_length(this.rights_top, this.rights_bottom);
    let rights_segment_length = rights_line_length / this.rights.length;
    let rights_angle_segment = (this.rights_end_angle - this.rights_start_angle) / this.rights.length;
    let cur_right_point = this.rights_bottom;
    let cur_right_angle = this.rights_end_angle;

    if(this.rights.length < 4){
      rights_angle_segment = (this.rights_end_angle - this.rights_start_angle) / 5;
      rights_segment_length = rights_line_length / 5;
    }

    for(let i=0; i < this.rights.length  ; i++) {
      let path = new Path2D();

      let p1 = this.adjustBoundariesToSize(new Point(cur_right_point.x, cur_right_point.y));

      let next_right_point = find_point_on_line(cur_right_point, this.rights_top, rights_segment_length);
      let right_mid_point = find_point_on_line(cur_right_point, this.rights_top, rights_segment_length/2);

      let p2 = this.adjustBoundariesToSize(line_at_angle_from_point(cur_right_point, this.rights[i] * this.cm_px, cur_right_angle));
      let p3 = this.adjustBoundariesToSize(line_at_angle_from_point(next_right_point, this.rights[i] * this.cm_px, cur_right_angle - rights_angle_segment));
      let p4 = this.adjustBoundariesToSize(new Point(next_right_point.x, next_right_point.y));

      let center_point = line_at_angle_from_point(right_mid_point, ( this.rights[i] * this.cm_px)/2, cur_right_angle - (rights_angle_segment/2));
      let length_text_point = line_at_angle_from_point(right_mid_point, ( this.rights[i] * this.cm_px) + this.text_margin, cur_right_angle - (rights_angle_segment/2));

      path.moveTo(p1.x, p1.y);
      path.lineTo(p2.x, p2.y);
      path.lineTo(p3.x, p3.y);
      path.lineTo(p4.x, p4.y);

      cur_right_point = next_right_point;
      cur_right_angle -= rights_angle_segment;

      this.path_items.push({
        path: path,
        title: "R" + (i+1),
        length: this.rights[i],
        mid_point: this.adjustBoundariesToSize(center_point),
        length_info_point: this.adjustBoundariesToSize(length_text_point),
        tooltip:  "<strong><span class='icon-feather-wing-r'></span> R" + (i+1) + "</strong><br/>" + this.rights[i] + " cm",
        show_tooltip: true,
        show_length: true,
        show_text: true
      });
    }
  }

  buildCrown(){
    // CROWN
    // ========
    //console.log(this.crown);
    let crown_height = this.crown_bottom.y - this.rights_bottom.y;
    let crown_segment_height = crown_height / this.crown.length;
    let crown_part = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    for(let c=0; c < this.crown.length; c++) {
      let crown_path = new Path2D();
      crown_path.rect(this.rights_bottom.x, this.rights_bottom.y + ((this.crown.length - (c+1)) * crown_segment_height), this.crown[0] * this.cm_px,  crown_segment_height);
      let info_point = (this.adjustBoundariesToSize(new Point(
        this.rights_bottom.x + (this.crown[0] * this.cm_px) + this.text_margin + 5, 
        this.rights_bottom.y + (crown_segment_height * this.crown.length)/2))
      );

      this.path_items.push({
        path: crown_path,
        tooltip: "<strong><span class='icon-crown'></span> Crown " + "(" + crown_part[c] + ") </strong><br/>" + (c+1) + " x " + this.crown[0] + " cm",
        length: this.crown[0],
        mid_point: 0,//this.top_center_point,
        length_info_point: info_point,
        show_tooltip: true,
        show_length: true,
        show_text: false
      });    
    }
  }

  drawBabies(){
    this.ctx.save();
    this.ctx.translate(this.pan.x, this.pan.y);

    for (let baby_i=0; baby_i < this.path_items.length; baby_i++) {
      this.ctx.strokeStyle=this.color;
      this.ctx.lineWidth=this.thickness;
      this.ctx.stroke(this.path_items[baby_i].path);
  
      this.ctx.beginPath();
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillStyle = this.color;
      this.ctx.font = "normal " + (12 * this.scale) + "px Arial";
      
      this.ctx.fillText(this.path_items[baby_i].length, this.path_items[baby_i].length_info_point.x, this.path_items[baby_i].length_info_point.y);
  
      if(this.ctx.isPointInPath(this.path_items[baby_i].path, this.cursor.x, this.cursor.y))
      {
        this.ctx.fillStyle = '#ffc107'; 
        this.ctx.fill(this.path_items[baby_i].path);
        if(this.path_items[baby_i].show_tooltip)
          this.showTooltip(this.path_items[baby_i].tooltip);

        this.ctx.fillStyle = this.backcolor;
      }
      else
      {
        this.ctx.fillStyle = this.color;
      }
      if(this.path_items[baby_i].show_text)
      {
        this.ctx.fillText(this.path_items[baby_i].title, this.path_items[baby_i].mid_point.x, this.path_items[baby_i].mid_point.y);
      }
    }
    this.ctx.restore();    
  }

  drawShapes (){

    this.draw_main_wing();
    this.drawBabies();
  }

  drawDiagram() {
    this.ctx.clearRect(0,0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.drawShapes();
    requestAnimationFrame(() => this.drawDiagram());
  }
}
