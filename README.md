# Getting Started

```bash
# local dev tasks
nvm use
npm test
npm run build
npm run service:deploy

# deploy production pipeline
npm run pipeline:deploy
```

# Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
