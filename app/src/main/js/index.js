#! /usr/bin/env node
'use strict'

const loggerFactory = require("./LoggerFactory")
const gitHubService = require("./github/GitHubService")
const OpenAI = require("./openai/OpenAI")
const diffTransformer = require("./DiffTransformer")
const select = require("./util/Select")

const log = loggerFactory.createLogger()

const isNotEmpty = s => s?.trim().length > 0;
const isNotNull = o => o != undefined && o != null
const validate = (value, validator, message) => {
    try {
        if (!validator(value)) {
            log.error(`❌ ${message} [value: ${value}]`);
            process.exit(1);
        }
    } catch (error) {
        log.error(`❌ ${message} [value: ${value}] - error occurred: ${JSON.stringify(error)}`);
        process.exit(1);
    }
}

class Configuration {
    constructor() {
        this.repo = process.env.GITHUB_REPOSITORY
        this.prNumber = select(process.env.PR_NUMBER).filter(isNotEmpty).map(parseInt).orElse(null)
        this.githubToken = process.env.GITHUB_TOKEN
        this.openAiApiKey = process.env.OPENAI_API_KEY
        this.label = select(process.env.REVIEWED_LABEL).filter(isNotEmpty).orElse("ai-reviewed")
        this.model = select(process.env.OPENAI_MODEL).filter(isNotEmpty).orElse('gpt-4o')
        this.maxTokens = select(process.env.OPENAI_MAX_TOKENS).filter(isNotEmpty).map(parseInt).orElse(1500)
    }
}

async function main() {
    const config = new Configuration()

    validate(config.repo, isNotEmpty, "Invalid repository parameter")
    validate(config.prNumber, isNotNull, "Invalid pr_number parameter")
    validate(config.githubToken, isNotEmpty, "Invalid token parameter")
    validate(config.openAiApiKey, isNotEmpty, "Invalid openai_api_key parameter")

    const greeting = `Invoking AI code review [repository: ${config.repo}, pr: #${config.prNumber}]...`
    log.debug(greeting)

    const openai = new OpenAI(config.openAiApiKey)

    try {
        const diff = await gitHubService.fetchPRDiff(config.repo, config.prNumber, config.githubToken)
        log.debug(`Fetched PR Diff: ${diff}`)

        const review = await openai.aiCodeReview(diffTransformer.transformDiffForModel(diff), config.model, config.maxTokens)
        log.debug(`OpenAPI response: ${JSON.stringify(review)}`)
        await gitHubService.addLabelsToPR(config.repo, config.prNumber, config.githubToken, [config.label])
        await gitHubService.addPRComment(config.repo, config.prNumber, config.githubToken, review.summary, review.comments)
        log.info(`✅ PR review complete. Please review the comments.`)
    } catch (error) {
        log.error(`❌ PR Review Action failed: ${JSON.stringify(error)}`)
        throw error
    }
}

main();
