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
package com.yoshio3;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

/**
 *
 * @author Yoshio Terada
 */
@ServerEndpoint(value = "/chat-server")
public class ChatServerEndpoint {
    // Jetty の実装バグにより接続済みのセッション管理は自身で実装
    private static final Set< Session> sessions
            = Collections.synchronizedSet(new HashSet<Session>());

    @OnOpen
    public void onOpen(Session session) throws IOException {
        sessions.add(session);
    }

    @OnMessage
    public void onMessage(String message, Session session) throws IOException {
        //Jetty 9.1.0.v20131115 では Java SE 8 のコードを記載できないので
        //Java SE 7 でコードを記述 (Lambda 式で書けない)

        //Jetty の実装バグにより接続済みのセッション管理は自身で実装
        //Set<Session> sessions = session.getOpenSessions();
        //この結果が null を返し NullPointerException が発生
        for (Session sess : sessions) {
            if (sess.isOpen()) {
                sess.getBasicRemote().sendText(message);
            }
        }
    }

    @OnClose
    public void onClose(Session session) throws IOException {
        sessions.remove(session);
    }

    @OnError
    public void onError(Throwable p) {
        System.out.println("onError " + p.getMessage());
    }

}
