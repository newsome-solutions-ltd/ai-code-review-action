const axios = require('axios');

class OpenAI {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    /**
     * Sends a PR diff to OpenAI for review comments and summarization.
     * @param {string} diffText - The full diff of the PR
     * @param {string} model - Optional: OpenAI model to use (default: gpt-4)
     * @param {number} max_tokens - Max number of tokens (default: 1500)
     * @returns {Promise<string>} - The AI-generated review comments
     */
    aiCodeReview = async (diffText, model = 'gpt-4', max_tokens = 1500) => {
        const prompt = `
        You are an expert code reviewer. Analyze the following GitHub pull request diff and provide:
        1. A summary of what this PR does.
        2. Any high-level concerns or recommendations.
        3. If appropriate, inline comments with filename, line number, and feedback.

        Respond in markdown. Here's the diff:
        \`\`\`diff
        ${diffText}
        \`\`\`
        `;

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful and concise code reviewer.',
                        },
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    temperature: 0.3,
                    max_tokens: max_tokens,
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Failed to fetch AI review:', error.response?.data || error.message);
            throw new Error('AI Code Review API request failed.');
        }
    }
}

module.exports = OpenAI;
