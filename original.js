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




Message1Text = new Array();
Message1Text[0] = "Spring Number";
Message1Text[1] = "Uimhir an Lingeáin";

Message2Text = new Array();
Message2Text[0] = "Force (N)";
Message2Text[1] = "Fórsa (N)";

Message3Text = new Array();
Message3Text[0] = "Time (s)";
Message3Text[1] = "Am (s)";



/* called by onLoad */

function initialize(){
	Running = "No";
	Reset = "Yes";
	springnumber = Math.floor(Math.random()*6+1);
	
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
	
	SkinTone = "#d99333";
	NailColor = "#1a15ad";
	ShirtColor = "#6a18d9";
	
	SwitchLanguage(languagenumber);
	
		
	
/* Initial Conditions */	
	
//  Sets up the canvas for live action.

	theCanvas = document.getElementById("CanvasOne");
	ctx = theCanvas.getContext("2d");	

	/* Sets up Canvas for Force vs. Time graph */

	twoCanvas = document.getElementById("CanvasTwo");
	ctx2 = twoCanvas.getContext("2d");
		
}



/* Called by the Begin Button */

function LoadIt(){
	document.getElementById("LabSection").style.visibility = "visible";
	document.getElementById("OverviewSection").style.visibility = "hidden";
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
		
	DrawAxes();
	
	StartItMoving = setInterval(drawingpart, 20);

	document.getElementById("ChangeSpring").style.visibility = "hidden";
	document.getElementById("StartButton").style.visibility = "hidden";
	document.getElementById("ResetButton").style.visibility = "visible";
}


function EndTrial(){

	Force = 0;
	Running = "No";
	
	clearInterval(StartItMoving);
	
	xpos = MaxStretchFactor*originallengths[springnumber]+Startingx;
	
	
	drawingpart();


}

function ResetIt(){
	Running = "No";
	xpos = Startingx;
	clearInterval(StartItMoving);
	document.getElementById("ChangeSpring").style.visibility = "visible";
	document.getElementById("StartButton").style.visibility = "visible";
	document.getElementById("ResetButton").style.visibility = "hidden";
	elapsedtime = 0;
	pixelmovement = 0;
	Reset = "Yes";
	ctx2.fillStyle = "#FFFFFF";
	ctx2.fillRect(0,0,950,610);
	drawingpart();
	
}

function drawingpart(){
			
/* 	background drawing */

	ctx.fillStyle="#FFFFFF";
	ctx.fillRect(0,0,925,600);
	
	
	
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

		
		if (elapsedtime < MaxTimesGraph[XType]){
			ctx2.strokeStyle = "#990000";
			ctx2.beginPath();
			ctx2.arc(LeftGrid+(elapsedtime)*XSpace[XType]/IncX[XType],LowGrid-forcepixelmovement, 2, 0, 2*Math.PI);
			ctx2.stroke();
			ctx2.closePath();
			
			
		}
		else{
			EndTrial();
		}
	}
	
	
	
	DrawArm(xpos+570,365);
	DrawForceProbe(xpos+600, 345, ForceProbeHalfWidth, ForceProbeHalfHeight, fphooksize, ForceProbeCurve, Math.PI/2);
	DrawHand(xpos+570,365);
	DrawLabTableTop(-10, 433);
	DrawHalfMeterStick(15,435);
	DrawSpring(xpos,380);
	DrawString(xpos,330+15);
	LabQuestOnOne(720,210,200,200,10, 2);
	WriteSprings();
	
	if (xpos > 800){
		EndTrial();
	}
}

function DrawLabTableTop(x, y){
	
	hs = fphooksize;
	ctx.lineWidth = 5;
	ctx.strokeStyle = "#C0C0C0";
	ctx.beginPath();
	ctx.moveTo(x,y-80);
	ctx.lineTo(x+30,y-80);
	ctx.lineTo(x+40, y-80+hs);
	ctx.arc(x+40,y-80,hs,0.5*Math.PI, 1.5*Math.PI, true);
	ctx.stroke();

	ctx.strokeStyle = "000000";
	ctx.fillStyle="#333333";
	ctx.lineWidth = 4;
	ctx.fillRect(x+0,y-130,20,140);
		
	ctx.fillStyle="#333333";
	ctx.lineWidth = 4;
	ctx.fillRect(x,y,710,25);
	
	ctx.fillStyle="#85bae6";
	ctx.fillRect(x,y+25,690,35);
	ctx.strokeRect(x,y+25,690,35);
	
	ctx.fillStyle="#85bae6";
	ctx.fillRect(x+650,y+60,25,350);
	ctx.strokeRect(x+650,y+60,25,350);
}

