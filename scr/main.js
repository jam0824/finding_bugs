
var talkList = [];

var MAX_INPUT_CHAR = 140;
var thumbnailPath = "./data/thumbnail/";

var userInfo = {
	"name" 		: "User A",
	"thumbnail" : "user0.png",
	"follower" 	: ""
};

//バグ用
var sendFlag = false;

//////////////////////////
//初期化
function init(){
	document.getElementById("ID_INPUT_THUMBNAIL").innerHTML =
		'<img src="' + thumbnailPath + userInfo["thumbnail"]+ '">';
	viewReccomend(3);
	
}

//////////////////////////
//画像動画アップロード処理
function upload(){
	document.getElementById("ID_INPUT_PICTURES").innerHTML += '<img src="test.jpg">';
	alert("undefined");
	//バグ
	viewBugEffect("DISABLE_UPLOAD");
}

///////////////////////////
//入力文字数カウント
function countCharacters(){
	var msg = document.getElementById("ID_INPUT_MSG").value;
	var count = MAX_INPUT_CHAR - msg.length;
	var str = "" + count + "/" + MAX_INPUT_CHAR;
	document.getElementById("ID_INPUT_COUNT").innerHTML = str;
	//バグ
	if(sendFlag) viewBugEffect("SEND_CANT_DELETE");

	///// 1/10の確率でボットメッセージを作る
	if(Math.floor( Math.random() * 100) < 10){
		randomBotMessage();
	}
}

///////////////////////////
//メッセージの送信
function sendMessage(){
	var msg = document.getElementById("ID_INPUT_MSG").value;
	checkSendMessage(msg);	//バグ。htmlタグチェック

	//バグ。SQLインジェクションチェック（リストが表示されることにする)
	if(msg.substr(0,4) == "' OR"){
		msg = "";
		for(var i = 0; i < 5; i++){
			msg += botName[i] + "<br>";
		}
		viewBugEffect("SEND_SQL");
	}
	var obj = {
		"id" 			: talkList.length,
		"image" 		: userInfo["thumbnail"],
		"name" 			: userInfo["name"],
		"msg" 			: msg,
		"time" 			: getTime(),
		"like" 			: 0,
		"reply" 		: "",
		"type" 			: "human",
		"deleteFlug" 	: 0,
		"commentFlug" 	: 0
	};

	talkList.unshift(obj);

	//バグ
	if(msg.length > MAX_INPUT_CHAR) viewBugEffect("SEND_MAX_LENGTH_OVER");
	sendFlag = true;
	
	//リスト再描画
	viewArticles(talkList);

}
////////////////////////
//メッセージのチェック
function checkSendMessage(msg){
	//タグチェック
	if(msg.match(/<.*?>/)) viewBugEffect("SEND_TAG");


}

///////////////////////////
//カウンタークリック
function bugCounter(){
	var msg = document.getElementById("ID_INPUT_MSG").value;
	//バグ
	if(msg.length < MAX_INPUT_CHAR) viewBugEffect("SEND_APPER_COUNTER");
}


//////////////////////////
//表示
function viewArticles(messages){
	var data = "";
	

	for(var i = 0; i < messages.length; i++){

		var list = "";
		list += '<div class="listMain">';
		list += '<div class="listThumbnail floatLeft"><img src="' + thumbnailPath + messages[i]["image"] + '"></div>';
		list += '<div class="listMessage floatLeft">';

			list += '<div class="listName fontFrame floatLeft">' + messages[i]["name"] + ' <b onClick="clickListDate()">' + messages[i]["time"] + '</b></div>';
			list += '<div class="listEdit fontFrame floatLeft" onClick="viewEditList(' + messages[i]["id"] + ')">▼</div>';
			list += '<div class="clear"></div>';
			list += '<div class="listEditList" ID="ID_EDIT_LIST' + messages[i]["id"] + '"></div>';
		list += '<div class="listMessageMain">' + messages[i]["msg"] + '</div>';
		list += '</div>';
		list += '<div class="clear"><hr></div>';
		list += '<div class="listFooter">';
			list += '<div class="listLike floatLeft" onClick="clickLike(' + messages[i]["id"] + ')">良いね！' + messages[i]["like"] +　'</div>'; 
			list += '<div class="listReply floatLeft" onClick="viewReplyArea(' + messages[i]["id"] + ')"><img align="middle" src="data/5.png">コメント</div>';
			list += '<div class="clear"></div>';
			list += '<div ID="ID_REPLY_AREA' + messages[i]["id"] + '">' + messages[i]["reply"] + '</div>';
		list += '</div>';
		list += '</div>';

		data += list;

	}
	document.getElementById("ID_DISPLAY_ARTICLES").innerHTML = data;
}

