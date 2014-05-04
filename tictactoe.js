/*
	Author: Roxanne Calderon
	Date: 4.30.2014
	Purpose: This is the javascript functionality for Tic Tac Toad. This provide the AI, 
			 the button changes, and the noises.
			 
	** Sounds Credit To: soundbible.com 
       Font Credit: dafont.com "From Cartoon Blocks" 


*/ 

/* this monitors if the square is filled (squareUsed) and which animal is inside it.  */
var squareUsed = new Array();
var filledBy = new Array();
/* categorizes all the possible ways to win  */
var winPossible =  [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]]; 
/* when toad flag is raised, we know that the toad AI has to select something special. 
else it will be random*/
var toadFlag = false; 
/* is there a winner? */
var winner = false; 
/* helps with timing and to ensure that you don't double click frogs before toads go*/
var frogAgain = true; 
/* starts set up things*/
var notFirstTime = false;
/* should we give the option to reload the page? */
var reloading = false; 
/* keeps the toad AI from going all crazy and recusing forever.*/
var aiAgain = true; 
/* special toad choice*/
var toadGo; 
/* counts how many squares used*/
var fillerCount = 0; 
/* from soundbible.com : "Winning Triumphal Fanfare and "Sad Trombone" */
var win = new Audio("fanfare.mp3");
var lose = new Audio("losernoise.mp3"); 


/* sometimes the splash sound would lag if clicked to soon. This just keeps
	it reloading. */
 function splashSound(){
       var splash = new Audio("watersplash2.mp3");
		splash.play(); 
}

/* for first time. sets up squareUsed and filledBy as false and empty. */
function generateUsed()
{ 
    for(var i = 1; i < 10; i++)
		squareUsed[i] = false; 
		
	 for(var i = 1; i < 10; i++)
		filledBy[i] = "empty"; 
} 

/* what occurs with frog click (from HTML) */
function frogClick(number)
{
	/* on first click it generates the needed "empty" arrays */
    if(!notFirstTime)
	 {
		notFirstTime = true;
		generateUsed(); 
	 } 

	 /* ensure squares are not doubleclicked (not written over)
		and if frog can be clicked without stealing toad's turn */
	 if((!squareUsed[number]) && frogAgain)
	 {
		/* jQuery didn't like i notation, so  I went for getElementById
		   this  will change the lilypads to the frogs.*/
		for(var i = 1; i < 10; i++)
		{ 
			if(i == number) 
			{
				/* change frogs and not it in the array */
				document.getElementById(i).src = "frogtest.png";
				assignUsed(number, "frog") 
				
				/* is this the winninig frogs? have all the spots been used? */
				winCheck(); 			
				drawCheck(); 	
 
				/* doesn't allow any more frog clicks */
				frogAgain = false; 
				
				/* calls toadTime (toad Generating function)*/
				if(!winner)
				{
					/* pause so the toads don't come instantly */
					window.setTimeout("toadTime()", 550);
					splashSound(); 
				}
			}
		}
	} 
} 

/* basic toad generator the AI is in another function.*/
function toadTime()
{
	var toads; 

	/* puts a cap on AI to ensure we don't keep calling it to no avail */
    if(aiAgain)
		toadAI(); 
	
	/* 
	 i am in love with if statements. my second check. toad flag comes from AI, and indicates there is a proper move for it to make
	*/
	if(toadFlag)
	{
			toads = toadGo; 		
			toadFlag = false;
	} 
	
	/* the way I always won tic tac toe as a kid was going two opposite corners, then the middle corners. 
	Middle piece with this AI thwarts this as ultimately the second piece will be in somewhere that needs to be
	blocked. 
	*/
    else if ((filledBy[5] == "empty") && (squareUsed[1] || squareUsed[7] || squareUsed[3] || squareUsed[9]))
		toads = 5;
 	
	/* if the AI doesn't indicate anything urgent, it chooses this method.*/
	else	
		toads = Math.ceil((Math.random()*9));
	 
	 /*
		eternal if-else continues. this just checks if the square the toads want is taken. 
	 
	 */
	 if (!squareUsed[toads])
	 {
		/*like above, this just uses the element's id and a loop to generate a picture */
		for(var i = 1; i < 10; i++)
		{
			aiAgain = true; 
			toadFlag = false; 
			
			if(i == toads)
			{
				document.getElementById(i).src = "toadtest.png";
				assignUsed(toads, "toad");
				winCheck();	
			}
		} 
	}	
	
	/*calls toad time again because the toads chose poorly */
	else 
	{
		aiAgain = false; 
		toadTime(); 
	}
	
} 

