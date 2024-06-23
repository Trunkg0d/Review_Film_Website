import React, { useState, useEffect, useRef } from 'react';
import styles from './Chatbox.module.css';
import useChatbox from './eventHandler';
import {HfInference} from '@huggingface/inference';

const api_key = 'YOUR HUGGINGFACE API KEY HERE';
const hf = new HfInference(api_key);
const model_id = 'meta-llama/Meta-Llama-3-8B-Instruct';

function addZero(num) {
    return num < 10 ? '0'+num : num
}

const ChatBox = () => {
    const { isChatboxVisible, toggleChatbox, textareaRef} = useChatbox();
    const chatboxMessageContentRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const today = new Date();
        const token = localStorage.getItem('accessToken');
        setIsLoggedIn(!!token);
        const addZero = (num) => (num < 10 ? '0' + num : num);

        const initialMessage = !!token 
            ? 'I am Morevie bot, I am here to assist you. Feel free to send me question ^^!'
            : 'I cannot assist you right now, please log in with your account or create a new one!';

        setMessages([{
            text: initialMessage,
            time: `${addZero(today.getHours())}:${addZero(today.getMinutes())}`,
            type: "receive"
        }]);
    }, []);

    const [newMessageAdded, setNewMessageAdded] = useState(false);

    function writeMessage(e) {
        e.preventDefault();
        const nowDay = new Date();

        const messageText = textareaRef.current.value.trim().replace(/\n/g, '<br>\n');
        if (!messageText) return;

        const newMessage = {
            text: messageText,
            time: `${addZero(nowDay.getHours())}:${addZero(nowDay.getMinutes())}`,
            type: "sent"
        };

        setMessages(prevMessages => [...prevMessages, newMessage]);
        setTimeout(scrollBottom, 50);
        setNewMessageAdded(true);
        
        textareaRef.current.value = '';
        textareaRef.current.style.height = 'auto';
        textareaRef.current.rows = 1;
    }

    const Reply = (messages, out) => {
        const nowDay = new Date();
        const newMessage = {
            text: out,
            time: `${addZero(nowDay.getHours())}:${addZero(nowDay.getMinutes())}`,
            type: "receive"
        };

        setMessages(prevMessages => [...prevMessages, newMessage]);
        setTimeout(scrollBottom, 50);
    };

    useEffect(() => {
        if (newMessageAdded && isLoggedIn) {
            let out = "";
            const processChunks = async() => {
                for await (const chunk of hf.chatCompletionStream({
                    model: model_id,
                    messages: [
                    { role: "user", content: messages[messages.length - 1].text},
                    ],
                    max_tokens: 500,
                    temperature: 0.1,
                    seed: 0,
                })) {
                    if (chunk.choices && chunk.choices.length > 0) {
                        out += chunk.choices[0].delta.content;
                    }
                }
                return out;
            };
            processChunks().then((out) => {
                setTimeout(() => Reply(messages, out), 2000);
            });
            
            setNewMessageAdded(false);
        } else if (newMessageAdded && !isLoggedIn) {
            const defaultReply = 'I cannot assist you right now :((, please log in with your account or create a new one!';
            setTimeout(() => Reply(messages, defaultReply), 500);
            setNewMessageAdded(false);
        }
    }, [newMessageAdded, messages, isLoggedIn]);

    function scrollBottom() {
        const chatboxMessageContent = chatboxMessageContentRef.current;
        if (chatboxMessageContent) {
            chatboxMessageContent.scrollTop = chatboxMessageContent.scrollHeight;
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            writeMessage(e);
        }
    };
    
    return (
        <div className={styles.chatboxWrapper}>
            <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'/>
            <div className={styles.chatboxToggle} onClick={toggleChatbox}>
                <i className='bx bx-message-square-dots'></i>
            </div>
            <div className={`${styles.chatboxMessageWrapper} ${isChatboxVisible ? styles.show : ''}`}>
                <div className={styles.chatboxMessageHeader}>
                    <div className={styles.chatboxMessageProfile}>
                        <img src='https://i.pinimg.com/564x/ef/0d/0b/ef0d0b21879b1c36c608b6c813c87b81.jpg' alt='' className={styles.chatboxMessageImage}/>
                        <div>
                            <h4 className={styles.chatboxMessageName}>MOREVIE</h4>
                            <p className={styles.chatboxMessageStatus}>Chat Bot</p>
                        </div>
                    </div>
                </div>
                <div className={styles.chatboxMessageContent} ref={chatboxMessageContentRef}>
                    {messages.map((message, index) => (
                        <div key={index} className={`${styles.chatboxMessageItem} ${styles[message.type]}`}>
                            <span className={styles.chatboxMessageItemText} dangerouslySetInnerHTML={{ __html: message.text }} />
                            <span className={styles.chatboxMessageItemTime}>{message.time}</span>
                        </div>
                    ))}
                </div>
                <div className={styles.chatboxMessageBottom}>
                    {
                        <form className={styles.chatboxMessageForm} onSubmit={writeMessage}>
                            <textarea rows="1" placeholder='Type message...' className={styles.chatboxMessageInput} ref={textareaRef} onKeyDown={handleKeyDown}></textarea>
                            <button type="submit" className={styles.chatboxMessageSubmit}><i className='bx bxs-send'></i></button>
                        </form>
                    }
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