///////////////////////////////////////プロフィール系//////////////////////////////
//プロフィール欄表示（ヘッダから）
function checkName(){
	//バグ
	if(userInfo["name"] != "User A") viewBugEffect("PROFILE_DONT_CHANGE_HEADER");
	viewProfile();
}

//////////////////////////////////
//プロフィール表示
function viewProfile(){
	var html = "";
	html += '<div class="listMain">';
		html += '<div class="floatLeft profileTitle fontFrame">プロフィール</div>';
		html += '<div class="floatLeft profileClose" onClick="closeProfile()"><img src="data/close.png"></div>';
		html += '<div class="clear"></div>';
		html += '<hr>';
		html += '<div class="profileThumbnail floatLeft pointer" onClick="viewThumbnail()"><img src="' + thumbnailPath + userInfo["thumbnail"] + '"></div>';
		html += '<div id="ID_PROFILE_NAME" class="profileName floatLeft pointer"><div onClick="viewNameInput()">' + userInfo["name"] + '</div></div>';
		html += '<div class="clear"></div>';
		html += '<div id="ID_PROFILE_SELECT_THUMBNAIL"></div>';
		html += '<div>' + viewFollower() + '</div>';

	html += '</div>';

	document.getElementById("ID_EDIT_AREA").innerHTML = html;
}

///////////////////////////////////
//名前のinput
function viewNameInput(){
	var html = '<input maxlength="21" type="text" id="ID_PROFILE_NAME_INPUT" onkeyup="countNameCharacters()">';
	html += '<div class="profileNameCount" id="ID_PROFILE_NAME_INPUT_COUNT"></div><br><button onClick="changeName()">変更</button>';

	document.getElementById("ID_PROFILE_NAME").innerHTML = html;
	document.getElementById("ID_PROFILE_NAME_INPUT").value = userInfo["name"];
	countNameCharacters();
}
///////////////////////////
//入力文字数カウント
function countNameCharacters(){
	var msg = document.getElementById("ID_PROFILE_NAME_INPUT").value;
	var str = "" + msg.length + "/" + 20;
	document.getElementById("ID_PROFILE_NAME_INPUT_COUNT").innerHTML = str;
}
///////////////////////////////////
//名前の変更
function changeName(){
	var str = document.getElementById("ID_PROFILE_NAME_INPUT").value;
	userInfo["name"] = str;
	viewProfile();

	//バグ
	if(str.length > 20) viewBugEffect("PROFILE_MAX_LENGTH");
}

////////////////////////////////////
//変更サムネイル表示
function viewThumbnail(){
	var html = "変更するサムネイルを選んでください。<br>";
	for(var i = 0; i < botName.length; i++){
		html += '<div class="floatLeft recommendFollowerList" onClick="changeThumbnail(' + i + ')">';
		html += '<img src="' + thumbnailPath + 'user' + i + '.png">';
		html += '</div>';
	}
	html += '<div class="clear"></div>';
	document.getElementById("ID_PROFILE_SELECT_THUMBNAIL").innerHTML = html;
}
//////////////////////////
//サムネイル変更
function changeThumbnail(id){
	userInfo["thumbnail"] = "user" + id + ".png";
	viewProfile();
}
////////////////////////
//クローズボタン
function closeProfile(){
	init();	//投稿領域の再表示
	document.getElementById("ID_EDIT_AREA").innerHTML = "";
}
///////////////////////
//フォロワー表示
function viewFollower(){
	if(userInfo["follower"] == "") return "";
	var html = "<hr>フォロワー<br>";

	var arrayTmp = userInfo["follower"].split(",");		//フォロワー取得

	for(var i = 0; i < arrayTmp.length; i++){
		var id = arrayTmp[i];

		html += '<div class="floatLeft recommendFollowerList" onClick="deleteFollower(' + id + ')">';
		html += '<img src="' + thumbnailPath + 'user' + id + '.png"><br>';
		html += botName[id];
		html += '</div>';
	}
	html += '<div class="clear"></div>';
	return html;
}

