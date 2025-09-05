---
title: "Setup SonarQube with Jenkins"
category: DevOps
tags: 
  - devops
  - sonarqube
  - jenkins
  - code-quality
  - automation
header:
  image: /assets/images/posts/sonarqube-jenkins.png
  teaser: /assets/images/posts/sonarqube-jenkins.png
comments: true
---
_**Note** This post is part of the [DevOps Journey](/software/devops-journey/)_

SonarQube provides continuous inspection of code quality through static analysis. Let's integrate it with Jenkins for automated code quality checks.

### Run SonarQube with Docker

Start SonarQube using Docker:

```bash
docker run -d --name sonarqube \
  -p 9000:9000 \
  -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true \
  sonarqube:latest
```

Wait for SonarQube to start (check logs with `docker logs sonarqube`), then access it at http://localhost:9000

**Default credentials:** admin/admin (change on first login)

### Install SonarQube Scanner Plugin in Jenkins

1. Go to Jenkins Dashboard → Manage Jenkins → Manage Plugins
2. Search for "SonarQube Scanner" plugin
3. Install and restart Jenkins

### Configure SonarQube Server in Jenkins

1. Navigate to Manage Jenkins → Configure System
2. Scroll to "SonarQube servers" section
3. Click "Add SonarQube"
4. Configure:
   - Name: `SonarQube`
   - Server URL: `http://localhost:9000`
   - Server authentication token: (generate in SonarQube)

### Generate SonarQube Token

1. Login to SonarQube (http://localhost:9000)
2. Go to User → My Account → Security
3. Generate a new token
4. Copy the token for Jenkins configuration

![SonarQube Token Generation]({{ "/assets/images/posts/sonarqube-token.png" | absolute_url }})

### Add Token to Jenkins

1. In Jenkins SonarQube configuration, click "Add" next to Server authentication token
2. Select "Secret text"
3. Paste the SonarQube token
4. Give it an ID like `sonarqube-token`

![SonarQube Jenkins Integration]({{ "/assets/images/posts/sonarqube-jenkins.png" | absolute_url }})

### Configure SonarQube Scanner

1. Go to Manage Jenkins → Global Tool Configuration
2. Scroll to "SonarQube Scanner"
3. Click "Add SonarQube Scanner"
4. Name: `SonarQube Scanner`
5. Install automatically from Maven Central

### Create Pipeline with SonarQube Analysis

```groovy
pipeline {
    agent any
    
    environment {
        SCANNER_HOME = tool 'SonarQube Scanner'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        $SCANNER_HOME/bin/sonar-scanner \
                        -Dsonar.projectKey=my-project \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://localhost:9000 \
                        -Dsonar.login=$SONAR_AUTH_TOKEN
                    '''
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
}
```

### Project-specific Configuration

Create `sonar-project.properties` in your project root:

```properties
sonar.projectKey=my-project-key
sonar.projectName=My Project
sonar.projectVersion=1.0
sonar.sources=src
sonar.language=java
sonar.sourceEncoding=UTF-8
```

### Quality Gates

SonarQube Quality Gates ensure code meets quality standards before deployment. Configure thresholds for:

- Code coverage
- Duplicated lines
- Maintainability rating
- Reliability rating
- Security rating

The pipeline will fail if quality gate conditions aren't met, preventing poor quality code from being deployed.