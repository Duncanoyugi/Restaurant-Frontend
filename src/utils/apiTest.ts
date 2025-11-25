export const testBackendConnection = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/health');
    if (response.ok) {
      console.log('✅ Backend connection successful');
      return true;
    } else {
      console.log('❌ Backend connection failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Backend connection error:', error);
    return false;
  }
};