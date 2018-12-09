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

export class PipelineStack extends Stack {
  constructor(parent: App, name: string, props?: StackProps) {
    super(parent, name, props);

    const repository = RepositoryRef.import(this, 'Repository', {
      repositoryName: 'hello-world-cdk'
    });

    const branchName = 'master';

    const artifactBucket = new Bucket(this, 'ArtifactBucket', {
      versioned: true
    });

    const codePipelineSource = new CodePipelineSource();
    const codePipelineBuildArtifacts = new CodePipelineBuildArtifacts();

    const buildEnvironment = {
      buildImage: LinuxBuildImage.UBUNTU_14_04_NODEJS_8_11_0,
      computeType: ComputeType.Small
    };

    const testProject = new Project(this, 'TestProject', {
      source: codePipelineSource,
      buildSpec: 'lib/pipeline-stack/testspec.yml',
      artifacts: codePipelineBuildArtifacts,
      environment: buildEnvironment,
      environmentVariables: {
        NODE_ENV: {
          value: 'development'
        }
      }
    });

    const buildProject = new Project(this, 'BuildProject', {
      source: codePipelineSource,
      buildSpec: 'lib/pipeline-stack/buildspec.yml',
      artifacts: codePipelineBuildArtifacts,
      environment: buildEnvironment,
      environmentVariables: {
        NODE_ENV: {
          // TODO: would prefer to build app in production mode
          // value: 'production'
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

    const testStage = new Stage(this, 'Test', {
      pipeline
    });

    new PipelineBuildAction(this, 'RunUnitTests', {
      stage: testStage,
      project: testProject,
      inputArtifact: fetchSourceAction.outputArtifact,
      outputArtifactName: 'UnitTestResults'
    });

    const buildStage = new Stage(this, 'Build', {
      pipeline
    });

    new PipelineBuildAction(this, 'BuildApp', {
      stage: buildStage,
      project: buildProject,
      inputArtifact: fetchSourceAction.outputArtifact,
      outputArtifactName: 'App'
    });
  }
}
