import { App, Stack, StackProps } from '@aws-cdk/cdk';
import { Bucket } from '@aws-cdk/aws-s3';
import {
  Project,
  CodePipelineSource,
  CodePipelineBuildArtifacts,
  PipelineBuildAction,
  LinuxBuildImage,
  ComputeType
} from '@aws-cdk/aws-codebuild';
import { Pipeline, Stage } from '@aws-cdk/aws-codepipeline';
import { PipelineSourceAction, RepositoryRef } from '@aws-cdk/aws-codecommit';
import {
  PipelineCreateReplaceChangeSetAction,
  PipelineExecuteChangeSetAction,
  CloudFormationCapabilities
} from '@aws-cdk/aws-cloudformation';
import { PipelineDeployStackAction } from '@aws-cdk/app-delivery';

interface IPipelineStackProps extends StackProps {
  appName: string;
  environment: string;
  repositoryName: string;
  branchName: string;
}

export class PipelineStack extends Stack {
  constructor(parent: App, name: string, props: IPipelineStackProps) {
    super(parent, name, props);

    const { appName, environment, repositoryName, branchName } = props;

    const serviceStackName = `${appName}-Service-${environment}`;

    const repository = RepositoryRef.import(this, 'Repository', {
      repositoryName
    });

    const artifactBucket = new Bucket(this, 'ArtifactBucket', {
      versioned: true
    });

    const codePipelineSource = new CodePipelineSource();
    const codePipelineBuildArtifacts = new CodePipelineBuildArtifacts();

    const buildEnvironment = {
      buildImage: LinuxBuildImage.UBUNTU_14_04_NODEJS_8_11_0,
      computeType: ComputeType.Small
    };

    const buildProject = new Project(this, 'BuildProject', {
      source: codePipelineSource,
      buildSpec: 'lib/pipeline-stack/buildspec.yml',
      artifacts: codePipelineBuildArtifacts,
      environment: buildEnvironment,
      environmentVariables: {
        NODE_ENV: {
          value: 'development'
        }
      }
    });

    const pipeline = new Pipeline(this, 'Pipeline', {
      artifactBucket,
      restartExecutionOnUpdate: true
    });

    const sourceStage = new Stage(this, 'Source', {
      pipeline
    });

    const fetchSourceAction = new PipelineSourceAction(this, 'FetchSource', {
      stage: sourceStage,
      repository,
      branch: branchName,
      pollForSourceChanges: false,
      outputArtifactName: 'SourceCode'
    });

    const buildStage = new Stage(this, 'Build', {
      pipeline
    });

    const buildAndTestServiceAction = new PipelineBuildAction(this, 'BuildAndTestService', {
      stage: buildStage,
      project: buildProject,
      inputArtifact: fetchSourceAction.outputArtifact,
      outputArtifactName: 'Service'
    });

    const pipelineStage = new Stage(this, 'Update', {
      pipeline
    });

    new PipelineDeployStackAction(this, 'UpdatePipeline', {
      stage: pipelineStage,
      stack: this,
      inputArtifact: buildAndTestServiceAction.outputArtifact,
      adminPermissions: true
    });

    const deployStage = new Stage(this, 'Deploy', {
      pipeline
    });

    new PipelineCreateReplaceChangeSetAction(this, 'CreateReplaceChangeSet', {
      stage: deployStage,
      stackName: serviceStackName,
      changeSetName: serviceStackName,
      capabilities: CloudFormationCapabilities.AnonymousIAM,
      templatePath: buildAndTestServiceAction.outputArtifact.atPath(
        `${serviceStackName}.template.yaml`
      ),
      templateConfiguration: buildAndTestServiceAction.outputArtifact.atPath(
        `${serviceStackName}.params.json`
      ),
      adminPermissions: true,
      runOrder: 1
    });

    new PipelineExecuteChangeSetAction(this, 'ExecuteChangeSet', {
      stage: deployStage,
      stackName: serviceStackName,
      changeSetName: serviceStackName,
      runOrder: 2
    });
  }
}
