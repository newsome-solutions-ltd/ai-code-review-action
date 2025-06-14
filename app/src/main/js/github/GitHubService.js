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
    fetchPRDiff: async function fetchPRDiff(repo, prNumber, githubToken) {
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
    }
}

module.exports = gitHubService;
