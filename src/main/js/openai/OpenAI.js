const axios = require('axios');
const loggerFactory = require('../LoggerFactory')
const StopWatch = require('../util/StopWatch')

const log = loggerFactory.createLogger()

const defaultModel = 'gpt-4o'
const defaultTokenCount = 1500

class OpenAI {
    constructor(apiKey) {
        if (!apiKey || !apiKey.startsWith('sk-')) {
            throw new Error('Invalid or missing OpenAI API key')
        }
        log.info('OpenAI API key provided, initializing OpenAI client...')
        this.apiKey = apiKey
    }
    /**
     * Sends a PR diff to OpenAI for review comments and summarization.
     * @param {string} diffText - The full diff of the PR
     * @param {string} model - Optional: OpenAI model to use (default: gpt-3.5-turbo, gpt-4)
     * @param {number} max_tokens - Max number of tokens (default: 1500)
     * @returns {Promise<string>} - The AI-generated review comments
     */
    aiCodeReview = async (diffText, model, max_tokens) => {
        const stopWatch = new StopWatch().start()
        const input = `
        Analyze the diff and respond in this exact JSON format:
        {
        "summary": "One-paragraph summary of what this PR does",
        "comments": [
            {
            "file": "relative/path/to/file.js",
            "line": 42,
            "body": "Your feedback for this line",
            "side": "OLD if type is '-' and NEW if type is '+'"
            },
            ...
        ]
        }
        Only include real feedback, and only reference lines that appear in the diff.
        Each line in the diff will state the file, the type ('+' for additions, '-' for deletions), and line number, followed by the line content.
        Here is the diff:
        ${diffText}
        `;
        
        model = model?.length > 0 ? model : defaultModel

        log.debug(`max_tokens: ${max_tokens} [type: ${typeof max_tokens}]`)
        log.info(`Chatting with OpenAI model ${model}...`)
        const payload = {
            model,
            instructions: 'You are an expert software engineer and code reviewer.',
            input,
            temperature: 0.3,
            max_output_tokens: max_tokens ?? defaultTokenCount,
            text: { format: { type: "json_object" } }
        }
        log.debug("OpenAI payload: " + JSON.stringify(payload, null, 2))

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/responses',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const timeInMs = stopWatch.stop().getTime()
            log.info(`OpenAI response received. Time elapsed: ${timeInMs} ms`);

            if (log.isDebugEnabled()) {
                log.debug("===========================")
                log.debug("# OpenAI response data...")
                log.debug(JSON.stringify(response.data))
            }

            return JSON.parse(response.data.output[0].content[0].text);
        } catch (error) {
            var errorMessage = error?.message + ": " + (error?.response ? JSON.stringify(error.response.data) : "Unknown error")
            log.error(`❌ Failed to fetch AI review: ${errorMessage}`)
            throw new Error('AI Code Review API request failed.')
        }
    }
}

module.exports = OpenAI;
