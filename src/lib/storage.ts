interface OnboardingState {
  websiteUrl: string;
  selectedUrls: string[];
  allUrls: string[];
  timestamp: number;
}

const STORAGE_KEY = 'chatbot_trainer_onboarding';
const EXPIRY_TIME = 24 * 60 * 60 * 1000;

export function saveOnboardingState(state: Omit<OnboardingState, 'timestamp'>): void {
  try {
    const data: OnboardingState = {
      ...state,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save onboarding state:', error);
  }
}

export function loadOnboardingState(): OnboardingState | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const state: OnboardingState = JSON.parse(data);

    if (Date.now() - state.timestamp > EXPIRY_TIME) {
      clearOnboardingState();
      return null;
    }

    return state;
  } catch (error) {
    console.error('Failed to load onboarding state:', error);
    return null;
  }
}

export function clearOnboardingState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear onboarding state:', error);
  }
}
