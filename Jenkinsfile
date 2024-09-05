import org.jenkinsci.plugins.pipeline.modeldefinition.Utils
pipeline {
    agent none
    environment {
        CLUSTER_STAGING = 'kubernetes-huawei-epro-stg'
        CLUSTER_PROD    = 'kubernetes-huawei-epro-multitenant'
        ENTRYPOINT      = '/home/jenkins/entrypoint/entrypoint.sh'
        BUILDER         = '/home/jenkins/build-epro/build-epro.sh'
        DEPLOY          = '/home/jenkins/deploy/deploy.sh'
    }
    stages {
        stage("are you sure to build dockerfile?") {
            steps {
                script {
                    try {
                        timeout(time: 15, unit: "MINUTES") {
                            input( message: 'build dockerfile', ok: 'deploy')
                        }
                    } catch (Throwable e) {
                        env.SKIP_DEPLOY_IMAGE = "true"
                        echo "Caught ${e.toString()}"
                        error "Failed: ${e.toString()}"
                    }
                }
            }
        }
        stage("build dockerfile") {
            agent {
                kubernetes {
                  cloud "${CLUSTER_STAGING}"
                  inheritFrom 'jenkins-agent'
                }
            }
            steps {
                script {
                    if (env.SKIP_DEPLOY_IMAGE == 'true') {
                        Utils.markStageSkippedForConditional('build dockerfile')
                    } else {
                        container('deployer') {
                            sh "${ENTRYPOINT}"
                            sh "/bin/bash ${BUILDER} belanja-link-pwa"
                        }
                    }
                }
            }
        }
        stage("are you sure to release to a production?") {
            steps {
                script {
                    try {
                        timeout(time: 24, unit: "HOURS") {
                            input( message: 'release to production', ok: 'deploy')
                        }
                    } catch (Throwable e) {
                        env.SKIP_DEPLOY_PROD = "true"
                        echo "Caught ${e.toString()}"
                        Utils.markStageSkippedForConditional('are you sure to release to a production?')
                    }
                }
            }
        }
        stage("release to production") {
            agent {
                kubernetes {
                  cloud "${CLUSTER_PROD}"
                  inheritFrom 'jenkins-agent'
                }
            }
            steps {
                script {
                    if (env.SKIP_DEPLOY_PROD == 'true') {
                        Utils.markStageSkippedForConditional('release to production')
                    } else {
                        container('deployer') {
                            sh "${ENTRYPOINT}"
                            sh "/bin/bash ${DEPLOY} huawei-epro-multitenant belanja-link-pwa belanja"
                        }
                    }
                }
            }
        }
    }
}