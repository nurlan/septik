var vowels = ['а','ә','е','и','о','ө','ұ','ү','1','ы','і','э','ю','я'];			// дауысты дыбыстар

var solidVowels = ['а','о','ұ','ы','1','я'];										// Жуан дауысты дыбыстар
var softVowels = ['ә','ө','ү','і','е','и','1','э'];								// Жіңішке дауысты дыбыстар
var labialVowels = ['о', 'ө', 'ұ', 'ү', '1','0'];


// дауыссыз дыбыстар
var consonants = ['б', 'в', 'г', 'ғ', 'д', 'ж', 'з', 'й', 'к', 'қ', 'л', 'м', 'н', 'ң', 'п', 'р', 'с', 'т', '0', 'ф', 'х', 'һ', 'ц', 'ч', 'ш', 'щ']; 															

var voiced = ['б','в','г','ғ','д','ж','з','һ']; 								// Ұяң дауыссыз дыбыстар
var resonant = ['й', 'л', 'м', 'н', 'ң', 'р', '0']; 							// Үнді дауыссыз дыбыстар
var unvoiced = ['к', 'қ', 'п', 'с', 'т', 'ф', 'х', 'ч', 'ц', 'ш', 'щ']; 		// Қатаң дауыссыз дыбыстар

var exceptedPronouns = new Array();
exceptedPronouns['мен'] = ['мен','менің','маған','мені','менде','менен','менімен'];
exceptedPronouns['сен'] = ['сен','сенің','саған','сені','сенде','сенен','сенімен'];
exceptedPronouns['ол'] = ['ол','оның','оған','оны','онда','онан','онымен'];
//exceptedPronouns['өз'] = ['ол','оның','оған','оны','онда','онан','онымен'];

/*
 *[дауыссыз дыбыстар => [Ұяң,Үнді,Қатаң],
 * дауысты дыбыстар => [Жуан,Жіңішке]]
 */
var letterMap = [
	[
		['б','в','г','ғ','д','ж','з','һ'],
		['й', 'л', 'м', 'н', 'ң', 'р', '0'],
		['к', 'қ', 'п', 'с', 'т', 'ф', 'х', 'ч', 'ц', 'ш', 'щ']
	],
	[
		['а','о','ұ','ы','1'],
		['ә','ө','ү','і','е','и','1','э']
	]
];

var gCases = [
	[[],[]],
	[['дың','ның','тың'],['дің','нің','тің']],
	[['ға',undefined,'қа'],['ге',undefined,'ке']],
	[['ды','ны','ты'],['ді','ні','ті']],
	[['да',undefined,'та'],['де',undefined,'те']],
	[['дан','нан','тан'],['ден','нен','тен']],
	[['бен','мен','пен'],['бен','мен','пен']]
];

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function getYindex(word) {
	var indexArray = new Array();

	for(var i = 0; i < word.length; i++) {
		if(word.charAt(i) == 'у') {
			indexArray.push(i);
		}
	}

	return indexArray;
}

function getVowelArray(word) {
	var vowelArray = new Array(word.length);

	for(var i = 0; i < word.length; i++) {
		vowelArray[i] = 0;
		for(var j = 0; j < vowels.length; j++) {
			if(word.charAt(i) == vowels[j]) {
				vowelArray[i] = 1;
				break;
			}
		}
	}

	return vowelArray;
}


function yReplacement(word) {
	if ( word.length != 0 ) {

		var indexList = getYindex(word);
		var vowelArray = getVowelArray(word);

		if(indexList.length != 0) {

			for(var ii = 0; ii < indexList.length; ii++) {
				var i = indexList[ii];
				// y is 1st and word length 0
				if( i == 0 && word.length == 1 ) {
					word = word.replace("у", "1");
				}
				// y is 1st and before vowel
				else if( i == 0 && vowelArray[i+1] == 1 ) {
					word = word.replace("у", "0");
				}
				// y is 1st and before consonant
				else if( i == 0 && vowelArray[i+1] != 1 ) {
					word = word.replace("у", "1");
				}
				// y is last and before y vowel
				else if( i == (word.length - 1) && vowelArray[i-1] == 1 ) {
					word = word.replace("у", "0");
				}
				// y is last and before y consonant
				else if( i == (word.length - 1) && vowelArray[i-1] != 1 ) {
					word = word.replace("у", "1");
				}
				// y is between vowels
				else if( vowelArray[i-1] == 1 && vowelArray[i+1] == 1 ) { //уағда
					word = word.replace("у", "0");
				}
				// y is between consonant
				else if( vowelArray[i-1] != 1 && vowelArray[i+1] != 1 ) {
					word = word.replace("у", "1");
				}
				// y is after vowel and before consonant
				else if( vowelArray[i-1] == 1 && vowelArray[i+1] != 1 ) {
					word = word.replace("у", "0");
				}
				// y is after consonant and before vowel
				else if( vowelArray[i-1] != 1 && vowelArray[i+1] == 1 ) {
					word = word.replace("у", "1");
				}
				else {
					console.log("yReplacement exception with word: "+word);
				}
			}
		}
	}
	return word;
}


