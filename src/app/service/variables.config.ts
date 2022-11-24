// main
// export const serverUrl = 'http://x2023vhex3818793104001.francecentral.cloudapp.azure.com:3000';
export const serverUrl = 'http://192.168.1.35:3000';

// routes user
export const user = {
    auth: 'auth/login',
    profile: 'auth/profile'
};

// chat routes
export const chat = {
    defaultRoom: {
        defaultName: '#general',
        defaultChatId: '635a33e2c8771ffffdc9d97b',
    },
    default: '',
    getList: 'chatroom',
    createChat: 'chatroom',
    joinChat: (chatId) => `chatroom/join/${chatId}`,
    getInfo: (chatId) =>  `chatroom/${chatId}`,
    deleteChatroom: (chatId) => `chatroom/${chatId}`
};


export default {
    serverUrl,
    user,
    chat,
};
