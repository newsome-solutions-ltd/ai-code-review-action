#! /usr/bin/env node
'use strict'

const loggerFactory = require("./LoggerFactory")
const gitHubService = require("./github/GitHubService")

const log = loggerFactory.createLogger()

async function main() {
    const repo = process.env.GITHUB_REPOSITORY // Auto-set by GitHub Actions
    const prNumber = process.env.PR_NUMBER // Needs to be set by the workflow
    const githubToken = process.env.GITHUB_TOKEN

    const greeting = `Invoking AI code review [repository: ${repo}, pr: #${prNumber}]...`
    log.debug(greeting)

    try {
        const diff = await gitHubService.fetchPRDiff(repo, prNumber, githubToken)
        log.debug('Fetched PR Diff: %s', diff)
    } catch (error) {
        log.error('PR Review Action failed: %s', error.message)
        throw error
    }
}

main();
