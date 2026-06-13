# ELIMU Infrastructure

## AWS ECS (Fargate) Deployment

### Prerequisites

1. AWS account with ECS, ECR, and Secrets Manager access
2. ECR repository: `elimu-api`
3. ECS cluster: `rald-elimu-cluster`
4. ECS service: `elimu-api-service`
5. IAM roles: `ecsTaskExecutionRole`, `ecsTaskRole`

### Secrets (AWS Secrets Manager)

Store these as secrets in `eu-west-1`:

| Secret name | Description |
|---|---|
| `elimu/DATABASE_URL` | PostgreSQL connection string |
| `elimu/ISSUER_URL` | RALD Auth OIDC issuer URL |
| `elimu/REPL_ID` | RALD Auth client ID |

### GitHub Secrets required

| Secret | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | AWS IAM key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret |

### Setup ECR repository

```bash
aws ecr create-repository --repository-name elimu-api --region eu-west-1
```

### Push task definition

Update `ACCOUNT_ID` in `task-definition.json`, then:

```bash
aws ecs register-task-definition --cli-input-json file://infra/task-definition.json
```

### Database migrations

```bash
DATABASE_URL=<your-db-url> pnpm --filter @workspace/db run push
```
