import React, { useState, useEffect, useRef } from 'react';
import styles from './Chatbox.module.css';
import useChatbox from './eventHandler';

function addZero(num) {
    return num < 10 ? '0'+num : num
}

const ChatBox = () => {
    const { isChatboxVisible, toggleChatbox, textareaRef} = useChatbox();
    const today = new Date()
    const chatboxMessageContentRef = useRef(null)

    const [messages, setMessages] = useState([
        {
            text: "I am Morevie bot, I am here to assist you! Feel free to send me questions ^^!",
            time: `${addZero(today.getHours())}:${addZero(today.getMinutes())}`,
            type: "receive"
        }
    ]);

    const [newMessageAdded, setNewMessageAdded] = useState(false);

    function writeMessage(e) {
        e.preventDefault();

        const nowDay = new Date()

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

    useEffect(() => {
        if (newMessageAdded) {
            const autoReply = () => {
                const nowDay = new Date();
                const newMessage = {
                    text: 'Thank you for your question! I am now thinking of an answer, please wait... :(',
                    time: `${addZero(nowDay.getHours())}:${addZero(nowDay.getMinutes())}`,
                    type: "receive"
                };

                setMessages(prevMessages => [...prevMessages, newMessage]);
                setTimeout(scrollBottom, 50);
            };
            
            setTimeout(autoReply, 2000);
            setNewMessageAdded(false);
        }
    }, [newMessageAdded]);

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
