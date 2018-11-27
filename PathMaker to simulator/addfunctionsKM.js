function back(){
    var firstSettingDiv = document.getElementById('firstSettingDiv');
    var secondSettingDiv = document.getElementById('secondSettingDiv');
    var buttonPanelDiv = document.getElementById('buttonPanelDiv');

    if(document.forms.onsubmit == secondNextPushed){
    	firstSettingDiv.style.visibility = "visible";
	    secondSettingDiv.style.visibility = "hidden";

	    //Divの並び替え
	    firstSettingDiv.parentNode.insertBefore(firstSettingDiv,secondSettingDiv);
	    firstSettingDiv.parentNode.insertBefore(buttonPanelDiv,secondSettingDiv);

		document.forms.onsubmit = firstNextPushed;
		document.forms.backButton.disabled = true;
		document.getElementById('btnMsg').innerHTML = '(Bead types, Word)';
	}
}

var secondSettings = function (arity, delay) {

    var fm = document.forms;
    var firstSettingDiv = document.getElementById('firstSettingDiv');
    var secondSettingDiv = document.getElementById('secondSettingDiv');
    var buttonPanelDiv = document.getElementById('buttonPanelDiv');
    var beadTypes = fm.beadTypes;
    var indexEqualBeadtype = fm.indexEqualBeadtype;
    var word = fm.word;
    var wordLen = fm.wordLength.value

    //firstを隠して、divを並び替える(2→ボタン→1)
    firstSettingDiv.style.visibility = "hidden";
    firstSettingDiv.parentNode.insertBefore(secondSettingDiv,firstSettingDiv);
    firstSettingDiv.parentNode.insertBefore(buttonPanelDiv,firstSettingDiv);

    //firstの入力要素表示

    document.getElementById("secArityV").innerHTML=arity;
    document.getElementById("secDelayV").innerHTML=delay;
    document.getElementById("secWordLengthV").innerHTML=wordLen;

    //backbuttonを使えるように
    document.forms.backButton.disabled = false;

    // SecondSettingDiv を可視化.
    // checkされていたら, 自動的に(beadtypes, wordの)内容を反映する
    if (  indexEqualBeadtype.checked  ) {
	// beadTypes.disabled = true;
	word.disabled = true;
	// beadTypes.value = wordLen;

	OSVars.mode.indexEqualBeadtype = true;
    }else{
    	word.disabled = false;
    	OSVars.mode.indexEqualBeadtype = false;
    }
    secondSettingDiv.style.visibility = "visible";
    secondSettingDiv.style.backgroundColor = "lightblue";

    var nextBtnMsgDiv = document.getElementById('btnMsg');
    nextBtnMsgDiv.innerHTML = '(Seed)';

    fm.onsubmit = secondNextPushed;
    return false;
};
