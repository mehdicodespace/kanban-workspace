export function errorMessage(error) {
  const messages = {
    'auth/invalid-credential': 'The email or password is incorrect.',
    'auth/email-already-in-use': 'An account already exists with this email.',
    'auth/weak-password': 'Use a stronger password with at least 8 characters.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/network-request-failed': 'Unable to connect. Check your connection or VPN and try again.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'permission-denied': 'You do not have access to this data. Please sign in again.',
    unavailable: "Can't reach Firebase. Check your connection or VPN and try again.",
    'deadline-exceeded': "Firebase took too long to respond. Check your connection or VPN and try again."
  }
  return messages[error.code] || error.message || 'Something went wrong. Please try again.'
}
