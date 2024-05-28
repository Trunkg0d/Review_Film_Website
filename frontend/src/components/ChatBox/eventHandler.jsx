import { useState, useEffect, useRef } from 'react';

const useChatbox = () => {
    const [isChatboxVisible, setChatboxVisible] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;

        textarea.rows = 1;

        const handleInput = () => {
            const lineCount = textarea.value.split('\n').length;
            if (textarea.value === '') {
                textarea.rows = 1;
            } else if (textarea.rows < 3) {
                textarea.rows = lineCount;
            }
        };

        textarea.addEventListener('input', handleInput);

        return () => {
            textarea.removeEventListener('input', handleInput);
        };
    }, []);

    const toggleChatbox = () => {
        setChatboxVisible(!isChatboxVisible);
    };

    return {
        isChatboxVisible,
        toggleChatbox,
        textareaRef
    };
};

export default useChatbox;