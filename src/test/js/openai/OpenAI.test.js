#! /usr/bin/env node

// --------------------------------------------------------------- Imports

const OpenAi = require("../../../main/js/openai/OpenAI");

// ----------------------------------------------------------------- Tests

describe('OpenAI', () => {

    it.skip("should invoke Open AI model", () => {
        let model = "gpt-4o";
        let openai = new OpenAi("<TO BE REPLACED: OpenAI API Key>");
        let diffText = `[file:.github/workflows/build_manual.yml][L:9] run-name: 'Build (Manual) [\${{ github.ref_name `
        let max_tokens = 1500;

        return openai.aiCodeReview(diffText, model, max_tokens)
            .then((result) => {
                expect(result).toBeDefined();
                expect(result).toHaveProperty("summary");
                expect(result).toHaveProperty("comments");
            })
            .catch((error) => {
                console.error("Error during OpenAI API call:", error);
                throw error;
            });
    })

});