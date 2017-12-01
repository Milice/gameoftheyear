var trees = [];
var points = 0;

function updatePoints(amount) {
	points += amount;
	document.getElementById("treepoints").innerHTML = points;
}

function generateTrees() {
	var gameWindow = document.getElementById("game");
	var posInfo = gameWindow.getBoundingClientRect();

	var gameHeight = posInfo.height;
	var gameWidth = posInfo.width;

	var gamePosLeft = posInfo.left;
	var gamePosTop = posInfo.top;

	var spriteHeight = 64;
	var spriteWidth = 64;

	var maxLeft = gameWidth - spriteWidth;
	var maxTop = gameHeight - spriteHeight;

	var tmpStr = "";

	for(var i = 0; i < Math.floor(Math.random() * 10) + 4; i++) {
		var posLeft = (Math.floor(Math.random() * maxLeft)) + gamePosLeft;
		var posTop = (Math.floor(Math.random() * maxTop)) + gamePosTop;

		var treeCount = trees.length;
		var tree = [posLeft, posTop, "tree"+treeCount];
		trees[treeCount] = tree;

		tmpStr = tmpStr + '<img id="tree' + treeCount + '" src="sprites/tree.png" style="position: absolute; left: ' + posLeft + 'px; top: ' + posTop + 'px"/>';
	}

	gameWindow.innerHTML = tmpStr;
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

function spawnCharacter() {
	var gameWindow = document.getElementById("game");
	var posInfo = gameWindow.getBoundingClientRect();

	gameWindow.innerHTML = gameWindow.innerHTML + '<div id="character" style="background: #FFF; height: 32px; width: 32px; position: absolute; left: ' + (posInfo.left + (posInfo.width / 2) - 16) + 'px; top: ' + (posInfo.top + (posInfo.height / 2) - 16) + 'px;"></span>';
}

$(document).keydown(function(event) {
	var keyRight = 39;
	var keyLeft = 37;
	var keyUp = 38;
	var keyDown = 40;
	var keySpace = 32;

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
			if(tree) {
				var currentTree = document.getElementById(tree);
				currentTree.remove();
				updatePoints(1);
			}
		break;
	}
});