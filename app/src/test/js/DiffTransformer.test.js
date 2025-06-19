#! /usr/bin/env node

// --------------------------------------------------------------- Imports

const diffTransform = require("../../main/js/DiffTransformer");
const loggerFactory = require("../../main/js/LoggerFactory");

// ------------------------------------------------------------- Variables 

const log = loggerFactory.createLogger();

// ----------------------------------------------------------------- tests

test('should transform diff', () => {
    const rawDiff = `
diff --git a/.github/workflows/build_pr.yml b/.github/workflows/build_pr.yml
index 5113f4a..1acfffe 100644
--- a/.github/workflows/build_pr.yml
+++ b/.github/workflows/build_pr.yml
@@ -12,7 +12,29 @@ on:
 
 run-name: 'Build (Pull Request) [\${{ github.head_ref }}] #\${{github.run_number}}'
 
+env:
+  SOME_ENV_VAR: \${{ secrets.SOME_ENV_VAR }}
+
 jobs:
-  build:
-    uses: org.mydomain/workflows/.github/workflows/maven_build.yaml@staging
-    secrets: inherit
\\ No newline at end of file
+  review:
+    runs-on: ubuntu-latest
+
+    permissions:
+      contents: 'read'
+      pull-requests:  'write'
+
+    steps:
+    - name: AI Code Review
+      if: \${{!contains(github.event.pull_request.labels.*.name, 'ai-reviewed')}}
+      id: ai-code-review
+      uses: org.mydomain/ai-code-review-action@master
+      with:
+        pr_number: \${{ github.event.pull_request.number }}
+        token: \${{ secrets.GITHUB_TOKEN }}
+        repository: \${{ github.repository }}
+        api_key: \${{ env.SOME_ENV_VAR }}
+        reviewed_label: 'ai-reviewed'
+
+  # build:
+  #   uses: org.mydomain/workflows/.github/workflows/maven_build.yaml@staging
+  #   secrets: inherit
\\ No newline at end of file
diff --git a/pom.xml b/pom.xml
index 4802b90..1281cfb 100644
--- a/pom.xml
+++ b/pom.xml
@@ -3,7 +3,7 @@
          xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
 
     <modelVersion>4.0.0</modelVersion>
-     <groupId>org.mydomain.developer-services</groupId>
+    <groupId>org.mydomain.developer-services</groupId>
     <artifactId>sample-maven-java-lib</artifactId>
     <version>0.x.0-SNAPSHOT</version>
     <name>Name of the module</name>
 `

    const expected = `[file:.github/workflows/build_pr.yml][L:12] 
[file:.github/workflows/build_pr.yml][L:13] run-name: 'Build (Pull Request) [\${{ github.head_ref }}] #\${{github.run_number}}'
[file:.github/workflows/build_pr.yml][L:14] 
[file:.github/workflows/build_pr.yml][type:+][L:15] env:
[file:.github/workflows/build_pr.yml][type:+][L:16]   SOME_ENV_VAR: \${{ secrets.SOME_ENV_VAR }}
[file:.github/workflows/build_pr.yml][type:+][L:17] 
[file:.github/workflows/build_pr.yml][L:15] jobs:
[file:.github/workflows/build_pr.yml][type:-][L:16]   build:
[file:.github/workflows/build_pr.yml][type:-][L:17]     uses: org.mydomain/workflows/.github/workflows/maven_build.yaml@staging
[file:.github/workflows/build_pr.yml][type:-][L:18]     secrets: inherit
[file:.github/workflows/build_pr.yml][type:+][L:19]   review:
[file:.github/workflows/build_pr.yml][type:+][L:20]     runs-on: ubuntu-latest
[file:.github/workflows/build_pr.yml][type:+][L:21] 
[file:.github/workflows/build_pr.yml][type:+][L:22]     permissions:
[file:.github/workflows/build_pr.yml][type:+][L:23]       contents: 'read'
[file:.github/workflows/build_pr.yml][type:+][L:24]       pull-requests:  'write'
[file:.github/workflows/build_pr.yml][type:+][L:25] 
[file:.github/workflows/build_pr.yml][type:+][L:26]     steps:
[file:.github/workflows/build_pr.yml][type:+][L:27]     - name: AI Code Review
[file:.github/workflows/build_pr.yml][type:+][L:28]       if: \${{!contains(github.event.pull_request.labels.*.name, 'ai-reviewed')}}
[file:.github/workflows/build_pr.yml][type:+][L:29]       id: ai-code-review
[file:.github/workflows/build_pr.yml][type:+][L:30]       uses: org.mydomain/ai-code-review-action@master
[file:.github/workflows/build_pr.yml][type:+][L:31]       with:
[file:.github/workflows/build_pr.yml][type:+][L:32]         pr_number: \${{ github.event.pull_request.number }}
[file:.github/workflows/build_pr.yml][type:+][L:33]         token: \${{ secrets.GITHUB_TOKEN }}
[file:.github/workflows/build_pr.yml][type:+][L:34]         repository: \${{ github.repository }}
[file:.github/workflows/build_pr.yml][type:+][L:35]         api_key: \${{ env.SOME_ENV_VAR }}
[file:.github/workflows/build_pr.yml][type:+][L:36]         reviewed_label: 'ai-reviewed'
[file:.github/workflows/build_pr.yml][type:+][L:37] 
[file:.github/workflows/build_pr.yml][type:+][L:38]   # build:
[file:.github/workflows/build_pr.yml][type:+][L:39]   #   uses: org.mydomain/workflows/.github/workflows/maven_build.yaml@staging
[file:.github/workflows/build_pr.yml][type:+][L:40]   #   secrets: inherit
[file:pom.xml][L:3]          xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
[file:pom.xml][L:4] 
[file:pom.xml][L:5]     <modelVersion>4.0.0</modelVersion>
[file:pom.xml][type:-][L:6]      <groupId>org.mydomain.developer-services</groupId>
[file:pom.xml][type:+][L:6]     <groupId>org.mydomain.developer-services</groupId>
[file:pom.xml][L:7]     <artifactId>sample-maven-java-lib</artifactId>
[file:pom.xml][L:8]     <version>0.x.0-SNAPSHOT</version>
[file:pom.xml][L:9]     <name>Name of the module</name>
[file:pom.xml][L:10] `

    const transformed = diffTransform.transformDiffForModel(rawDiff)

    expect(transformed).toBe(expected)
});
