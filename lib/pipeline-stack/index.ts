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
  public repository: RepositoryRef;
  public artifactBucket: Bucket;
  public buildProject: Project;
  public pipeline: Pipeline;
  public sourceStage: Stage;
  public fetchSourceAction: PipelineSourceAction;
  public buildStage: Stage;
  public buildAndTestServiceAction: PipelineBuildAction;
  public updateStage: Stage;
  public pipelineDeployStackAction: PipelineDeployStackAction;
  public deployStage: Stage;
  public pipelineCreateReplaceChangeSetAction: PipelineCreateReplaceChangeSetAction;
  public pipelineExecuteChangeSetAction: PipelineExecuteChangeSetAction;

  constructor(parent: App, name: string, props: IPipelineStackProps) {
    super(parent, name, props);

    const { appName, environment, repositoryName, branchName } = props;
    const serviceStackName = `${appName}-Service-${environment}`;

    this.repository = RepositoryRef.import(this, 'Repository', {
      repositoryName
    });

    this.artifactBucket = new Bucket(this, 'ArtifactBucket', {
      versioned: true
    });

    this.buildProject = new Project(this, 'BuildProject', {
      source: new CodePipelineSource(),
      buildSpec: 'lib/pipeline-stack/buildspec.yml',
      artifacts: new CodePipelineBuildArtifacts(),
      environment: {
        buildImage: LinuxBuildImage.UBUNTU_14_04_NODEJS_8_11_0,
        computeType: ComputeType.Small
      },
      environmentVariables: {
        NODE_ENV: {
          value: 'development'
        }
      }
    });

    this.pipeline = new Pipeline(this, 'Pipeline', {
      artifactBucket: this.artifactBucket,
      restartExecutionOnUpdate: true
    });

    this.sourceStage = new Stage(this, 'Source', {
      pipeline: this.pipeline
    });

    this.fetchSourceAction = new PipelineSourceAction(this, 'FetchSource', {
      stage: this.sourceStage,
      repository: this.repository,
      branch: branchName,
      pollForSourceChanges: false,
      outputArtifactName: 'SourceCode'
    });

    this.buildStage = new Stage(this, 'Build', {
      pipeline: this.pipeline
    });

    this.buildAndTestServiceAction = new PipelineBuildAction(this, 'BuildAndTestService', {
      stage: this.buildStage,
      project: this.buildProject,
      inputArtifact: this.fetchSourceAction.outputArtifact,
      outputArtifactName: 'Service'
    });

    this.updateStage = new Stage(this, 'Update', {
      pipeline: this.pipeline
    });

    this.pipelineDeployStackAction = new PipelineDeployStackAction(this, 'UpdatePipeline', {
      stage: this.updateStage,
      stack: this,
      inputArtifact: this.buildAndTestServiceAction.outputArtifact,
      adminPermissions: true
    });

    this.deployStage = new Stage(this, 'Deploy', {
      pipeline: this.pipeline
    });

    this.pipelineCreateReplaceChangeSetAction = new PipelineCreateReplaceChangeSetAction(
      this,
      'CreateReplaceChangeSet',
      {
        stage: this.deployStage,
        stackName: serviceStackName,
        changeSetName: serviceStackName,
        capabilities: CloudFormationCapabilities.AnonymousIAM,
        templatePath: this.buildAndTestServiceAction.outputArtifact.atPath(
          `${serviceStackName}.template.yaml`
        ),
        templateConfiguration: this.buildAndTestServiceAction.outputArtifact.atPath(
          `${serviceStackName}.params.json`
        ),
        adminPermissions: true,
        runOrder: 1
      }
    );

    this.pipelineExecuteChangeSetAction = new PipelineExecuteChangeSetAction(
      this,
      'ExecuteChangeSet',
      {
        stage: this.deployStage,
        stackName: serviceStackName,
        changeSetName: serviceStackName,
        runOrder: 2
      }
    );
  }
}
