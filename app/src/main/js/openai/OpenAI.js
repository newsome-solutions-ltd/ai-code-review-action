const axios = require('axios');
const loggerFactory = require('../LoggerFactory')

const log = loggerFactory.createLogger()

const defaultModel = 'gpt-4o'
const defaultTokenCount = 1500

class OpenAI {
    constructor(apiKey) {
        this.apiKey = apiKey
    }
    /**
     * Sends a PR diff to OpenAI for review comments and summarization.
     * @param {string} diffText - The full diff of the PR
     * @param {string} model - Optional: OpenAI model to use (default: gpt-3.5-turbo, gpt-4)
     * @param {number} max_tokens - Max number of tokens (default: 1500)
     * @returns {Promise<string>} - The AI-generated review comments
     */
    aiCodeReview = async (diffText, model = defaultModel, max_tokens = defaultTokenCount) => {
        const prompt = `
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
        
        model = model?.length > 0 ? model : null;

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: model ?? defaultModel,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert sooftware engineer and code reviewer.',
                        },
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    temperature: 0.3,
                    max_tokens: max_tokens ?? defaultModel,
                    response_format: { "type": "json_object" }
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            log.debug("===========================")
            log.debug("# OpenAI response data...")
            log.debug(JSON.stringify(response.data))

            return JSON.parse(response.data.choices[0].message.content);
        } catch (error) {
            log.error('Failed to fetch AI review:', error.response?.data || error.message);
            throw new Error('AI Code Review API request failed.');
        }
    }
}

module.exports = OpenAI;
