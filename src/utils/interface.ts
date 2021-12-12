export interface HASHTABLE {
    [key: string]: {
        speak?: {
            type: string;
            args: string;
            line: number;
        }[];
        listen?: { time: number; line: number };
        line?: number;
        default?: { args: string; line: number };
        silence?: { args: string; line: number };
        branch?: {
            answer: string;
            nextStepId: string;
            line: number;
        }[];
    };
}

export interface VARS {
    [key: string]: string;
}

export interface AST {
    HashTable: HASHTABLE;
    entry: string;
    exitStep: string[];
    vars: VARS;
}

export interface ENV {
    curStep: string;
    vars: VARS;
}

export interface ANSWER {
    text: string;
    end: boolean;
    listen: number;
}
