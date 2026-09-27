// Frontend API Client for HERE Platform
// Communicates with backend endpoints (/api/*) with seamless local persistence fallback

const BASE_URL = '/api';

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const authStored = localStorage.getItem('HERE_AUTH_USER_V1');
    if (authStored) {
      const u = JSON.parse(authStored);
      if (u?.email) {
        headers['x-user-email'] = u.email;
      }
    }
  } catch (e) {
    // ignore
  }
  return headers;
}

export async function apiPostChat({ conversationId, message }) {
  try {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ conversationId, message })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API CLIENT] /api/chat error, falling back to local engine:', err.message);
  }
  return null;
}

export async function apiCheckSafety(message) {
  try {
    const res = await fetch(`${BASE_URL}/safety/check`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // fallback
  }
  return null;
}

export async function apiClassifyML(text) {
  try {
    const res = await fetch(`${BASE_URL}/ml/classify`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // fallback
  }
  return null;
}

export async function apiCreateCase(caseData) {
  try {
    const res = await fetch(`${BASE_URL}/cases`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(caseData)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // fallback
  }
  return null;
}

export async function apiGetCases(query = '') {
  try {
    const res = await fetch(`${BASE_URL}/cases${query ? `?${query}` : ''}`, {
      headers: getHeaders()
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // fallback
  }
  return null;
}

export async function apiGetCase(id) {
  try {
    const res = await fetch(`${BASE_URL}/cases/${id}`, {
      headers: getHeaders()
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // fallback
  }
  return null;
}

export async function apiGetAvailableAppointments(dept = '') {
  try {
    const res = await fetch(`${BASE_URL}/appointments/available${dept ? `?department=${dept}` : ''}`, {
      headers: getHeaders()
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // fallback
  }
  return null;
}

export async function apiBookAppointment(apptData) {
  try {
    const res = await fetch(`${BASE_URL}/appointments/book`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(apptData)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // fallback
  }
  return null;
}

export async function apiCancelAppointment(id) {
  try {
    const res = await fetch(`${BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // fallback
  }
  return null;
}

export async function apiGetWaitlist() {
  try {
    const res = await fetch(`${BASE_URL}/waitlist`, {
      headers: getHeaders()
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // fallback
  }
  return null;
}

export async function apiAcceptWaitlistSwap(waitlistId, acceptSwap = true) {
  try {
    const res = await fetch(`${BASE_URL}/waitlist/accept`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ waitlistId, acceptSwap })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // fallback
  }
  return null;
}

export async function apiGetRecommendedResources() {
  try {
    const res = await fetch(`${BASE_URL}/resources/recommended`, {
      headers: getHeaders()
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // fallback
  }
  return null;
}

export async function apiGetCounsellorCases(counsellorName = '') {
  try {
    const res = await fetch(`${BASE_URL}/counsellor/cases${counsellorName ? `?name=${counsellorName}` : ''}`, {
      headers: getHeaders()
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // fallback
  }
  return null;
}

export async function apiSendCounsellorMessage(caseId, text, counsellorName) {
  try {
    const res = await fetch(`${BASE_URL}/counsellor/cases/${caseId}/message`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text, counsellorName })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // fallback
  }
  return null;
}

export async function apiAcceptCounsellorCase(caseId) {
  try {
    const res = await fetch(`${BASE_URL}/counsellor/cases/${caseId}/accept`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // fallback
  }
  return null;
}

export async function apiGetAdminAnalytics() {
  try {
    const res = await fetch(`${BASE_URL}/admin/analytics`, {
      headers: getHeaders()
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // fallback
  }
  return null;
}
