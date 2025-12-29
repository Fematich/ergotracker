const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "/api" : "api");

// Remove any trailing slash so we can safely append paths
const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");

const buildUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

  if (!API_BASE_URL) {
    return `/${normalizedPath}`;
  }

  if (API_BASE_URL.startsWith("http")) {
    return `${API_BASE_URL}/${normalizedPath}`;
  }

  if (API_BASE_URL.startsWith("/")) {
    return `${API_BASE_URL}/${normalizedPath}`;
  }

  // Relative path (better for Home Assistant ingress)
  return `${API_BASE_URL}/${normalizedPath}`;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(buildUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `API request failed (${response.status}): ${text || response.statusText}`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

interface TrainingSettingsResponse {
  startDate: string | null;
}

interface CompletedWorkoutsResponse {
  completed: { day: number; completed_at: string }[];
}

export async function fetchTrainingSettings(deviceId: string) {
  return request<TrainingSettingsResponse>("training-settings", {
    headers: { "x-device-id": deviceId },
  });
}

export async function saveStartDate(deviceId: string, startDate: string) {
  return request<TrainingSettingsResponse>("training-settings", {
    method: "PUT",
    headers: { "x-device-id": deviceId },
    body: JSON.stringify({ startDate }),
  });
}

export async function fetchCompletedWorkouts(deviceId: string) {
  return request<CompletedWorkoutsResponse>("completed-workouts", {
    headers: { "x-device-id": deviceId },
  });
}

export async function addCompletedWorkout(deviceId: string, day: number) {
  return request<CompletedWorkoutsResponse>("completed-workouts", {
    method: "POST",
    headers: { "x-device-id": deviceId },
    body: JSON.stringify({ day }),
  });
}

export async function removeCompletedWorkout(deviceId: string, day: number) {
  return request<void>(`completed-workouts/${day}`, {
    method: "DELETE",
    headers: { "x-device-id": deviceId },
  });
}
