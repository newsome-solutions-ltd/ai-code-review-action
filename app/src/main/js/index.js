#! /usr/bin/env node
'use strict'

const loggerFactory = require("./LoggerFactory")
const gitHubService = require("./github/GitHubService")
const OpenAI = require("./openai/OpenAI")

const log = loggerFactory.createLogger()

async function main() {
    const repo = process.env.GITHUB_REPOSITORY
    const prNumber = process.env.PR_NUMBER
    const githubToken = process.env.GITHUB_TOKEN
    const openAiApiKey = process.env.OPENAI_API_KEY

    if (!openAiApiKey || openAiApiKey.length == 0) {
        log.error("❌ Missing OPENAI_API_KEY environment variable");
        process.exit(1);
    }

    const greeting = `Invoking AI code review [repository: ${repo}, pr: #${prNumber}]...`
    log.debug(greeting)

    const openai = new OpenAI(openAiApiKey)

    try {
        // const diff = await gitHubService.fetchPRDiff(repo, prNumber, githubToken)
        // log.debug(`Fetched PR Diff: ${diff}`)

        //const aiResponse = await openai.aiCodeReview(diff)
        const review = {
            "summary": "This PR introduces an AI code review step in the GitHub workflow and makes a minor formatting change in the pom.xml file. The build step in the workflow has been commented out.",
            "comments": [
                {
                    "file": ".github/workflows/build_pr.yml",
                    "line": 12,
                    "body": "The environment variable 'OPENAI_API_KEY' is being set here. Make sure the secret is properly set in the GitHub repository settings."
                },
                {
                    "file": ".github/workflows/build_pr.yml",
                    "line": 23,
                    "body": "The 'ai-code-review-action' is being used here. Ensure that this action is properly tested and reliable for use in production workflows."
                },
                {
                    "file": ".github/workflows/build_pr.yml",
                    "line": 32,
                    "body": "The build step has been commented out. If this is intentional and the build process is handled elsewhere, ignore this comment. Otherwise, it might be an oversight."
                },
                {
                    "file": "pom.xml",
                    "line": 7,
                    "body": "A minor formatting change has been made here. If this is unintentional, it might be good to revert it to keep the commit history clean."
                }
            ]
        }
        log.debug(`OpenAPI response: ${JSON.stringify(review)}`)
        gitHubService.addPRComment(repo, prNumber, githubToken, review.summary, review.comments)
    } catch (error) {
        log.error(`PR Review Action failed: ${error.message}`)
        throw error
    }
}

main();
