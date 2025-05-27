import requests
import json
from config import Config

LYZR_API_KEY = Config.LYZR_API_KEY


def query_lyzr_agent(message, agent_id, session_id):
    url = Config.LYZR_API_URL
    payload = json.dumps({
        "user_id": Config.USER_ID,
        "agent_id": agent_id,
        "session_id": session_id,
        "message": message
    })
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': LYZR_API_KEY
    }
    response = requests.post(url, headers=headers, data=payload)
    response = response.text
    result = json.loads(response)
    result_text = result["response"]
    return result_text
