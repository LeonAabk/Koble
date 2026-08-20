import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://ogpmuicqbcfyxznxjkto.supabase.co/rest/v1/jobs"
headers = {
    'apikey': 'sb_publishable_yBZlKvvzPzBHkQGntQErjQ_uhSC8bKl',
    'Authorization': 'Bearer sb_publishable_yBZlKvvzPzBHkQGntQErjQ_uhSC8bKl',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}
data = {
    "title": "Pending Job for Testing",
    "category": "Gårdsarbeid",
    "location": "Hamar",
    "email": "leon.aabak@gmail.com",
    "description": "Når: Neste uke\n\nTrenger hjelp med innhøsting",
    "is_approved": False,
    "user_id": "1c22e5f1-5c24-4b58-ad8f-f83cc3fd584a",
    "pay": "100"
}
req = urllib.request.Request(url, headers=headers, data=json.dumps(data).encode('utf-8'))
try:
    with urllib.request.urlopen(req, context=ctx) as response:
        print(response.read().decode())
except Exception as e:
    print(e.read().decode() if hasattr(e, 'read') else e)
