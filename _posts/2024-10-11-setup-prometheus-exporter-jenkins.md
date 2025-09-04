---
title: "Setup Prometheus Exporter in Jenkins"
category: Software
tags: 
  - DevOps
  - Developer Journey
  - Prometheus
  - Jenkins
header:
  image: /assets/images/posts/jenkins-prometheus.png
  teaser: /assets/images/posts/jenkins-prometheus.png
comments: true
---
_**Note** This post is part of the [DevOps Journey](/software/devops-journey/)_

To monitor Jenkins with Prometheus, we need to expose Jenkins metrics. Jenkins has a built-in Prometheus metrics endpoint that we can enable.

### Install Prometheus Metrics Plugin

1. Go to Jenkins Dashboard → Manage Jenkins → Manage Plugins
2. Search for "Prometheus metrics" plugin
3. Install and restart Jenkins

![Jenkins Prometheus Plugin]({{ "/assets/images/posts/jenkins-prometheus.png" | absolute_url }})

### Configure Prometheus Metrics

After installation, Jenkins will automatically expose metrics at:
```
http://your-jenkins-url/prometheus/
```

### Access Metrics Endpoint

You can verify the metrics are being exposed by visiting:
```bash
curl http://localhost:8080/prometheus/
```

You should see output like:
```
# HELP jenkins_builds_duration_milliseconds_summary Build times in milliseconds
# TYPE jenkins_builds_duration_milliseconds_summary summary
jenkins_builds_duration_milliseconds_summary{quantile="0.5",} 1234.0
jenkins_builds_duration_milliseconds_summary{quantile="0.95",} 5678.0
```

### Configure Prometheus to Scrape Jenkins

Add Jenkins as a target in your `prometheus.yml`:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'jenkins'
    static_configs:
      - targets: ['localhost:8080']
    metrics_path: '/prometheus'
    scrape_interval: 5s
```

### Key Jenkins Metrics

The plugin exposes various useful metrics:

- **Build Metrics**: `jenkins_builds_duration_milliseconds_summary`
- **Job Metrics**: `jenkins_job_count_total`
- **Queue Metrics**: `jenkins_queue_size_value`
- **Node Metrics**: `jenkins_node_count_value`
- **Executor Metrics**: `jenkins_executor_count_value`

### Restart Prometheus

After updating the configuration:
```bash
docker restart prometheus
```

### Verify in Prometheus UI

1. Open Prometheus UI at http://localhost:9090
2. Go to Status → Targets
3. Verify Jenkins target is "UP"
4. Query some metrics like `jenkins_builds_duration_milliseconds_summary`

![Prometheus Targets]({{ "/assets/images/posts/prometheus-targets.png" | absolute_url }})

### Grafana Dashboard

Import Jenkins dashboard ID `9964` from Grafana's dashboard repository for pre-built Jenkins visualizations.