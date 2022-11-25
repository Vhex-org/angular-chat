export default class User {
    public username: string;
    public email: string;
    public jwt: string;
    public role: string;
    public userId: string;

    constructor(name: string, mail: string, jwt: string = '', role: string = '', id: string = '') {
        this.username = name;
        this.email = mail;
        this.jwt = jwt;
        this.role = role;
        this.userId = id;
    }
};
