const canvas= document.querySelector('canvas');
let c= canvas.getContext('2d');
// let W= window.innerWidth;
let H= window.innerHeight-50;
let W=H;
canvas.width=H;
canvas.height=H;



const cols=25;
const rows=25;
let grid= new Array(cols);
const w= W/cols;
const h= H/rows;
for(let k=0;k<grid.length;k++){
    grid[k]= new Array(rows);
}


class Nodes{
    constructor(i,j){
        this.f=0;
        this.g=0;
        this.h=0;
        this.i=i;
        this.j=j;
        this.r=10;
        this.neighbours=[];
        this.previous= null;
        this.wall=false;
        if(Math.random()<0.25){
            this.wall=true
        }
    }

    draw(r,g,b){
        c.beginPath();
        if(this.wall)
            c.fillStyle='rgb(0,0,0)';
        else
        c.fillStyle='rgb('+r+','+g+','+b+')';
        c.fillRect(this.i*w,this.j*h,w,h);
        c.fill();
    }
    
    addNeighbours(){
        let i=this.i;
        let j=this.j;
        if(i<cols-1) this.neighbours.push(grid[i+1][j]);
        if(i>0) this.neighbours.push(grid[i-1][j]);
        if(j<rows-1) this.neighbours.push(grid[i][j+1]);
        if(j>0) this.neighbours.push(grid[i][j-1]);

        if(i>0 && j>0) this.neighbours.push(grid[i-1][j-1]);
        if(i<cols-1 && j>0) this.neighbours.push(grid[i+1][j-1]);
        if(i>0 && j<rows-1) this.neighbours.push(grid[i-1][j+1]);
        if(i<cols-1 && j>0) this.neighbours.push(grid[i+1][j+1]);

    }
}

function initiallise(){
    for(let i=0;i<grid.length;i++){
        for(let j=0;j<grid[i].length;j++){
            grid[i][j]= new Nodes(i,j);
            // grid[i][j].draw(0,0,255);
        }
    }
    for(let i=0;i<grid.length;i++){
        for(let j=0;j<grid[i].length;j++){
            grid[i][j].addNeighbours();
        }
    }
}
initiallise();


let openSet=[];
let closeSet=[];
let path=[];
const start= grid[0][0];
const end= grid[cols-1][rows-1];
start.wall=false;
end.wall=false;
start.h= Math.sqrt(((end.i*end.i)+(end.j*end.j)));
start.f=start.h;
openSet.push(start);


function fillColor(){
    for(let i=0;i<grid.length;i++){
        for(let j=0;j<grid[i].length;j++){
            grid[i][j].draw(0,0,255);
        }
    }
    for (let i = 0; i < openSet.length; i++) {
        openSet[i].draw(0,255,0);
    }
    for (let i = 0; i < closeSet.length; i++) {
        closeSet[i].draw(255,0,0);
    }
    for (let i = 0; i < path.length; i++) {
        path[i].draw(255,255,255);
    }
}

//  main algorithm

function astar(){
    let lowest=0;
    if(openSet.length>0){
      
        for (let i = 0; i < openSet.length; i++) {
           if(openSet[i].f<openSet[lowest].f){
                lowest=i;
                // console.log(lowest);
            }  
            console.log(i+"-"+openSet[i].f); 
        }
    
    
        let current= openSet[lowest];
        if(current=== end){
            let temp = current;
            path.push(temp);
            while(temp.previous){
                path.push(temp.previous);
                temp=temp.previous;
            }
            console.log("done");
        }

        remove(openSet,current);
        closeSet.push(current);

        let neighbours= current.neighbours;
        for (let i = 0; i < neighbours.length; i++) {
            if(!closeSet.includes(neighbours[i]) && !neighbours[i].wall){
                let tempG= current.g+1/w;
                
                if(openSet.includes(neighbours[i])){
                    if(tempG<neighbours[i].g){
                        neighbours[i].g=tempG;
                        neighbours[i].h= heuristic(neighbours[i],end);
                        neighbours[i].f= neighbours[i].g + neighbours[i].h;
                        neighbours[i].previous= current;
                    }
                }else{
                    neighbours[i].g=tempG;
                    neighbours[i].h= heuristic(neighbours[i],end);
                    neighbours[i].f= neighbours[i].g + neighbours[i].h;
                    neighbours[i].previous= current;
                    openSet.push(neighbours[i]);
                }
            }
            
        }
    }else{
        console.log("no solution");
    }
    
}

function heuristic(a,b){
    let xSquare= Math.pow((b.i-a.i),2);
    let ySquare= Math.pow((b.j-a.j),2);
    return Math.sqrt((xSquare+ySquare));
}

// extra function

function remove(array,el){
    for (let i = array.length; i>0; i--) {
        if(array[i]==el){
            array.splice(i,1);
        }
        
    }
}

// let point={
//     i:0,
//     j:1
// }
// console.log(heuristic(point,end));

function animate(){
    c.clearRect(0,0,W,H); 
    fillColor();
    astar();
    requestAnimationFrame(animate);
}
animate();