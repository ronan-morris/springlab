MaxTimesGraph = new Array(0.2, 0.4, 0.8, 1, 2, 4, 5, 8, 16);
BigLinesX = new Array(4,8,8,10,4,8, 5, 8,8);
XSpace = new Array(200,100,100,80,200,100,160,100,100);
IncX = new Array(0.05,0.05,0.1,0.1,0.5,0.5,1,1,2);
LinesBetweenX = new Array(5,5,10,5,5, 5,10,10,10);

TopForceOnGraph = new Array(.1,.2,.5,1,2,5,10,20);
BigLinesFY = new Array(5, 4, 5, 5, 4, 5, 5, 4);
FYSpace = new Array(100,125,100,100,125,100,100,125);
IncFY = new Array(0.02,0.05,0.1,0.2,0.5,1,2,5);
LinesBetweenFY = new Array(10,5,10,10,5,10,10,5);



springconstants = new Array (1.2, 3.2, 6.1, 8.2, 10.8, 13.4, 18.4, 20.7);
numberofloops = new Array (25, 25, 25, 25, 25, 25, 25, 25);
originallengths = new Array (100, 100, 100, 100, 100, 100, 100, 100);
springthickness = new Array (0.5, 1.0, 1.5, 2, 2.5, 3, 3.5, 4);
StretchSpeed = new Array (300, 250, 230, 210, 170, 150, 140, 120);

Languages = new Array("English", "Irish");

var datacollected = [];
var datathisiteration = [];
var checkcontinue = 10;
const fs = require('fs');

/* called by onLoad */

function initialize(){
	Running = "No";
	Reset = "Yes";
	springnumber = 7/*Math.floor(Math.random()*6+1);*/
	
	MaxStretchFactor = 1;
	XType = 7;
	HighGrid = 20;
	LowGrid = 520;
	LeftGrid = 105;
	RightGrid = 920;
	YSpace = 100;
	MidX = (RightGrid-LeftGrid)/2 + LeftGrid;
	MidY = LowGrid - (LowGrid - HighGrid)/2;
	MaxY = 1.00;
	IncY = 0.2;
	
	Startingx = 65+originallengths[springnumber];
	xpos = Startingx;
	Startingy = 250;
	elapsedtime = 0;
	pixelmovement = 0;
	SlopeForce = 64;
	WidthOfSpring = 10;
	Force = 0;
	
	ForceProbeHalfWidth = 35;
	ForceProbeHalfHeight = 52.5;
	fphooksize = 10;
	ForceProbeCurve = 4;

//* Initial Conditions */	
		
}
/* Called by the Begin Button */

function LoadIt(){
	drawingpart();
}

function StartIt(){

	d = new Date();
	starttime = d.getTime();
	
	Running = "Yes";
	Reset = "No";
	
	MaxStretchFactor = (Math.random() * 2.65) + 1.05;
	
	MaxForce = MaxStretchFactor*originallengths[springnumber]*springconstants[springnumber]/1000;
	
	Ended = "No";
	i = 0;
	while (Ended == "No"){
		if ((MaxForce+0.5) < TopForceOnGraph[i]){
			Ended = "Yes";
		}
		else{
			i++;
		}
	}
	YType = i;
	
	TimeToFullForce = Math.pow(MaxStretchFactor*originallengths[springnumber]/StretchSpeed[springnumber], 2.0)+3.0;
	
	Ended = "No";
	i = 0;
	while (Ended == "No"){
		if ((TimeToFullForce) < MaxTimesGraph[i]){
			Ended = "Yes";
		}
		else{
			i++;
		}
	}
	XType = i;
	StartItMoving = setInterval(drawingpart, 20);
}


function EndTrial(){

	Force = 0;
	Running = "No";
	
	clearInterval(StartItMoving);
	
	xpos = MaxStretchFactor*originallengths[springnumber]+Startingx;
	
	
	drawingpart();
    restartautomatic();


}

function drawingpart(){
	if (Running == "Yes"){
		d = new Date();
		nowtime = d.getTime();
		elapsedtime = (nowtime-starttime)/1000;
		timeinms = nowtime-starttime;
		
		xpos = Startingx + StretchSpeed[springnumber]*Math.pow(elapsedtime, 0.5);
		
		if (xpos > (MaxStretchFactor*originallengths[springnumber]+Startingx)){
			xpos = MaxStretchFactor*originallengths[springnumber]+Startingx;
		}
		
		ActualForce = springconstants[springnumber]*(xpos - Startingx)/1000;
		RandomError=Math.floor(Math.random()*100)/2000;
		DirectionOfError = Math.random()*2;
		if (DirectionOfError > 1){
			DOE = 1;
		}
		else{
			DOE = -1;
		}
		Force = (1 + DOE*RandomError)*ActualForce;
		
		if (ActualForce > 10){
			Force = 10;
		}
		
		forcepixelmovement = Force*FYSpace[YType]/IncFY[YType];

        if (xpos === MaxStretchFactor*originallengths[springnumber]+Startingx){
            datathisiteration.push(Force)
			
        }		
		if ((elapsedtime < MaxTimesGraph[XType])&&(datathisiteration.length<96)){}
		else{
            datacollected.push([xpos,datathisiteration]);
            console.log('data from iteration'+checkcontinue/*+datathisiteration*/)
            datathisiteration = [];
			EndTrial();
		}
	}
	if (xpos > 800){
		EndTrial();
	}
}


//I added this to do 10 'runs' (changes spring length) each time the code is executed
function restartautomatic(){
    if(checkcontinue>0){checkcontinue = (checkcontinue-1); setInterval(()=>StartIt(), 10000)}
    else{
		//when its done it puts the data in a JSON file used by the graphing program
        var JSONstuff = JSON.stringify(datacollected)
        fs.writeFile(`./${springnumber}springdata.json`, JSONstuff, 'utf8', (err)=> {
            if (err) {return console.log(err);}
            console.log("logdata saved!");
            writing = false
        });

    }
}


initialize();
LoadIt();
StartIt();