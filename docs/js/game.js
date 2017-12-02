var trees = [];
var treesBuilt = 0;
var points = 0;

var gameWindow = null;

var gameHeight = 0;
var gameWidth = 0;

var gamePosLeft = 0;
var gamePosTop = 0;

var spriteHeightTree = 64;
var spriteWidthTree = 64;

var maxLeft = 0;
var maxTop = 0;

function updatePoints(amount) {
	var oldPoints = points;
	points += amount;
	document.getElementById("treepoints").innerHTML = points;
	if(oldPoints < 25 && points >= 25) {
		alert("You have collected enough wood!\nPress B to build a ship.");
	}
}

function treeOverlapLeft(pos, size, currentTree) {
	var oldStart = trees[currentTree][0];
	var oldEnd = oldStart + size;

	var newStart = pos;
	var newEnd = pos + size;

	if( (newStart <= oldEnd && newEnd >= oldEnd) || (newStart <= oldStart && newEnd >= oldStart) ) {
		return true;
	}

	return false;
}

function treeOverlapTop(pos, size, currentTree) {
	var oldStart = trees[currentTree][1];
	var oldEnd = oldStart + size;

	var newStart = pos;
	var newEnd = pos + size;

	if( (newStart <= oldEnd && newEnd >= oldEnd) || (newStart <= oldStart && newEnd >= oldStart) ) {
		return true;
	}

	return false;
}

function isTreeOverlapping(posTop, posLeft, width, height) {
	for(var i = 0; i < trees.length; i++) {
		if(treeOverlapTop(posTop, height, i) && treeOverlapLeft(posLeft, width, i)) {
			return true;
		}
	}

	return false;
}

function generateTreePos(width, height) {
	var positions = [];

	var posLeft = (Math.floor(Math.random() * maxLeft)) + gamePosLeft;
	var posTop = (Math.floor(Math.random() * maxTop)) + gamePosTop;

	while(isTreeOverlapping(posTop, posLeft, width, height)) {
		posLeft = (Math.floor(Math.random() * maxLeft)) + gamePosLeft;
		posTop = (Math.floor(Math.random() * maxTop)) + gamePosTop;
	}

	positions[0] = posLeft;
	positions[1] = posTop;

	return positions;
}

function generateTree() {
	var treePos = generateTreePos(spriteWidthTree, spriteHeightTree);
	var posLeft = treePos[0];
	var posTop = treePos[1];

	var treeCount = trees.length;
	var tree = [posLeft, posTop, "tree"+treesBuilt];
	trees[treeCount] = tree;

	gameWindow.innerHTML = gameWindow.innerHTML + '<img id="tree' + treesBuilt + '" src="sprites/tree.png" style="z-index: 1; position: absolute; left: ' + posLeft + 'px; top: ' + posTop + 'px"/>';
	treesBuilt++;
}

function generateTrees() {
	gameWindow = document.getElementById("game");
	var posInfo = gameWindow.getBoundingClientRect();

	gameHeight = posInfo.height;
	gameWidth = posInfo.width;

	gamePosLeft = posInfo.left;
	gamePosTop = posInfo.top;

	maxLeft = gameWidth - spriteWidthTree;
	maxTop = gameHeight - spriteHeightTree;


	for(var i = 0; i < Math.floor(Math.random() * 10) + 4; i++) {
		generateTree();
	}
}

function findTree(x, y) {
	for(var i = 0; i < trees.length; i++) {
		var treePosX = trees[i][0];
		var treePosY = trees[i][1];
		var treeName = trees[i][2];
		//alert(treePosX + " - " + treePosY + "\n" + x + " - " + y);
		if((x >= treePosX && x <= treePosX + 64) && (y >= treePosY && y <= treePosY + 64)) {
			return treeName;
		}
	}

	return null;
}

function findTreeIndex(x, y) {
	for(var i = 0; i < trees.length; i++) {
		var treePosX = trees[i][0];
		var treePosY = trees[i][1];
		var treeName = trees[i][2];
		//alert(treePosX + " - " + treePosY + "\n" + x + " - " + y);
		if((x >= treePosX && x <= treePosX + 64) && (y >= treePosY && y <= treePosY + 64)) {
			return i;
		}
	}

	return null;
}

function spawnCharacter() {
	var gameWindow = document.getElementById("game");
	var posInfo = gameWindow.getBoundingClientRect();

	gameWindow.innerHTML = gameWindow.innerHTML + '<div id="character" style="z-index: 2; background: #FFF; height: 32px; width: 32px; position: absolute; left: ' + (posInfo.left + (posInfo.width / 2) - 16) + 'px; top: ' + (posInfo.top + (posInfo.height / 2) - 16) + 'px;"></span>';
}

$(document).keydown(function(event) {
	var keyRight = 39;
	var keyLeft = 37;
	var keyUp = 38;
	var keyDown = 40;
	var keySpace = 32;
	var keyB = 66;

	var character = document.getElementById("character");
	var characterPosLeft = character.style.left;
	var characterPosTop = character.style.top;

	switch(event.which) {
		case keyRight:
			character.style.left = (parseInt(characterPosLeft.replace("px", ""))+3)+'px';
		break;

		case keyLeft:
			character.style.left = (parseInt(characterPosLeft.replace("px", ""))-3)+'px';
		break;

		case keyUp:
			character.style.top = (parseInt(characterPosTop.replace("px", ""))-3)+'px';
		break;

		case keyDown:
			character.style.top = (parseInt(characterPosTop.replace("px", ""))+3)+'px';
		break;

		case keySpace:
			var characterPosX = character.style.left;
			var characterPosY = character.style.top;
			var tree = findTree(parseInt(characterPosX.replace("px", "")), parseInt(characterPosY.replace("px", "")));
			var treeIndex = findTreeIndex(parseInt(characterPosX.replace("px", "")), parseInt(characterPosY.replace("px", "")));
			if(tree && treeIndex != null) {
				var currentTree = document.getElementById(tree);
				currentTree.remove();
				trees.splice(treeIndex, 1);
				updatePoints(1);
				setTimeout(generateTree, 2500);
			}
		break;

		case keyB:
			if(points >= 25) {
				alert("You have built a boat!");
				updatePoints(-25);
			} else {
				alert("You need 25 wood to build a boat!");
			}
		break;
	}
});