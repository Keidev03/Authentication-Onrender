import { SessionService } from './session.service';
export declare class SessionController {
    private readonly sessionService;
    constructor(sessionService: SessionService);
    getAllSessions(): Promise<{
        sessions: import("./session.schema").SessionDocument[];
        totalRecords: number;
    }>;
    getSession(id: string): Promise<import("./session.schema").SessionDocument>;
    deleteSession(id: string): Promise<void>;
}