//フォロワー削除
function deleteFollower(id){
	var check = confirm(botName[id] + "のフォローを解除しますか？");
	var arrayTmp = userInfo["follower"].split(",");		//フォロワー取得
	var str = "";

	for(var i = 0; i < arrayTmp.length; i++){
		if(arrayTmp[i] != id){
			str += "" + arrayTmp[i] + ",";
		}
	}
	str = str.slice(0, -1);
	userInfo["follower"] = str;
	viewProfile();
	alert("解除しました。");
	//バグ
	if(!check) viewBugEffect("PROFILE_DELETE_FOLLOWER");
}

///////////////////////////////////////リスト処理系////////////////////////////////
//////////////////////////////
//リスト編集
function viewEditList(id){
	var html = "";
	html = '<div class="pointer" onClick="deleteList(' + id + ')">削除</div>';
	document.getElementById("ID_EDIT_LIST" + id).innerHTML = html;
	var findId = findObjectId(talkList, id);
	//バグ
	if(talkList[findId]["deleteFlug"] == 1){
		viewBugEffect("LIST_DONT_CLOSE_DELETE"); 
	}
	else{
		talkList[findId]["deleteFlug"] = 1;
	}
}

//////////////////////////////
//リスト削除
function deleteList(id){
	var findId = findObjectId(talkList, id);
	//バグ
	if(talkList[findId]["type"] == "bot") viewBugEffect("LIST_DELETE_OTHER"); 
	talkList.splice(findId, 1);
	viewArticles(talkList);
	alert("記事を削除しました。");
}

////////////////////////////
//いいねカウントアップ
function clickLike(id){
	var findId = findObjectId(talkList, id);
	if(talkList[findId]["like"] > 0){
		alert("良いね！は１記事につき１回までです。");
		//バグ
		if(talkList[findId]["like"] > 1) viewBugEffect("LIST_LIKES"); 
	}
	talkList[findId]["like"]++;
	viewArticles(talkList);
}

///////////////////////////
//コメント欄Open
function viewReplyArea(id){
	var html = "";
	html = '<input maxlength="' + MAX_INPUT_CHAR + '" id="ID_REPLY_MAIN' + id + '" type="text"><button class="listReplyButton" onClick="writeReply(' + id + ')">コメントする</button>';
	document.getElementById("ID_REPLY_AREA" + id).innerHTML = html;
	var findId = findObjectId(talkList, id);
	//バグ
	if(talkList[findId]["commentFlug"] == 1){
		viewBugEffect("LIST_DONT_CLOSE_COMMENTS"); 
	}
	else{
		talkList[findId]["commentFlug"] = 1;
	}
}

//////////////////////////
//コメント書き込み
function writeReply(id){
	var html = '<div class="listReplyMessage"><hr><img align="middle" src="' + thumbnailPath + userInfo["thumbnail"] + '">'
	 + userInfo["name"] + " : "
	 + document.getElementById("ID_REPLY_MAIN" + id).value
	 + '</div>';
	var findId = findObjectId(talkList, id);

	//バグ
	if(talkList[findId]["reply"] != "") viewBugEffect("LIST_COMMENTS"); 

	talkList[findId]["reply"] = html;
	viewArticles(talkList);
	

}

