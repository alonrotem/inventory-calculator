import { Point } from "../../../../types";

export function line_length(p1: Point, p2: Point): number {
    var a = p1.x - p2.x;
    var b = p1.y - p2.y;
    return Math.sqrt(a**2 + b**2);
  }
  
export function find_point_on_line(point_from: Point, point_towards: Point, distance: number): Point{
    var length = line_length(point_from, point_towards);
    var distance_ratio = (distance/length);
    var x_towards = point_from.x - (distance_ratio * (point_from.x - point_towards.x));
    var y_towards = point_from.y - (distance_ratio * (point_from.y - point_towards.y));
    return new Point(x_towards, y_towards);
  }
  

export  function line_at_angle_from_point(origin_point: Point, distance: number, angle: number): Point{
    var d_x = distance * Math.cos(angle * (Math.PI/180));
    var d_y = distance * Math.sin(angle * (Math.PI/180));
    var x2 = origin_point.x + d_x;
    var y2 = origin_point.y + d_y;
    return new Point(x2, y2);
  }
  
  export function line_at_angle_from_point2(origin_point: Point, distance: number, angleDegrees: number): Point {
      // Convert the angle from degrees to radians
      let angleRadians = angleDegrees * (Math.PI / 180);
  
      // Calculate the new x and y coordinates using trigonometry
      return new Point 
        (origin_point.x + distance * Math.cos(angleRadians),
        origin_point.y + distance * Math.sin(angleRadians));
  }
  
  export function find_intersection_point(p1_line_1: Point, p2_line_1: Point, p1_line_2: Point, p2_line_2: Point): Point | null
  {
      var ua, ub, denom = (p2_line_2.y - p1_line_2.y)*(p2_line_1.x - p1_line_1.x ) - (p2_line_2.x - p1_line_2.x)*(p2_line_1.y - p1_line_1.y);
      if (denom == 0) {
          return null;
      }
      ua = ((p2_line_2.x - p1_line_2.x)*(p1_line_1.y - p1_line_2.y) - (p2_line_2.y - p1_line_2.y)*(p1_line_1.x  - p1_line_2.x))/denom;
      ub = ((p2_line_1.x - p1_line_1.x )*(p1_line_1.y - p1_line_2.y) - (p2_line_1.y - p1_line_1.y)*(p1_line_1.x  - p1_line_2.x))/denom;
      return {
          x: p1_line_1.x  + ua * (p2_line_1.x - p1_line_1.x),
          y: p1_line_1.y + ua * (p2_line_1.y - p1_line_1.y)
      };
  }
  
  //https://stackoverflow.com/a/30625508
  function arc_between_points(path: any, p1: Point, p2: Point, arc_center: Point, counter_clockwise: boolean){
    //ctx.beginPath(); 
    var
      diffX = p1.x - arc_center.x,
      diffY = p1.y - arc_center.y,
      radius = Math.abs(Math.sqrt(diffX*diffX + diffY*diffY)),
      startAngle = Math.atan2(diffY, diffX),
      endAngle   = Math.atan2(p2.y - arc_center.y, p2.x - arc_center.x);
  
      path.arc(arc_center.x, arc_center.y, radius, startAngle, endAngle, counter_clockwise);
  }