import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './Chatbox.module.css';
import useChatbox from './eventHandler';

const ChatBox = () => {
    const { isChatboxVisible, toggleChatbox, textareaRef } = useChatbox();
    const chatboxMessageContentRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [newMessage, setNewMessage] = useState(null);

    useEffect(() => {
        const today = new Date();
        const token = localStorage.getItem('accessToken');
        setIsLoggedIn(!!token);
        const addZero = (num) => (num < 10 ? '0' + num : num);

        const initialMessage = !!token 
            ? 'I am Morevie bot, I am here to assist you. Feel free to send me questions ^^!'
            : 'I cannot assist you right now, please log in with your account or create a new one!';

        setMessages([{
            text: initialMessage,
            time: `${addZero(today.getHours())}:${addZero(today.getMinutes())}`,
            type: "receive"
        }]);
    }, []);

    function addZero(num) {
        return num < 10 ? '0' + num : num;
    }

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
        setNewMessage(newMessage);
        
        textareaRef.current.value = '';
        textareaRef.current.style.height = 'auto';
        textareaRef.current.rows = 1;
    }

    const addReplyMessage = (out) => {
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
        if (newMessage && isLoggedIn) {
            const token = localStorage.getItem('accessToken');
            const lastMessage = newMessage.text;

            axios.post('http://localhost:8000/chatbot/chat', {
                content: lastMessage
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                const out = response.data.answer;
                setTimeout(() => addReplyMessage(out), 30000);
            }).catch(error => {
                console.error('Error while fetching response:', error);
            });

            setNewMessage(null);
        } else if (newMessage && !isLoggedIn) {
            const defaultReply = 'I cannot assist you right now :((, please log in with your account or create a new one!';
            setTimeout(() => addReplyMessage(defaultReply), 500);
            setNewMessage(null);
        }
    }, [newMessage, isLoggedIn]);

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
                    <form className={styles.chatboxMessageForm} onSubmit={writeMessage}>
                        <textarea rows="1" placeholder='Type message...' className={styles.chatboxMessageInput} ref={textareaRef} onKeyDown={handleKeyDown}></textarea>
                        <button type="submit" className={styles.chatboxMessageSubmit}><i className='bx bxs-send'></i></button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
