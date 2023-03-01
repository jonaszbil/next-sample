import requests
import os
import json
import time

token, microservice_uuid, region, image, aws_acc_id = os.getenv('ADMIN_TOKEN'), os.getenv(
    'MICROSERVICE'), os.getenv('REGION'), os.getenv('IMAGE'), os.getenv('AWS_ACCOUNT_ID')
if not all([token, microservice_uuid, region, image, aws_acc_id]):
    print('MICROSERVICE, ADMIN_TOKEN, REGION, IMAGE and AWS_ACCOUNT_ID must be set')
    exit(1)

base_url = "https://test2.davra.com"
microservice_url = f"{base_url}/api/v1/serviceadmin/{microservice_uuid}"

headers = {
    "Authorization": f"Bearer {token}", "content-type": "application/json"}

pod_name = requests.get(f"{microservice_url}/status", headers=headers,
                        verify=False).json()['pods'][0]['metadata']['name']

print(pod_name)

service_config = requests.get(microservice_url,
                             headers=headers, verify=False).json()[0]['config']
service_config |= {
    "dockerImage": f"{aws_acc_id}.dkr.ecr.{region}.amazonaws.com/{image}"}
payload = json.dumps({"config": service_config})

# Set blank config first to ensure service is redeployed
# TODO - figure out a less hacky way to force redeployment
requests.patch(microservice_url, {json.dumps({"config": {}})},
               headers=headers, verify=False)

requests.patch(microservice_url, payload,
               headers=headers, verify=False)

# This should force redeployment, but doesn't work for some reason
# print(requests.post(f"{microservice_url}/deploy", {}, headers=headers, verify=False))

new_pod_ready = False
polling_start_time = time.time()

while not new_pod_ready and time.time() - polling_start_time < 300:
    time.sleep(2)
    service_status = requests.get(
        f"{microservice_url}/status", headers=headers, verify=False).json()
    if len(service_status['pods']) != 1:
        continue
    current_pod_name = service_status['pods'][0]['metadata']['name']
    if current_pod_name == pod_name or service_status['pods'][0]['status']['phase'] != 'Running':
        continue
    new_pod_ready = True

if new_pod_ready:
    print('SUCCESS')
else:
    print('TIMED OUT')
    exit(1)
