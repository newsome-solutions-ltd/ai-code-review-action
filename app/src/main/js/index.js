#! /usr/bin/env node
'use strict'

const loggerFactory = require("./LoggerFactory")
const gitHubService = require("./github/GitHubService")
const OpenAI = require("./openai/OpenAI")
const diffTransformer = require("./DiffTransformer")

const log = loggerFactory.createLogger()

async function main() {
    const repo = process.env.GITHUB_REPOSITORY
    const prNumber = process.env.PR_NUMBER
    const githubToken = process.env.GITHUB_TOKEN
    const openAiApiKey = process.env.OPENAI_API_KEY
    const label = process.env.REVIEWED_LABEL || "ai-reviewed"

    if (!openAiApiKey || openAiApiKey.length == 0) {
        log.error("❌ Missing OPENAI_API_KEY environment variable");
        process.exit(1);
    }

    const greeting = `Invoking AI code review [repository: ${repo}, pr: #${prNumber}]...`
    log.debug(greeting)

    const openai = new OpenAI(openAiApiKey)

    try {
        const diff = await gitHubService.fetchPRDiff(repo, prNumber, githubToken)
        log.debug(`Fetched PR Diff: ${diff}`)

        const review = await openai.aiCodeReview(diffTransformer.transformDiffForModel(diff))
        log.debug(`OpenAPI response: ${JSON.stringify(review)}`)
        await gitHubService.addLabelsToPR(repo, prNumber, githubToken, [label])
        await gitHubService.addPRComment(repo, prNumber, githubToken, review.summary, review.comments)
    } catch (error) {
        log.error(`PR Review Action failed: ${error.message}`)
        throw error
    }
}

main();
