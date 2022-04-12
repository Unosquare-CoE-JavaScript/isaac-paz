import time
import boto3

client = boto3.client('lambda')


def hello(event, context):
    response = client.list_functions()
    return response
