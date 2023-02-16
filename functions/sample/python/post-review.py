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
from ibmcloudant.cloudant_v1 import Document, CloudantV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator


def getparam(key):
    if key in param:
        return param[key]        
    
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

    car_make = getparam("car_make")
    car_model = getparam("car_model")
    car_year = getparam("car_year")
    dealership = getparam("dealership")
    id = getparam("id")
    name = getparam("name")
    purchase = getparam("purchase")
    purchase_date = getparam("purchasedate")
    review = getparam("review")
    
    review_doc = Document(
        car_make = getparam("car_make"),
        car_model = getparam("car_model"),
        car_year = getparam("car_year"),
        dealership = getparam("dealership"),
        id = getparam("id"),
        name = getparam("name"),
        purchase = getparam("purchase"),
        purchase_date = getparam("purchasedate"),
        review = getparam("review")
    )
    
    response = service.put_document(
      db='reviews',
      document=review_doc
    ).get_result()
    
    return { 'result': response }