function divideBySyllables(word) {
	
	var syllableArray = new Array();
	
	while (word.length != 0) {
		var vowelArray = getVowelArray(word);

		// word length == 1
		if(word.length == 1) {
			syllableArray.push(word);
		}
		// word length == 2 and 10 then 1 chunk
		else if(word.length == 2 && vowelArray[0] == 1 && vowelArray[1] != 1) {
			syllableArray.push(word);
		}
		// word length == 2 and 01 then 1 chunk
		else if(word.length == 2 && vowelArray[0] != 1 && vowelArray[1] == 1) {
			syllableArray.push(word);
		}
		// word length == 3 and 100 then 1 chunk
		else if(word.length == 3 && vowelArray[0] == 1 && vowelArray[1] != 1 && vowelArray[2] != 1) {
			syllableArray.push(word);
		}
		// word length == 3 and 010 then 1 chunk
		else if(word.length == 3 && vowelArray[0] != 1 && vowelArray[1] == 1 && vowelArray[2] != 1) {
			syllableArray.push(word);
		}
		// word length == 4 and 0100 then 1 chunk //қойы
		else if(word.length == 4 && vowelArray[0] != 1 && vowelArray[1] == 1 && vowelArray[2] != 1 && vowelArray[3] != 1) {
			syllableArray.push(word);
		}


		// 11        then 1
		else if( vowelArray[0] == 1 && vowelArray[1] == 1 ) {
			syllableArray.push(word.substring(0,1));
		}
		// 011       then 01
		else if( vowelArray[0] != 1 && vowelArray[1] == 1 && vowelArray[2] == 1) {
			syllableArray.push(word.substring(0,2));
		}

		// ...101... then 1
		else if( vowelArray[0] == 1 && vowelArray[1] != 1 && vowelArray[2] == 1) {
			syllableArray.push(word.substring(0,1));
		}
		// ...1000... then 10 //өйткені
		else if( vowelArray[0] == 1 && vowelArray[1] != 1 && vowelArray[2] != 1 && vowelArray[3] != 1) {
			syllableArray.push(word.substring(0,3));
		}
		// ...100... then 10
		else if( vowelArray[0] == 1 && vowelArray[1] != 1 && vowelArray[2] != 1) {
			syllableArray.push(word.substring(0,2));
		}
		// ...001... then 001
		else if( vowelArray[0] != 1 && vowelArray[1] != 1 && vowelArray[2] == 1) {
			syllableArray.push(word.substring(0,3));
		}
		// ...0101.. then 01
		else if( vowelArray[0] != 1 && vowelArray[1] == 1 && vowelArray[2] != 1 && vowelArray[3] == 1) {
			syllableArray.push(word.substring(0,2));
		}
		// ...01001.. then 010
		else if( vowelArray[0] != 1 && vowelArray[1] == 1 && vowelArray[2] != 1 && vowelArray[3] != 1 && vowelArray[4] == 1) {
			syllableArray.push(word.substring(0,3));
		}
		// ...01000.. then 0100
		else if( vowelArray[0] != 1 && vowelArray[1] == 1 && vowelArray[2] != 1 && vowelArray[3] != 1 && vowelArray[4] == 0) {
			syllableArray.push(word.substring(0,4));
		}
		else {
			console.log('divideBySyllables exception with word: '+word);
		}

		word = word.substring(syllableArray[syllableArray.length-1].length);
	}

	return syllableArray;
}