/* this sets the numbers to used, and assigns what number is in the area.*/
function assignUsed(number, animal)
{
         squareUsed[number] = true; 
		  filledBy[number] = animal;
		  fillerCount++; 

} 

/* this checks if any one row (from winPossible) has been filled */
function winCheck()
{  
	for(var i = 0; i < 8; i++)
	{					
			/* i found creating variables more accurate for comparisons that rifling through a for loop
				and easier to read */
			var check1 = winPossible[i][0]; 
			var check2 = winPossible[i][1];
			var check3 = winPossible[i][2]; 
			
			/*checks to see if all three in a row are the same*/
			if((filledBy[check1] == filledBy[check2]) && (filledBy[check1] == filledBy[check3]))
			{
				/*calls win function // pauses for music*/
				if(filledBy[check1] == "frog")
				{	
					win.play(); 
					winner = true; 
					window.setTimeout("winImage()", 1000);
					break; 
				}
				
				/* calls lose fucntions, pauses again for music */
				else if(filledBy[check1] == "toad")
				{
					lose.play(); 
					window.setTimeout("loseImage()", 1000);
					frogAgain = false; 
					break; 
				}				
			}	 
			
			/*if no winner indicated, we continue to play */ 
			else
				frogAgain = true; 
	}


}

/* i wasn't quite sure how smart/random to make the AI. i could also mix things up by making choose AI only 50% of
	the time, but that would make it too easy to win. Now most of my games result in a tie.*/
function toadAI()
{	
    /* the function itself is very similiar to winCheck */
	for(var i = 0; i < 8; i++)
	{		
			/* creates identical variables */
			var check1 = winPossible[i][0]; 
			var check2 = winPossible[i][1];
			var check3 = winPossible[i][2]; 
			
			/* there were several shorter ways I could implement this, such as passing in variables
				However, I chose six separate if-else statement functions  toads go first because
				if there is an opportunity for toads to win, it needs to be taken */
		
		    /* for all functions, it compares two of the three, if two are equal, then it checks if the
                third is empty, it will return that value to be used.*/
			if((filledBy[check1] == filledBy[check2]) && (filledBy[check1] == "toad"))
			{
				if(filledBy[check3] == "empty")
				{
					toadGo = check3; 
					toadFlag = true; 
					break; 
				}
			}
			
			else if ((filledBy[check1] == filledBy[check3]) && (filledBy[check1] == "toad")) 
			{	
				if(filledBy[check2] == "empty")
				{
					toadGo = check2; 
				    toadFlag =  true;  
					break; 
				}
			}
			
			else if((filledBy[check2] == filledBy[check3]) && (filledBy[check2] == "toad"))
			{		
				if(filledBy[check1] == "empty")
				{
					toadGo = check1; 
					toadFlag =  true;   
					break; 
				}
			}
			
			else if((filledBy[check1] == filledBy[check2]) && (filledBy[check1] == "frog"))
			{			
				if(filledBy[check3] == "empty")
				{
				   toadGo = check3; 
				   toadFlag =  true; 
				  break; 
				}
			}
			
			else if ((filledBy[check1] == filledBy[check3]) && (filledBy[check1] == "frog")) 
			{	
				if(filledBy[check2] == "empty")
				{
					toadGo = check2; 
					toadFlag = true;  
					break; 
				}	
			}
			else if((filledBy[check2] == filledBy[check3]) && (filledBy[check2] == "frog"))
			{	
				if(filledBy[check1] == "empty")
				{		
				   toadGo = check1; 
				   toadFlag = true; 
				   break; 
				}
			} 
			else
				toadFlag = false; 
	} 
} 

/* tiny function to check to see if all the spaces are full. There is no sound for this guy.  */
function drawCheck()
{
	if((fillerCount == 9) && !winner)
	{
		window.setTimeout("drawImage()", 1000);

	}
} 

/* calls up win image, and lets again be pressed to reload the page. */
function winImage()
{
	document.getElementById(10).src = "http://i.imgur.com/vpyM0Xk.png"
	document.getElementById(11).src = "again.png";
	reloading = true; 
} 

/* calls up lose image, and lets again be pressed to reload the page. */
function loseImage()
{
	document.getElementById(10).src = "http://i.imgur.com/7HfhWNb.png";
	document.getElementById(11).src = "again.png";
	reloading = true; 
} 

/* calls up draw image, and lets again be pressed to reload the page. */
function drawImage()
{
	document.getElementById(10).src = "itsatie.png";
	document.getElementById(11).src = "again.png";
	reloading = true; 
} 

/* allows user to reload the page. */
function timeToReload()
{
	if(reloading)
		location.reload(); 
} 
