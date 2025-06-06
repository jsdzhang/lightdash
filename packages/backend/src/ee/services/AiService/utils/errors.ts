export class AiDuplicateSlackPromptError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AiDuplicateSlackPromptError';
    }
}

export class AiSlackMappingNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AiSlackMappingNotFoundError';
    }
}

export class AiAgentNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AiAgentNotFoundError';
    }
}
