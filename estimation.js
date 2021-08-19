'use strict';

var ques = ['For the average American woman, how many times will her heart beat during her lifetime? (credit: DuPont Company)',
'How many heartbeats are there in a year for the entire world\'s population? (credit: DuPont Company)',
'How many pounds of rice were consumed in the U.S. in the year 2001? (credit: DuPont Company)',
'How many revolutions will a 14-inch radius tire have to make during a crossing of the Continental US? (credit: NJAAPT)',
'How many board game dice does it take to equal the mass of the average human? (credit: NJAAPT)',
'How many hairs are on the average human head (that actually has hair) (credit NJAAPT)',
'How many pennies would it take to make a stack the height of the Empire State Building? (credit andrechek.com)',
'How many gallons of milk is produced in the United States each year? (credit andrechek.com)',
'How many hours of sleep does an average person get in a life time in the U.S.? (credit andrechek.com)',
'What is the world demand for oil in gallons each year? (credit andrechek.com)',
'How many of texts are sent each day from the U.S.? (credit andrechek.com)',
'How many golf balls can fit in a school bus? (credit andrechek.com)',
'What is the total length of all hairs shed by a cat in a month in cm? (credit andrechek.com)',
'How many paper bags are made from 14 million trees? (credit andrechek.com)',
'How many dollar bills would need to be stacked to reach the moon? (credit andrechek.com)',
'How fast does your thumbnail grow in miles per hour? (credit andrechek.com)',
'What is the maximum speed of the garden snail in mph? (credit andrechek.com)',
'In 2004, how many people worldwide died in motor vehicle accidents? (credit andrechek.com)',
'How many Apps have been downloaded from Apple’s iTunes Store? (credit andrechek.com)',
'What is the mass of Mars in iPhone 5s? (credit andrechek.com)',
'How many diapers are thrown out in the U.S. each year? (credit andrechek.com)',
'What percent of the world\'s water is in rivers? (credit andrechek.com)',
'Using a standard pair of 6-face dice, what is the probability of getting a sum of 8 for 88 consecutive rolls of the dice? (credit andrechek.com)',
'What is the population of the world’s 70th most populous nation? (credit andrechek.com)'
]
var ans = [2.4e9,1.8e17,6e9,2e6,1e4,1e5,1e5,2.1e10,2.3e5,1e9,6e9,1e5,1e6,1e10,1e12,1e-9,1e-2,1e6,1e10,1e25,1e10,1e-4,1e-7,1e7]
// random number, n, 1-5. Right answer at location n, n-1 lower choices, 5-n higher choices
const ranPos = () => {
	var n = Math.floor(Math.random() * 5);
	var orders = new Array(5);
	orders[n] = 1;
	for (var i =0; i<orders.length; i++){
		orders[i]=i-n;
	}
	return orders;
};

const getNextQIndex = (usedNums)=>{
	var unusedIndices = [];
	var j = 0;
	for (var i=0; i< ques.length; i++){
		if(j>=usedNums.length || usedNums[j]!=i){
		unusedIndices.push(i)
		j++
	}
	}
	return Math.floor(Math.random() * unusedIndices.length);
};

const start = (say, sendButton) => {
	say("").then(() => {
		sendButton('Do you want a tutorial?', [{title: 'No, start game now', payload: '0-0-X-X-X'},{title: 'Yes', payload: 'X-X-X-X-X'}]);
	});

};

const state = (payload, say, sendButton) => {

	const args = payload.split('-');
	var numWrong= parseInt(args[0]);
	var numCorrect = parseInt(args[1]);
	const prevNumIndex=parseInt(args[2]);
	var usedNums = args[3].split('/');
	const prevAns=parseFloat(args[4]);
	if(!isNaN(usedNums[0])){
		usedNums.map(Number).sort((a,b)=> a-b);
	}
	else{
		usedNums = [];
	}

	if(isNaN(numWrong)){
		var tutorial_str = "Video Tutorial: https://www.youtube.com/watch?v=3O0WbXg6rJo"
		say(tutorial_str).then(()=>{
			sendButton('Start Game?', [{title: 'Yes', payload: '0-0-X-X-X'},{title: 'No'}])
		})

	}
	else if((ans[prevNumIndex]==prevAns && numCorrect< 9) || isNaN(prevNumIndex)){
		var sayStr = "";
	
		if(!isNaN(prevNumIndex)){
			sayStr = "Good job. That was correct! Next question: \n";
			numCorrect++;
		}
		var currQIndex = getNextQIndex(usedNums);
		usedNums.push(currQIndex);

		var margin = Math.floor((10 - numCorrect )/ 3) + 1;

		const payloadStr = numWrong + '-' + numCorrect + '-' + currQIndex + '-' + usedNums.join('/');
		const orders= ranPos().map(num=> num * margin);
		const buttons = orders.map(num=>({title:(ans[currQIndex]*Math.pow(10,num)).toExponential(), payload:payloadStr + '-' + (ans[currQIndex]*Math.pow(10,num))}));

		say(sayStr + 'Question ' + (numCorrect + 1)).then(()=>{
			sendButton(ques[currQIndex], buttons);
		});
	
	}
	else if (ans[prevNumIndex]==prevAns && numCorrect == 9){
			say('🎉 Congratulations! You have answered 10 questions correctly!').then(() => {
				sendButton('Play again?', [
					{title: 'Yes!', payload: 'restart'},
					'No'
				]);
			});
		}
	else{
			numWrong++;
			if(numWrong==3){
				say('You\'ve answer 3 questions wrong! You lose!').then(() => {
					sendButton('The correct answer was ' + ans[prevNumIndex].toExponential() +'\nTry again?', [
						{title: 'Yes!', payload: 'restart'},
						'No'
					]);
				});
			}
			else{
				var currQIndex = prevNumIndex;
				const payloadStr = numWrong + '-' + numCorrect + '-' + currQIndex + '-' + args[3];
				
				var margin = Math.floor((10 - numCorrect)/ 3) + 1;
				const orders= ranPos().map(num=> num * margin);
				const buttons = orders.map(num=>({title:(ans[currQIndex]*Math.pow(10,num)).toExponential(), payload:payloadStr + '-' + (ans[currQIndex]*Math.pow(10,num))}));

				say('Sorry, incorrect! ' +(3 - numWrong) + ' lives remaining. Try again!\n' + 'Question ' + (numCorrect+1)).then(() => {
					sendButton(ques[currQIndex], buttons);
				});
			}
		
		}
	};

module.exports = {
	filename: 'helloworld',
	title: 'Estimation Game',
	introduction: [
		'Estimation Game is based off of Fermi Questions (https://en.wikipedia.org/wiki/Fermi_problem). The goal of the game is to apply physics and logic to approximate the answer to a seemingly impossible question',
		'You will be given 5 choices, select the one that is closest in order of magnitude. You will get 3 lives to answer 10 questions.'
	],
	start: start,
	state: state
};