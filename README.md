# Sample Davra microservice project
This project contains a sample Next.js microservice and automated workflows for deployments and testing.

## Overview
Deployment and testing are handled by GitHub Actions. In this example, the workflows run when code is pushed to the `staging` branch.
When that happens, 2 separate workflows are activated:
1. **Chromatic tests** - This workflow will build storybook for the UI components and compare the snapshots with the saved baselines. If any changes are detected, they need to be manually approved before merging.
2. **Deployment to staging & testing** - This workflow is split into 4 stages and will not progress to the next one if any of the previous ones fail. The steps are:
- Unit tests with Jest & DOM Testing Library
- Building a new Docker image
- Deploying the Docker image to staging
- Running Playwright tests against the deployed microservice

## Prerequisites
To set this project up you will need:
- AWS ECR access
- A tenant with a Docker microservice on it. The microservice needs a route and the Docker registry secret configured. The registry secret should allow pulling images from AWS.

## Setup
### Environment
First, the environment itself needs to be configured on GitHub. Open the repo and go to `Settings` > `Environments`, then click `New environment`.
Name your environment and specify the deployment branch. If it's _not_ called `staging`, the workfows in `.github/workflows` will need to be adjusted. More than one envs can be configured, so workflows for `staging` can coexist with other branches.

Once the branch is selected, environment variables have to be configured. Sensitive data should be set under `Environment secrets`, other variables can be set as `Environment variables`. The 2 required variables are:
1. `BASE_URL` - url for the deployed microservice, e.g. `https://sampleapp-test2.apps.eu2.davra.com`
2. `TENANT_URL` - url for the tenant on which the microservice lives, e.g. `https://test2.davra.com`

With the variables set, it should look something like this:
<img width="791" alt="Screenshot 2023-12-04 at 09 19 09" src="https://github.com/jonaszbil/next-sample/assets/79643069/ff694c90-a1b3-46e0-99a8-6b9fd76baec8">

### Project secrets
Once the env-specific variables are set, project-wide secrets need to be set. Go to `Settings` > `Secrets and variables` > `Actions`. Six secrets need to be set under `Repository secrets`:
1. `ADMIN_TOKEN` - use an admin token from the same tenant where your microservice lives. If the project is meant to handle deployments to various tenants, this should be saved as an `Environment secret` instead, so that each workflow can use the correct token for its env.
2. `AWS_ACCESS_KEY_ID` - Use [AWS security credentials](https://docs.aws.amazon.com/IAM/latest/UserGuide/security-creds.html). Must have access to ECR to push the Docker image.
3. `AWS_ACCOUNT_ID` - see above
4. `AWS_SECRET_ACCESS_KEY` - see above
5. `MICROSERVICE` - UUID of your Docker microservice
6. `CHROMATIC_PROJECT_TOKEN` - [Setup a new Chromatic project](https://www.chromatic.com/docs/setup/#:~:text=Select%20%E2%80%9CCreate%20a%20project%E2%80%9D%20and,of%20the%20underlying%20git%20provider.) to get the token.

With that set, the project is ready to go.

# Limitations
This project is an unfinished proof of concept and some things would need to be ironed out before it's production-ready. To name a few:
- Old Docker images are kept indefinitely. To avoid racking up AWS bills, a strategy for clearing out old images from ECR should be put in place.
- Deployment script will fail if the image being deployed is the same one as the currently deployed one. Since the images are tagged with the build number, the script **will always fail when re-running a failed run** (build number stays the same, so a new image with the same tag would be created). Better strategy for image tagging should resolve this problem.
- Testing reports are not archived, so only the console output can be inspected. To keep detailed reports from Playwright, adjust the workflow to archive the test-results folder after running the tests.
- The proposed workflow is not entirely suitable for production - it provides a base that can be expanded upon, but only covers a single environment and doesn't enforce merging restrictions. Here's an example of how this could be set up in production:
  1. Create a prod deployment branch. It could be `main` or any other branch that works for you. Pushes to that branch should be restricted and result in a deployment to prod. E.g. require a PR to merge anything to that branch and all the checks must pass before the merge is allowed. 
  2. Decide when to run deployments and tests. If pushing to staging frequently is desired without causing constant redeployments, change the workflow to trigger the workflows when a PR to `main` is created instead of acting on every change on `staging`. That way devs can push whatever they want to staging and once they're happy with it, create a PR that will deploy and test those changes.
  3. Pick and choose what to keep from this template. The app itself doesn't matter much and a similar template could be created with Vue instead of Next. Storybook/Chromatic can be kept or not, depending on whether it brings any value to the team. Unit testing framework can be changed to something the dev team is familiar with. And so on.
