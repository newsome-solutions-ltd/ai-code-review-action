#! /usr/bin/env node
'use strict'

const loggerFactory = require("./LoggerFactory")
const gitHubService = require("./github/GitHubService")
const OpenAI = require("./openapi/OpenAPI")

const log = loggerFactory.createLogger()

async function main() {
    const repo = process.env.GITHUB_REPOSITORY
    const prNumber = process.env.PR_NUMBER
    const githubToken = process.env.GITHUB_TOKEN
    const openApiKey = process.env.OPENAPI_KEY

    const greeting = `Invoking AI code review [repository: ${repo}, pr: #${prNumber}]...`
    log.debug(greeting)

    const openai = new OpenAI(openApiKey)

    try {
        const diff = await gitHubService.fetchPRDiff(repo, prNumber, githubToken)
        log.debug(`Fetched PR Diff: ${diff}`)

        const aiResponse = openai.aiCodeReview(diff)
        log.debug(`OpenAPI response: ${aiResponse}`)
    } catch (error) {
        log.error(`PR Review Action failed: ${error.message}`)
        throw error
    }
}

main();