function DrawHalfMeterStick(x,y){
	h = 60;
	x0 = 35;
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 1;
	ctx.strokeRect(x,y-h,590,h);
	
	for (i = 0; i < 56; i++){
		ll = 0.75*h;
		if (i % 5 == 0){
			ll = 0.5*h;
			if (i % 10 == 0){
				ctx.font="20px Arial";
				ctx.fillStyle="#990000";
				temptext = i;
				metrics = ctx.measureText(temptext);
				textWidth = metrics.width;
				xposition = x0+i*10 - textWidth/2;
				ctx.fillText(temptext,xposition, y-0.10*h);
			}
		}
		ctx.beginPath();
		ctx.moveTo(x0+i*10, y-h);
		ctx.lineTo(x0+i*10, y-ll);
		ctx.stroke();
	}
	
	ctx.font="20px Arial";
	ctx.fillStyle="#990000";
	temptext = "cm";
	metrics = ctx.measureText(temptext);
	textWidth = metrics.width;
	
	ctx.fillText(temptext,x+550, y-0.25*h);
}

function DrawSpring(xmax, y){
	hs = fphooksize;
	ctx.lineWidth = 5;
	ctx.strokeStyle = "#C0C0C0";
	ctx.beginPath();
	ctx.moveTo(65,y-30);
	ctx.lineTo(55,y-30);
	ctx.lineTo(45, y-30-hs);
	ctx.arc(45,y-30,hs,1.5*Math.PI, 0.5*Math.PI, true);
	ctx.stroke();
	
	ctx.lineWidth = 5;
	ctx.strokeStyle = "#C0C0C0";
	ctx.beginPath();
	ctx.moveTo(65,y-53);
	ctx.lineTo(65,y-7);
	ctx.stroke();
	
	springlength = xmax - 65;
	circlespacing = springlength/numberofloops[springnumber];
	
	ctx.lineWidth = springthickness[springnumber];
	ctx.strokeStyle = "#C0C0C0";
	for (i = 0; i < numberofloops[springnumber]; i++){
		
		ctx.beginPath();
		ctx.moveTo(65+i*circlespacing,y-50);
		ctx.bezierCurveTo(65+(i+1.25*springlength/600)*circlespacing,y-50,65+(i+1.25*springlength/600)*circlespacing,y-10,65+(i+0.5)*circlespacing,y-10);
		ctx.bezierCurveTo(65+(i-0.25*springlength/600)*circlespacing,y-10,65+(i-0.25*springlength/600)*circlespacing,y-50,65+(i+1)*circlespacing,y-50);
		//ctx.lineTo(65+(i+1)*circlespacing,y-50);
		//ctx.lineTo(65+(i+0.5*springlength/600)*circlespacing,y-10);
		ctx.stroke();
		
	}
	
	ctx.lineWidth = 1;
	
	/*
	ctx.beginPath();
	ctx.moveTo(65, y-50);
	ctx.lineTo(xmax, y-50);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(65, y-10);
	ctx.lineTo(xmax, y-10);
	ctx.stroke();
	*/
	
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.moveTo(xmax,y-53);
	ctx.lineTo(xmax,y-7);
	ctx.stroke();
	
	ctx.lineWidth = 5;
	ctx.strokeStyle = "#C0C0C0";
	ctx.beginPath();
	ctx.moveTo(xmax,y-30);
	ctx.lineTo(xmax+10,y-30);
	ctx.lineTo(xmax+20, y-30+hs);
	ctx.arc(xmax+20,y-30,hs,0.5*Math.PI, 1.5*Math.PI, true);
	ctx.stroke();
	ctx.closePath();


}

function DrawString(x,y){
	ctx.lineWidth = 3;
	ctx.strokeStyle = "#fbf152";
	ctx.beginPath();
	ctx.moveTo(x+25,y);
	ctx.lineTo(x+520,y);
	ctx.stroke();
}

function DrawArm(x,y){


	ctx.strokeStyle = "#000000";
	ctx.fillStyle = SkinTone;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x+50,y-50);
	ctx.lineTo(x+50, y);
	ctx.lineTo(x+200, y+20);
	ctx.lineTo(x+200, y-60);
	ctx.lineTo(x+110,y-50);
	ctx.lineTo(x+105,y-50);
	ctx.lineTo(x+25,y-77);
	ctx.lineTo(x+25,y-50);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = ShirtColor;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x+120, y-60);
	ctx.lineTo(x+120, y+30);
	ctx.lineTo(x+200, y+30);
	ctx.lineTo(x+200, y-60);
	ctx.lineTo(x+120, y-60);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	
}


