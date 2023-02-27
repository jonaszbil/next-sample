import requests
import os
import json
import time

token, microservice_uuid, region, image, aws_acc_id = os.getenv('ADMIN_TOKEN'), os.getenv(
    'MICROSERVICE'), os.getenv('REGION'), os.getenv('IMAGE'), os.getenv('AWS_ACCOUNT_ID')
if not os.getenv('MICROSERVICE') or not os.getenv('ADMIN_TOKEN'):
    print('MICROSERVICE, ADMIN_TOKEN, REGION, IMAGE and AWS_ACCOUNT_ID must be set')
    exit(1)

baseUrl = "https://test2.davra.com"
microservice_url = f"{baseUrl}/api/v1/serviceadmin/{microservice_uuid}"

headers = {
    "Authorization": f"Bearer {token}", "content-type": "application/json"}

pod_name = requests.get(f"{microservice_url}/status", headers=headers,
                        verify=False).json()['pods'][0]['metadata']['name']

print(pod_name)

serviceConfig = requests.get(microservice_url,
                             headers=headers, verify=False).json()[0]['config']
serviceConfig |= {
    "dockerImage": f"{aws_acc_id}.dkr.ecr.{region}.amazonaws.com/{image}"}
payload = json.dumps({"config": serviceConfig})
requests.patch(microservice_url, payload,
               headers=headers, verify=False)

print(requests.post(f"{microservice_url}/deploy", {}, headers=headers, verify=False))

newPodReady = False
polling_start_time = time.time()

while not newPodReady and time.time() - polling_start_time < 300:
    time.sleep(1)
    service_status = requests.get(
        f"{microservice_url}/status", headers=headers, verify=False).json()
    if len(service_status['pods']) != 1:
        print('Only 1 pods should be present')
        continue
    current_pod_name = service_status['pods'][0]['metadata']['name']
    if current_pod_name == pod_name:
        print('Still using the old pod')
        continue
    if service_status['pods'][0]['status']['phase'] != 'Running':
        print('Pod is not running')
        continue
    newPodReady = True

if newPodReady:
    print('SUCCESS')
else:
    print('TIMED OUT')
