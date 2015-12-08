
var talkList = [];

var MAX_INPUT_CHAR = 140;
var thumbnailPath = "./data/thumbnail/";

var userInfo = {
	"name" 		: "User A",
	"thumbnail" : "user0.png",
	"follower" 	: []
};

//バグ用
var sendFlag = false;

//////////////////////////
//初期化
function init(){
	document.getElementById("ID_INPUT_THUMBNAIL").html =
		'<img src="' + thumbnailPath + userInfo["thumbnail"]+ '">';
	viewReccomend(3);
	
}

//////////////////////////
//画像動画アップロード処理
function upload(){
	document.getElementById("ID_INPUT_PICTURES").html += '<img src="test.jpg">';
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
	document.getElementById("ID_INPUT_COUNT").html = str;
	//バグ
	if(sendFlag) viewBugEffect("SEND_CANT_DELETE");

	///// 1/10の確率でボットメッセージを作る
	if((Math.random() * 100 | 0) < 10){
		randomBotMessage();
	}
}

///////////////////////////
//メッセージの送信
function sendMessage(){
	var msg = document.getElementById("ID_INPUT_MSG").value;
	checkSendMessage(msg);	//バグ。htmlタグチェック

	//バグ。SQLインジェクションチェック（リストが表示されることにする)
	if(msg.substr(0,4).toUpperCase() === "' OR"){
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
	var data = [];
	

	for(var i = 0, len = messages.length; i < len; i++){

		var list = [
		'<div class="listMain">',
		'<div class="listThumbnail floatLeft"><img src="' + thumbnailPath + messages[i]["image"] + '"></div>',
		'<div class="listMessage floatLeft">',

			'<div class="listName fontFrame floatLeft">' + messages[i]["name"] + ' <b onClick="clickListDate()">' + messages[i]["time"] + '</b></div>',
			'<div class="listEdit fontFrame floatLeft" onClick="viewEditList(' + messages[i]["id"] + ')">▼</div>',
			'<div class="clear"></div>',
			'<div class="listEditList" ID="ID_EDIT_LIST' + messages[i]["id"] + '"></div>',
		'<div class="listMessageMain">' + messages[i]["msg"] + '</div>',
		'</div>',
		'<div class="clear"><hr></div>',
		'<div class="listFooter">',
			'<div class="listLike floatLeft" onClick="clickLike(' + messages[i]["id"] + ')">良いね！' + messages[i]["like"] +　'</div>', 
			'<div class="listReply floatLeft" onClick="viewReplyArea(' + messages[i]["id"] + ')"><img align="middle" src="data/5.png">コメント</div>',
			'<div class="clear"></div>',
			'<div ID="ID_REPLY_AREA' + messages[i]["id"] + '">' + messages[i]["reply"] + '</div>',
		'</div>',
		'</div>',
		];

		Array.prototype.push.apply(data, list);

	}
	document.getElementById("ID_DISPLAY_ARTICLES").html = data.join("");
}

///////////////////////////////////////プロフィール系//////////////////////////////
//プロフィール欄表示（ヘッダから）
function checkName(){
	//バグ
	if(userInfo["name"] !== "User A") viewBugEffect("PROFILE_DONT_CHANGE_HEADER");
	viewProfile();
}

//////////////////////////////////
//プロフィール表示
function viewProfile(){
	var html = [
		'<div class="listMain">',
		'<div class="floatLeft profileTitle fontFrame">プロフィール</div>',
		'<div class="floatLeft profileClose" onClick="closeProfile()"><img src="data/close.png"></div>',
		'<div class="clear"></div>',
		'<hr>',
		'<div class="profileThumbnail floatLeft pointer" onClick="viewThumbnail()"><img src="' + thumbnailPath + userInfo["thumbnail"] + '"></div>',
		'<div id="ID_PROFILE_NAME" class="profileName floatLeft pointer"><div onClick="viewNameInput()">' + sanitizeText(userInfo["name"]) + '</div></div>',
		'<div class="clear"></div>',
		'<div id="ID_PROFILE_SELECT_THUMBNAIL"></div>',
		'<div>' + viewFollower() + '</div>',
		'</div>',
	].join("");

	document.getElementById("ID_EDIT_AREA").html = html;
}

///////////////////////////////////
//名前のinput
function viewNameInput(){
	var html = '<input maxlength="21" type="text" id="ID_PROFILE_NAME_INPUT" onkeyup="countNameCharacters()">';
	html += '<div class="profileNameCount" id="ID_PROFILE_NAME_INPUT_COUNT"></div><br><button onClick="changeName()">変更</button>';

	document.getElementById("ID_PROFILE_NAME").html = html;
	document.getElementById("ID_PROFILE_NAME_INPUT").value = userInfo["name"];
	countNameCharacters();
}
///////////////////////////
//入力文字数カウント
function countNameCharacters(){
	var msg = document.getElementById("ID_PROFILE_NAME_INPUT").value;
	var str = "" + msg.length + "/" + 20;
	document.getElementById("ID_PROFILE_NAME_INPUT_COUNT").html = str;
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
	var html = ["変更するサムネイルを選んでください。<br>"];
	for(var i = 0, len = botName.length; i < len; i++){
		var fragment = [
			'<div class="floatLeft recommendFollowerList" onClick="changeThumbnail(' + i + ')">',
			'<img src="' + thumbnailPath + 'user' + i + '.png">',
			'</div>'];
		Array.prototype.push.apply(html, fragment);
	}
	html.push('<div class="clear"></div>');
	
	document.getElementById("ID_PROFILE_SELECT_THUMBNAIL").html = html.join("");
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
	document.getElementById("ID_EDIT_AREA").html = "";
}
///////////////////////
//フォロワー表示
function viewFollower(){
	if(!userInfo["follower"].length) return "";
	var html = ["<hr>フォロワー<br>"];

	var arrayTmp = userInfo["follower"];		//フォロワー取得

	for(var i = 0, len = arrayTmp.length; i < len; i++){
		var id = arrayTmp[i];

		var fragment = [
			'<div class="floatLeft recommendFollowerList" onClick="deleteFollower(' + id + ')">',
			'<img src="' + thumbnailPath + 'user' + id + '.png"><br>',
			botName[id],
			'</div>'];
		Array.prototype.push.apply(html, fragment);
	}
	html.push('<div class="clear"></div>');
	return html.join("");
}

//フォロワー削除
function deleteFollower(id){
	var check = confirm(botName[id] + "のフォローを解除しますか？");
	
	userInfo["follower"] = userInfo["follower"].filter(function(_id) { return _id !== id });
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
	document.getElementById("ID_EDIT_LIST" + id).html = html;
	var findId = findObjectId(talkList, id);
	//バグ
	if(talkList[findId]["deleteFlug"] === 1){
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
	if(talkList[findId]["type"] === "bot") viewBugEffect("LIST_DELETE_OTHER"); 
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
	document.getElementById("ID_REPLY_AREA" + id).html = html;
	var findId = findObjectId(talkList, id);
	//バグ
	if(talkList[findId]["commentFlug"] === 1){
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
	if(talkList[findId]["reply"] !== "") viewBugEffect("LIST_COMMENTS"); 

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
	var html = [];
	for(var i = 0; i < num; i++){
		var rnd = getRandomNum(botName.length);
		var fragment = [
			'<div class="floatLeft recommendFollowerList" onClick="addFollower(' + rnd + ')">',
			'<img src="' + thumbnailPath + 'user' + rnd + '.png"><br>',
			botName[rnd],
			'</div>'];
		Array.prototype.push.apply(html, fragment);
		//バグ
		checkRnd.unshift(rnd);
	}
	html.push('<div class="clear"></div>');
	document.getElementById("ID_RECOMMEND_USER").html = html.join("");
	//バグ
	if(!checkRecommend(checkRnd)) viewBugEffect("RECCOMEND_VIEW_FRIEND"); 
}

function checkRecommend(checkRnd){
	return checkRnd.length === checkRnd.distinct().length;
}

///////////////////////////
//おすすめユーザー追加
function addFollower(id){
	//バグ
	if(!checkFollower(id)) viewBugEffect("RECCOMEND_ADD_FRIEND");

	userInfo["follower"].push(id);
	alert(botName[id] + "をフォローしました。");
	
	
}

////////////////////////
//フォロワー重複チェック
function checkFollower(id){
	return !userInfo["follower"].contains(id);
}


////////////////////////////////////////bot系////////////////////////////
////////////////////////////////
//フォロワーの中からランダムでボットデータを作成する
function randomBotMessage(){
	if(!userInfo["follower"].length) return;

	var id = userInfo["follower"].random();
	talkList.unshift(makeBotData(id));	//タイムラインに挿入
	viewArticles(talkList);
}
///////////////////////////
//ボットデータ作成
function makeBotData(botId){
	var obj = {
		"id" : talkList.length,
		"image" : 'user' + botId + '.png',
		"name" : botName[botId],
		"msg" : serifuData.random(),
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
	for(var i = 0, len = messages.length; i < len; i++){
		if(messages[i]["id"] === id){
			findId = i;
			break;
		}
	}
	return findId;
}
//////////////////////////////
//０〜numまでの乱数を返す
function getRandomNum(num){
	return Math.random() * num | 0;
}
//時間取得
//戻り値：string (月/日 時間:分)
function getTime(){
	var DD = new Date();
	Year = DD.getYear();
	Month = DD.getMonth();
	Day = DD.getDate();
	Hours = DD.getHours();
	Minutes = ("0" + DD.getMinutes()).slice(-2);
	return "" + Month + "/" + Day + " " + Hours + ":" + Minutes;
}

///////////////////////////
//バグフラグのon/off
function changeBugFlag(){
	bugFindNotification = document.getElementById("ID_BUG_FLAG").checked;
}