function DrawForceProbe(x, y, hw, hh, hs, c, angrad){

	ctx.save();
	
    ctx.translate(x, y);
  
    ctx.rotate(angrad);
    
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#555555";
	ctx.fillStyle = "#555555";
	ctx.beginPath();
	ctx.moveTo(0-hw+c,0+hh);
	ctx.arc(0-hw+c, 0+hh-c, c, 0.5*Math.PI, 1*Math.PI);
	ctx.lineTo(0-hw,0-hh+c);
	ctx.arc(0-hw+c, 0-hh+c, c, 1*Math.PI, 1.5*Math.PI);
	ctx.lineTo(0+hw-c,0-hh);
	ctx.arc(0+hw-c, 0-hh+c, c, 1.5*Math.PI, 0*Math.PI);
	ctx.lineTo(0+hw,0+hh-c);
	ctx.arc(0+hw-c, 0+hh-c, c, 0*Math.PI, 0.5*Math.PI);
	ctx.lineTo(0-hw+c,0+hh);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	
	/*  Words on Force Probe */
	ctx.font="bold 9px Arial";
	ctx.fillStyle="#FFFFFF";
	ctx.strokeStyle="#000099";
	temptext = "Dual-Range";
	metrics = ctx.measureText(temptext);
	textWidth = metrics.width;
	xposition = 0-0.5*textWidth;
	ctx.fillText(temptext,xposition, 0);
	
	temptext = "Force Sensor";
	metrics = ctx.measureText(temptext);
	textWidth = metrics.width;
	xposition = 0-0.5*textWidth;
	ctx.fillText(temptext,xposition, 0+20);
	
	temptext = "± 50 N";
	metrics = ctx.measureText(temptext);
	textWidth = metrics.width;
	xposition = 0+0.5*hw-0.5*textWidth;
	ctx.fillText(temptext,xposition, 0-20);
	
	temptext = "± 10 N";
	metrics = ctx.measureText(temptext);
	textWidth = metrics.width;
	xposition = 0-0.5*hw-0.5*textWidth;
	ctx.fillText(temptext,xposition, 0-20);
	
	ctx.font="bold 12px Arial";
	temptext = "Vernier";
	metrics = ctx.measureText(temptext);
	textWidth = metrics.width;
	xposition = 0+0.2*hw-0.5*textWidth;
	ctx.fillText(temptext,xposition, 0+50);
	
	/* Circle on Force Probe */
	ctx.fillStyle="#FFFFFF";
	ctx.beginPath();
	ctx.arc(0, 0-0.75*hh, 0.16*hh, 0*Math.PI, 2.0*Math.PI);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	
	ctx.lineWidth = 5;
	ctx.strokeStyle = "#C0C0C0";
	ctx.beginPath();
	ctx.moveTo(0,0+hh);
	ctx.lineTo(0,0+hh+10);
	ctx.lineTo(0+hs, 0+hh+10+hs);
	ctx.arc(0,0+hh+10+hs,hs,0.0*Math.PI, 1*Math.PI);
	ctx.stroke();
		
	ctx.restore();
	
}

function DrawHand(x,y){
	

//  Index finger 

	ctx.strokeStyle = "#000000";
	ctx.fillStyle = SkinTone;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x,y);
	ctx.lineTo(x, y+20);
	ctx.arc(x+10, y+20, 10, Math.PI, 0, true);
	ctx.lineTo(x+20, y);
	ctx.arc(x+10, y, 10, Math.PI, 0);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = NailColor;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x+3,y-4);
	ctx.lineTo(x+3, y+10);
	ctx.arc(x+10, y+10, 7, Math.PI, 0, true);
	ctx.lineTo(x+17, y-4);
	ctx.arc(x+10, y-4, 7, Math.PI, 0);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = "#ffffff";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x+3,y-8);
	ctx.lineTo(x+3, y);
	ctx.arc(x+10, y, 7, Math.PI, 0, false);
	ctx.lineTo(x+17, y-8);
	ctx.arc(x+10, y-8, 7, Math.PI, 0);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	