////////////////////////
//リストの日付部分クリック
function clickListDate(){
	//バグ
	viewBugEffect("LIST_DATE"); 
}

///////////////////////////////////////////////おすすめユーザー系/////////////////////
/////////////////////////////
//おすすめユーザー表示
function viewReccomend(num){
	var checkRnd = [];
	var html = "";
	for(var i = 0; i < num; i++){
		var rnd = getRandomNum(botName.length);
		html += '<div class="floatLeft recommendFollowerList" onClick="addFollower(' + rnd + ')">';
		html += '<img src="' + thumbnailPath + 'user' + rnd + '.png"><br>';
		html += botName[rnd];
		html += '</div>';
		//バグ
		checkRnd.unshift(rnd);
	}
	html += '<div class="clear"></div>';
	document.getElementById("ID_RECOMMEND_USER").innerHTML = html;
	//バグ
	if(!checkRecommend(checkRnd)) viewBugEffect("RECCOMEND_VIEW_FRIEND"); 
}

function checkRecommend(checkRnd){
	for(var i = 0; i < checkRnd.length; i++){
		for(var j = i + 1; j < checkRnd.length; j++){
			if(checkRnd[i] == checkRnd[j]){
				return false;
			}
		}
	}
	return true;
}

///////////////////////////
//おすすめユーザー追加
function addFollower(id){
	//バグ
	if(!checkFollower(id)) viewBugEffect("RECCOMEND_ADD_FRIEND");

	if(userInfo["follower"] == ""){
		userInfo["follower"] += id;
	}
	else{
		userInfo["follower"] += "," + id;
	}
	alert(botName[id] + "をフォローしました。");
	
	
}

////////////////////////
//フォロワー重複チェック
function checkFollower(id){
	var arrayTmp = userInfo["follower"].split(",");		//フォロワー取得

	for(var i = 0; i < arrayTmp.length; i++){
		if(arrayTmp[i] == id){
			return false;
		}
	}
	return true;
}


////////////////////////////////////////bot系////////////////////////////
////////////////////////////////
//フォロワーの中からランダムでボットデータを作成する
function randomBotMessage(){
	if(userInfo["follower"] == "") return;

	var arrayTmp = userInfo["follower"].split(",");		//フォロワー取得
	var id = arrayTmp[getRandomNum(arrayTmp.length)];
	talkList.unshift(makeBotData(id));	//タイムラインに挿入
	viewArticles(talkList);
}
///////////////////////////
//ボットデータ作成
function makeBotData(botId){
	var rnd = Math.floor( Math.random() * serifuData.length);
	var obj = {
		"id" : talkList.length,
		"image" : 'user' + botId + '.png',
		"name" : botName[botId],
		"msg" : serifuData[rnd],
		"time" : getTime(),
		"like" : 0,
		"reply" : "",
		"type" : "bot",
		"deleteFlug" : 0,
		"commentFlug" : 0
	};
	return obj;
}

////////////////////////////////////////処理系////////////////////////////
///////////////////////
//Objectに記録しているidから配列のidを取得
function findObjectId(messages, id){
	var findId = 0;
	for(var i = 0; i < messages.length; i++){
		if(messages[i]["id"] == id){
			findId = i;
			break;
		}
	}
	return findId;
}
//////////////////////////////
//０〜numまでの乱数を返す
function getRandomNum(num){
	return Math.floor( Math.random() * num);
}
//時間取得
//戻り値：string (月/日 時間:分)
function getTime(){
	DD = new Date();
	Year = DD.getYear();
	Month = DD.getMonth();
	Day = DD.getDate();
	Hours = DD.getHours();
	Minutes = (DD.getMinutes() < 10) ? "0" + DD.getMinutes() : DD.getMinutes();
	return "" + Month + "/" + Day + " " + Hours + ":" + Minutes;
}

///////////////////////////
//バグフラグのon/off
function changeBugFlag(){
	bugFindNotification = (document.getElementById("ID_BUG_FLAG").checked)? true : false;

}