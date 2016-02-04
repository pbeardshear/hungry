from bottle import *

import json
import pprint
import sys
import requests
import oauth2


# API Constants
CONSUMER_KEY = 'P26GTaPRtv1oMwoCFz5RRQ'
CONSUMER_SECRET = '8v3xI35dc8A_oY7Tb0c-4YQi-p0'
TOKEN = 'wfNUzk63KVCyo3O_3Xa9eVLqJ0KyupNr'
TOKEN_SECRET = 'NkE7PKugwUhwx_B5o4eEFUMduOA'

consumer = oauth2.Consumer(CONSUMER_KEY, CONSUMER_SECRET)


# Initialize bottle
app = Bottle()



# Initialize routes
@app.get('/')
def home():
  return static_file('peer.html', root='')

@app.get('/host')
def serve_host():
  return static_file('host.html', root='')

@app.get('/testbed')
def serve_testbed():
  return static_file('testbed.html', root='')  


@app.get('/search')
def search():
  params = {
    'term': request.query.term,
    'll': request.query.ll,
    'limit': 20,
    'radius_filter': (request.query.radius or 4000)
  }

  oauth_request = oauth2.Request(
    method = 'GET',
    url = 'https://api.yelp.com/v2/search/',
    parameters = params
  )

  oauth_request.update(
    {
      'oauth_nonce': oauth2.generate_nonce(),
      'oauth_timestamp': oauth2.generate_timestamp(),
      'oauth_token': TOKEN,
      'oauth_consumer_key': CONSUMER_KEY
    }
  )

  token = oauth2.Token(TOKEN, TOKEN_SECRET)
  oauth_request.sign_request(oauth2.SignatureMethod_HMAC_SHA1(), consumer, token)

  signed_url = oauth_request.to_url()

  r = requests.get(signed_url)
  
  return r.json()



# Start webserver
app.run(
  host = '0.0.0.0',
  port = 8000,
  debug = True
)