class MachineModule {
    transport;
    clientId;
    constructor(deps) {
        this.transport = deps.transport;
        this.clientId = deps.clientId;
    }
    async enroll() {
        return this.transport.post("/api/v1/machine/enroll", {
            clientId: this.clientId,
        });
    }
    async token(secret) {
        return this.transport.post("/oauth2/token", {
            grant_type: "client_credentials",
            client_id: this.clientId,
            client_secret: secret,
        });
    }
    async revoke(secret) {
        await this.transport.post("/oauth2/revoke", {
            client_id: this.clientId,
            client_secret: secret,
        });
    }
}
export { MachineModule };
//# sourceMappingURL=machine.js.map