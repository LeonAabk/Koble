import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://ogpmuicqbcfyxznxjkto.supabase.co/rest/v1/jobs?select=*"
headers = {
    'apikey': 'sb_publishable_yBZlKvvzPzBHkQGntQErjQ_uhSC8bKl',
    'Authorization': 'Bearer sb_publishable_yBZlKvvzPzBHkQGntQErjQ_uhSC8bKl',
    'Prefer': 'return=representation'
}
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req, context=ctx) as response:
        print(response.read().decode())
except Exception as e:
    print(e.read().decode() if hasattr(e, 'read') else e)
