---
title: "DevOps Journey"
category: Software
tags: 
  - DevOps
  - Developer Journey
header:
  image: "https://shalb.com/wp-content/uploads/2019/11/Devops1.jpeg"
  caption: "Photo credit: [**https://shalb.com/**](https://shalb.com/wp-content/uploads/2019/11/Devops1.jpeg)"
comments: true
---

### DevOps
DevOps is a set of practices that combines software development (Dev) and IT operations (Ops). It aims to shorten the systems development life cycle and provide continuous delivery with high software quality.

#### Key Principles of DevOps
1. **Collaboration**: Breaking down silos between development and operations teams.
2. **Automation**: Automating repetitive tasks to increase efficiency.
3. **Continuous Integration/Continuous Deployment (CI/CD)**: Ensuring code changes are automatically tested and deployed.
4. **Monitoring and Logging**: Keeping track of performance and issues in real-time.

#### Benefits of DevOps
- **Faster Delivery**: Accelerates the release of new features and bug fixes.
- **Improved Quality**: Automated testing and continuous integration improve code quality.
- **Enhanced Collaboration**: Promotes a culture of shared responsibility and teamwork.
- **Scalability**: Makes it easier to scale applications and infrastructure.

#### Tools Commonly Used in DevOps
- **Version Control**: Git, GitHub
- **CI/CD**: Jenkins, Travis CI
- **Configuration Management**: Ansible, Puppet
- **Containerization**: Docker, Kubernetes
- **Monitoring**: Prometheus, Grafana

By adopting DevOps practices, organizations can achieve faster development cycles, higher deployment frequency, and more dependable releases, all while maintaining high quality.

Since I am really interested in DevOps, my goal is to learn it by practice. I have laid out a basic architecture of what I want to achieve and what technologies I want to be using.

I will be doing this all on my local computer, using docker mostly to avoid enormous costs for learning, I will be sharing which tools I am using and also how to use them and if I learnt something interesting on the way. I will update this journey accordinly with the links to the other posts.

### The DevOps Learning Project

In short words, what I want to learn is to create a complete CI/CD pipeline using:

- **Source Code Management**: Git, GitHub
- **Build Automation**: Maven, Gradle - Android
- **Continuous Integration**: Jenkins, GitHub Actions
- **Containerization**: Docker
- **Container Orchestration**: Kubernetes
- **Configuration Management**: Ansible, Terraform - Optional for now
- **Monitoring and Logging**: Prometheus, Grafana and Kibana
- **Testing**: TBD
- **Integration Testing**: TBD
- **Security**: SonarQube 

#### Scope

My Github project is suposed to have multiple branches and I want a build to run on each commit. Master/main needs to be protected and is only used for production deployment. Other branches build and deploy: alpha/beta releases and also integration tests need to be perfomed.

The first steps it seems would be to setup Jenkins, Github project and then the individual tools for code quality, testing and logging.

