# Developer Guide

This page includes details of how to run and test the action in a local development environment.

### Prerequisites

1. Docker
2. Node.js & NPM (optional)

### Building the Docker container

To build a local image, run the following command (from root of repository):
```
docker build -t ns/ai-code-review-action:latest .
```

### Running the container (for testing the action code)

Run the local container as follows (from root of repository):
```
docker run -it --rm -v $(pwd):/workspace --entrypoint /bin/sh --workdir /workspace/app -u $(id -u ${USER}):$(id -g ${USER}) ns/ai-code-review-action:latest
```
Installing the node modules and running the tests within the container:
```
/workspace/app $ npm install
/workspace/app $ npm test
```
