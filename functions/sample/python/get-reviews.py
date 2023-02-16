#
#
# main() will be run when you invoke this action
#
# @param Cloud Functions actions accept a single parameter, which must be a JSON object.
#
# @return The output of this action, which must be a JSON object.
#
#
import sys
from ibmcloudant.cloudant_v1 import CloudantV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator


def main(param):
    username = ""
    if 'username' in param:
        username = param['username']
    
    apiKey = ""
    if 'apiKey' in param:
        apiKey = param['apiKey']        

    url = ""
    if 'url' in param:
        url = param['url']        
    
    authenticator = IAMAuthenticator(apiKey)
    
    service = CloudantV1(authenticator=authenticator)
    
    service.set_service_url(url)    

    response = service.post_all_docs(
      db='reviews',
      include_docs=True,
    ).get_result()
    
    return { 'documents': response }
