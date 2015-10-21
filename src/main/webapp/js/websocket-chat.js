/*
* Copyright 2015 Yoshio Terada
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/


var websocket = null;
var username = null;
window.addEventListener("load", init, false);

/* 初期化の処理 */
function init() {
    //起動時は chat 部分は非表示
    document.getElementById("chat").style.display = "none";
}

/* サーバ・エンドポイントとの接続処理 */
function connectServerEndpoint() {
    var wsUri = "ws://" 
            + document.location.hostname + ":" 
            + document.location.port 
            + document.location.pathname 
            + "chat-server";
    // FireFoxとの互換性を考慮してインスタンス化
    if ("WebSocket" in window) {
        websocket = new WebSocket(wsUri);
    } else if ("MozWebSocket" in window) {
        websocket = new MozWebSocket(wsUri);
    }
    //接続が完了し画面切り替え（Chat のメッセージ部分を表示)    
    showChatMessage();

    websocket.onopen = function (evt) {
        username = document.getElementById("name").value;
        sendMessage(username + " さんが参加しました。");
    };
    websocket.onmessage = function (evt) {
        writeToScreen(evt);
    };
    websocket.onerror = function (evt) {
        console.create("error : " + evt);
    };
    websocket.onclose = function (evt) {
        closeServerEndpoint();
    };

}
/* サーバ・エンドポイントとの切断時の処理 */
function closeServerEndpoint() {
    sendMessage(username + " さんが退出しました。");
    websocket.close(4001, "Close connection from client");
    showLoginButton();
}
/* サーバ・エンドポイントにメッセージ送信 */
function sendMessage(message) {
    websocket.send(message);
}
/* チャット・メッセージの送信 */
function submitMessage() {
    msg = document.getElementById("inputMessage").value;
    sendMessage(username + " : " + msg);
}
/* テーブルにメッセージの書き込み */
function writeToScreen(evt) {
    var element = document.createElement('div');
    element.className = "message";
    element.textContent = evt.data;
    element.style.backgroundColor = "white";
    //メッセージの挿入位置（最新情報を先頭に記載）
    var objBody = document.getElementById("insertpos");
    objBody.insertBefore(element, objBody.firstChild);
    // body要素にdivエレメントを追加 
}
/* ログインボタンの表示(切断時) */
function showLoginButton() {
    document.getElementById("login").style.display = "block";
    document.getElementById("chat").style.display = "none";
}
/* チャット領域の表示(ログイン時) */
function showChatMessage() {
    document.getElementById("login").style.display = "none";
    document.getElementById("chat").style.display = "block";
}

