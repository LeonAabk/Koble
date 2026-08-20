import urllib.request
import json

url = "https://ogpmuicqbcfyxznxjkto.supabase.co/rest/v1/jobs?select=*"
req = urllib.request.Request(url, method="OPTIONS")
req.add_header('apikey', 'sb_publishable_yBZlKvvzPzBHkQGntQErjQ_uhSC8bKl')
req.add_header('Authorization', 'Bearer sb_publishable_yBZlKvvzPzBHkQGntQErjQ_uhSC8bKl')

try:
    with urllib.request.urlopen(req) as response:
        print(response.headers)
except Exception as e:
    print(e)
