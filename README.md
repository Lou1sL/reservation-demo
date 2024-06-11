
Docker + NodeJS + Typescript + Couchbase + GQL + Cucumber + React demo FE SPA


### Step 1: Build and deploy the project
```bash
docker compose build && docker compose up -d
```
Watch for port conflicts

### Step 2: Setup DB
Couchbase: http://localhost:8091

Create Cluster
| | |
| -------- | ------- |
| Cluster name | reservation |
| Admin username | root |
| password | 123456 |

Buckets >> Add Bucket
| | |
| -------- | ------- |
| Bucket name | reservation |

### Step 3: Restart Docker After DB initialization done
```bash
docker compose restart
```
### Step 4
FE: http://localhost:3001
| Basic Auth | |
| -------- | ------- |
| Employee username | 1 |
| Employee password | 1 |


BE: http://localhost:3000/graphql