function isSoftVowel(syllableArray) {
	var softVowelArray = [];
	var isLastSyllableY = false;
	var result = false;
	
	for (var j = 0; j < syllableArray.length; j++) {
		for(var i = 0; i < letterMap[1][1].length; i++) {
			if(syllableArray[j].indexOf(letterMap[1][1][i]) >= 0) {
				softVowelArray.push(1);
				
				if(syllableArray.length-1 == j && letterMap[1][1][i] == '1')
					isLastSyllableY = true;

				break;
			}
			if(i == letterMap[1][1].length-1) {
				softVowelArray.push(0);
			}
		}
	}

	if(isLastSyllableY) {
		if(syllableArray.length == 1) {
			result = false;
		}
		else if(softVowelArray[softVowelArray.length-2] == 1 ) {
			result = true;
		}
		else {
			result = false;
		}
	}
	else {
		if(softVowelArray[softVowelArray.length-1] == 1)
			result = true;
		else
			result = false;
	}

	//console.log(softVowelArray);
	//console.log(result);
	return result;
}

function isContainsLabialVowels(syllable) {
	//console.log(syllable);
	if(syllable != undefined) {
		for (var i = 0; i < syllable.length; i++) {
			if( labialVowels.indexOf(syllable.charAt(i)) >= 0){
				//console.log(labialVowels.indexOf(syllable.charAt(i)));
				return true;
			}
		}
	}
	return false;
}

function defineLetterType(voicedInsteadResonant, letter) {
	var indexArrayToLetterMap = [];
	var stop = false;
	for (var i = 0; i < letterMap.length; i++) {
		for (var j = 0; j < letterMap[i].length; j++) {
			for (var k = 0; k < letterMap[i][j].length; k++) {
				if(letter == letterMap[i][j][k]){
					indexArrayToLetterMap.push(i);
					if( (i == 1 && letter != '1') || letter == '1')
						indexArrayToLetterMap.push(1);
					else if(voicedInsteadResonant && j == 1) {
						indexArrayToLetterMap.push(0);
					}
					else
						indexArrayToLetterMap.push(j);

					stop = true;
					break;
				}
			}
			if(stop)
				break;
		}
		if(stop)
			break;
	}
	
	return indexArrayToLetterMap;
}

function septe(caseIndex, org_word) {
	var word = org_word.toLowerCase();
	console.log(word);
	if(exceptedPronouns[word] != undefined || exceptedPronouns[word] == "") {
		return exceptedPronouns[word][caseIndex].capitalize();
	}
	else if(word != undefined || word.length > 0) {
		var syllableArray = divideBySyllables(yReplacement(word));
		var lastSyllable = syllableArray[syllableArray.length-1];
		var indexesArray = [(isSoftVowel(syllableArray)?1:0)];
		
		//console.log(lastSyllable);


		var isContainsLabialVowelsVar = false;
		if(caseIndex != 6){
			isContainsLabialVowelsVar = isContainsLabialVowels(lastSyllable);
		}

		indexesArray = indexesArray.concat(defineLetterType(isContainsLabialVowelsVar,lastSyllable.charAt(lastSyllable.length-1)));
		var ending = gCases[caseIndex][indexesArray[0]][indexesArray[2]];
		
		if(	ending == undefined ) {
			ending = gCases[caseIndex][indexesArray[0]][0];
		}
			
		return (org_word+ending).capitalize();
	}
	return org_word;
}

function all_septe(word) {
	var result = [];
	result.push(word);

	for (var i = 1; i < 7; i++) {
		result.push(septe(i,word));
	}

	return result;
}

function test() {
	//console.log(divideBySyllables(yReplacement("өйткені")));
	console.log(septe(6,"қой"))
	console.log(septe(6,"қазақ"));
	console.log(septe(6,"асау"));
	console.log(septe(6,"ауа"));
	console.log(septe(6,"асу"));
	console.log(septe(6,"күту"));
	console.log(septe(6,"ау"));
	console.log(septe(6,"нұрлан"));
	console.log(septe(6,"динара"));
	console.log(septe(6,"данияр"));
	console.log(septe(6,"жаз"));
	console.log(septe(6,"мен"));
}