//  Middle finger 
	offset = 30;
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = SkinTone;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x+offset,y);
	ctx.lineTo(x+offset, y+25);
	ctx.arc(x+offset+10, y+25, 10, Math.PI, 0, true);
	ctx.lineTo(x+offset+20, y);
	ctx.arc(x+offset+10, y, 10, Math.PI, 0);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = NailColor;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x+offset+3,y-4);
	ctx.lineTo(x+offset+3, y+10);
	ctx.arc(x+offset+10, y+10, 7, Math.PI, 0, true);
	ctx.lineTo(x+offset+17, y-4);
	ctx.arc(x+offset+10, y-4, 7, Math.PI, 0);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = "#ffffff";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x+offset+3,y-8);
	ctx.lineTo(x+offset+3, y);
	ctx.arc(x+offset+10, y, 7, Math.PI, 0, false);
	ctx.lineTo(x+offset+17, y-8);
	ctx.arc(x+offset+10, y-8, 7, Math.PI, 0);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	
	//  Ring finger 
	offset = 55;
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = SkinTone;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x+offset,y);
	ctx.lineTo(x+offset, y+22);
	ctx.arc(x+offset+10, y+22, 10, Math.PI, 0, true);
	ctx.lineTo(x+offset+20, y);
	ctx.arc(x+offset+10, y, 10, Math.PI, 0);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = NailColor;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x+offset+3,y-4);
	ctx.lineTo(x+offset+3, y+10);
	ctx.arc(x+offset+10, y+10, 7, Math.PI, 0, true);
	ctx.lineTo(x+offset+17, y-4);
	ctx.arc(x+offset+10, y-4, 7, Math.PI, 0);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = "#ffffff";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x+offset+3,y-8);
	ctx.lineTo(x+offset+3, y);
	ctx.arc(x+offset+10, y, 7, Math.PI, 0, false);
	ctx.lineTo(x+offset+17, y-8);
	ctx.arc(x+offset+10, y-8, 7, Math.PI, 0);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	
	//  Thumb finger 
	offset = 15;
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = SkinTone;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x+offset,y-40);
	ctx.lineTo(x+offset, y-65);
	ctx.arc(x+offset+13, y-65, 13, Math.PI, 0);
	ctx.lineTo(x+offset+26, y-40);
	ctx.arc(x+offset+13, y-40, 13, 0, Math.PI);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = NailColor;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x+offset+3,y-36);
	ctx.lineTo(x+offset+3, y-50);
	ctx.arc(x+offset+13, y-50, 10, Math.PI, 0, false);
	ctx.lineTo(x+offset+23, y-36);
	ctx.arc(x+offset+13, y-36, 10, 0, Math.PI);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = "#ffffff";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x+offset+3,y-32);
	ctx.lineTo(x+offset+3, y-40);
	ctx.arc(x+offset+13, y-40, 10, Math.PI, 0, true);
	ctx.lineTo(x+offset+23, y-32);
	ctx.arc(x+offset+13, y-32, 10, 0, Math.PI);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	
}

function WriteSprings(){
	ctx.font="32px Arial";
	ctx.fillStyle="#000099";
	temptext = SpringNumberText;
	metrics = ctx.measureText(temptext);
	textWidth = metrics.width;
	xposition = 250 - textWidth/2;
	ctx.fillText(temptext,xposition, 50);
	ctx.font="38px Arial";
	temptext = springnumber;
	metrics = ctx.measureText(temptext);
	textWidth = metrics.width;
	xposition = 250 - textWidth/2;
	ctx.fillText(temptext,xposition, 150);
}


function DrawArrow(x, y, h, w, c, r){
	ctx.save();
	ctx.translate(x, y+0.5*h);
	ctx.rotate(r);
	ctx.fillStyle = c;
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(0,-0.5*h);
	ctx.lineTo(0+w, -0.5*h+w);
	ctx.lineTo(0+0.5*w, -0.5*h+w);
	ctx.lineTo(0+0.5*w, -0.5*h+h);
	ctx.lineTo(0-0.5*w, -0.5*h+h);
	ctx.lineTo(0-0.5*w, -0.5*h+w);
	ctx.lineTo(0-w, -0.5*h+w);
	ctx.lineTo(0,-0.5*h);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.restore();
}

function ChangeSpring(){
	springnumber++;
	if (springnumber > 7){
		springnumber = 1;
	}

	drawingpart();
}



