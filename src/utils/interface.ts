/**
 * Speak 类型
 */
export interface SPEAK {
    /** speak类型 */
    type: string;
    /** 参数 */
    args: string;
    /** 行数 */
    line: number;
}

/**
 * Listen类型
 */
export interface LISTEN {
    /** listen 的时间 */
    time: number;
    /** listen 代码的行号 */
    line: number;
}

/**
 * Default 类型
 */
export interface DEFAULT {
    /** 要跳转的 stepId */
    args: string;
    /** default 代码的行号 */
    line: number;
}

/**
 * SLIENCE 类型
 */
export interface SILENCE {
    /** 要跳转的 stepId */
    args: string;
    /** silence 代码的行号 */
    line: number;
}

export interface BRANCH {
    /** 跳转分支的回答 */
    answer: string;
    /** 要跳转的 stepId */
    nextStepId: string;
    /** branch 代码的行号 */
    line: number;
}

/**
 * 哈希表类型
 * @param key 哈希表的键
 */
export interface HASHTABLE {
    [key: string]: {
        /** speak 的列表和行数 */
        speak?: SPEAK[];
        /** listen 类型 */
        listen?: LISTEN;
        /** 该 Step 的行数 */
        line?: number;
        /** default 类型 */
        default?: DEFAULT;
        /** silence 类型 */
        silence?: SILENCE;
        /** branch 类型 */
        branch?: BRANCH[];
        /** culculate 类型 */
        culculate?: string[][];
    };
}

/**
 * 变量类型
 * @param key 变量的名字
 */
export interface VARS {
    [key: string]: string;
}

/**
 * 语法树类型
 */
export interface AST {
    /** 哈希表 */
    hashTable: HASHTABLE;
    /** 入口 Step */
    entry: string;
    /** 出口 Step */
    exitStep: string[];
    /** 变量表 */
    vars: VARS;
}

/**
 * 运行环境类型
 */
export interface ENV {
    /** 当前 Step */
    curStep: string;
    /** 变量表 */
    vars: VARS;
}

/** 回答类型 */
export interface ANSWER {
    /** 回答的内容 */
    text: string;
    /** 是否结束聊天 */
    end: boolean;
    /** Listen 时间 */
    listen: number;
}

/**
 * 消息类型
 */
export interface MESSAGE {
    /** 作者 */
    author: string;
    /** 消息类型 */
    type: string;
    /** 消息内容 */
    data: {
        /** 消息文本 */
        text: string;
    };
}
