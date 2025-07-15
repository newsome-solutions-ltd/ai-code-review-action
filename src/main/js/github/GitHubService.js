const axios = require('axios');
const loggerFactory = require("../LoggerFactory");

const log = loggerFactory.createLogger();

var gitHubService = {

    /**
     * Fetches the diff of a GitHub Pull Request
     * @param {string} repo - Repository name in format "owner/repo"
     * @param {number} prNumber - Pull request number
     * @param {string} githubToken - GitHub token for authentication
     * @returns {Promise<string>} - PR diff contents
     */
    fetchPRDiff: async function (repo, prNumber, githubToken) {
        try {
            const prResponse = await axios.get(`https://api.github.com/repos/${repo}/pulls/${prNumber}`, {
                headers: {
                    Authorization: `Bearer ${githubToken}`,
                    Accept: 'application/vnd.github.v3.diff'
                }
            });

            return prResponse.data; // Return the raw diff
        } catch (error) {
            log.error('Error fetching PR diff:', error.response?.data || error.message);
            throw new Error('Failed to fetch PR diff');
        }
    },

    addPRComment: async function (repo, prNumber, githubToken, summary, lineComments) {

        const comments = lineComments.map(comment => ({
            path: comment.file,
            body: comment.body,
            line: comment.line,
            side: (lineComments.side == 'OLD') ? 'LEFT' : 'RIGHT'
        }));

        const payload = {
            body: `### 💬 AI Review Summary\n\n${summary}`,
            event: 'COMMENT',
            comments
        };

        await axios.post(
            `https://api.github.com/repos/${repo}/pulls/${prNumber}/reviews`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${githubToken}`,
                    Accept: 'application/vnd.github.v3+json'
                }
            }
        );
    },

    /**
     * Adds a label to a pull request
     * @param {string} repo - Format: owner/repo
     * @param {number} prNumber - Pull request number
     * @param {string} githubToken - GitHub token
     * @param {string[]} labels - Array of label names to add
     */
    addLabelsToPR: async function (repo, prNumber, githubToken, labels) {
        log.debug(`Adding labels [${labels}] to repo PR [${repo}#${prNumber}]`)
        await axios.post(
            `https://api.github.com/repos/${repo}/issues/${prNumber}/labels`,
            { labels },
            {
                headers: {
                    Authorization: `Bearer ${githubToken}`,
                    Accept: 'application/vnd.github.v3+json'
                }
            }
        );
    },

    /**
     * Fetches labels for a pull request.
     * @param {string} repo - Repository name in format "owner/repo"
     * @param {number} prNumber - Pull request number
     * @param {string} githubToken - GitHub token for authentication
     * @returns {Promise<string[]>} - Array of label names
     * @throws {Error} - If fetching labels fails
     */
    fetchPRLabels: async function (repo, prNumber, githubToken) {
        try {
            const response = await axios.get(`https://api.github.com/repos/${repo}/issues/${prNumber}/labels`, {
                headers: {
                    Authorization: `Bearer ${githubToken}`,
                    Accept: 'application/vnd.github.v3+json'
                }
            });
            return response.data.map(label => label.name);
        } catch (error) {
            log.error('Error fetching PR labels:', error.response?.data || error.message);
            throw new Error('Failed to fetch PR labels');
        }
    }

}

module.exports = gitHubService;