function DrawAxes(){
	ctx2.fillStyle = "#FFFFFF";
	ctx2.fillRect(0,0,900,600);
	
	/* Main X and Y */
	ctx2.lineWidth = 3;
	ctx2.strokeStyle = "#000000";
	ctx2.beginPath();
	ctx2.moveTo(LeftGrid,HighGrid);
	ctx2.lineTo(LeftGrid,LowGrid);
	ctx2.lineTo(RightGrid,LowGrid);
	ctx2.stroke();

	
	/* Vertical Lines */
	
	for (i = 0; i < BigLinesX[XType]+1; i++){
		ctx2.lineWidth = 1;
		ctx2.strokeStyle = "#000000";
		ctx2.beginPath();
		ctx2.moveTo(LeftGrid+i*XSpace[XType],HighGrid);
		ctx2.lineTo(LeftGrid+i*XSpace[XType],LowGrid+10);
		ctx2.stroke();
		
		if (i < (BigLinesX[XType])){
			for (j = 0; j<LinesBetweenX[XType]; j++){
				if (j == 5){
					ctx2.lineWidth = 1;
					ctx2.strokeStyle = "#000000";
				}
				else{
					ctx2.lineWidth = 0.5;
					ctx2.strokeStyle = "#999999";
				}
				ctx2.beginPath();
				ctx2.moveTo(LeftGrid+i*XSpace[XType]+j*XSpace[XType]/LinesBetweenX[XType],HighGrid);
				ctx2.lineTo(LeftGrid+i*XSpace[XType]+j*XSpace[XType]/LinesBetweenX[XType],LowGrid);
				ctx2.stroke();
			}
		}
		
		ctx2.font="18px Arial";
		ctx2.fillStyle="#000000";
		temptext = (i*IncX[XType]).toPrecision(2);
		metrics = ctx2.measureText(temptext);
		textWidth = metrics.width;
		xposition = LeftGrid+i*XSpace[XType] - textWidth/2;
		ctx2.fillText(temptext,xposition, LowGrid+30);
		
	}
	
	ctx2.font="28px Arial";
	ctx2.fillStyle="#000000";
	temptext = XAxisText;
	metrics = ctx2.measureText(temptext);
	textWidth = metrics.width;
	xposition = MidX - textWidth/2;
	ctx2.fillText(temptext,xposition, 590);
	
	
	
	
	for (i = 0; i < BigLinesFY[YType]+1; i++){
		ctx2.lineWidth = 1;
		ctx2.strokeStyle = "#000000";
		ctx2.beginPath();
		ctx2.moveTo(LeftGrid-10,HighGrid+i*FYSpace[YType]);
		ctx2.lineTo(RightGrid,HighGrid+i*FYSpace[YType]);
		ctx2.stroke();
		
		if (i < BigLinesFY[YType]){
			for (j = 0; j<LinesBetweenFY[YType]; j++){
				
				if (j == 5){
					ctx2.lineWidth = 1;
					ctx2.strokeStyle = "#000000";
				}
				else{
					ctx2.lineWidth = 0.5;
					ctx2.strokeStyle = "#999999";
				}
				ctx2.beginPath();
				ctx2.moveTo(LeftGrid,HighGrid+i*FYSpace[YType]+j*FYSpace[YType]/LinesBetweenFY[YType]);
				ctx2.lineTo(RightGrid,HighGrid+i*FYSpace[YType]+j*FYSpace[YType]/LinesBetweenFY[YType]);
				ctx2.stroke();
			}
		}
		
		ctx2.font="18px Arial";
		ctx2.fillStyle="#000000";
		temptext = (TopForceOnGraph[YType] - i*IncFY[YType]).toPrecision(2);
		metrics = ctx2.measureText(temptext);
		textWidth = metrics.width;
		xposition = LeftGrid-15 - textWidth;
		ctx2.fillText(temptext,xposition, HighGrid+i*FYSpace[YType]+5);
		
	}
	
	ctx2.font="28px Arial";
	ctx2.fillStyle="#000000";
	temptext = YAxisText;
	metrics = ctx2.measureText(temptext);
	textWidth = metrics.width;
	xposition = 30;
	yposition = MidY + textWidth/2;
	ctx2.save();
	ctx2.translate(xposition, yposition);
	ctx2.rotate(3*Math.PI/2);
	ctx2.fillText(temptext,0,0);
	ctx2.restore();
}


function SwitchLanguage(x){
	languagenumber = x;
	
	translationtext = TRANSLATION_DATA["messages"][x];
		
	for (key in Object.keys(translationtext)){
		translationvalue = decodeURI(translationtext[Object.keys(translationtext)[key]]);
		if (translationvalue){
			if ($("#"+Object.keys(translationtext)[key]).length){
				$("#"+Object.keys(translationtext)[key]).html(translationvalue);
			}
		}
	}
	
	document.title = translationtext['ProgramTitle'];
	document.getElementById("OverviewPicture").src = translationtext['OverviewPicture'];
	
	SpringNumberText = translationtext['SpringNumberText'];
	YAxisText = translationtext['YAxisText'];
	XAxisText = translationtext['XAxisText'];
	

	
	
	
}