export const fetchCsrfToken = async (
    setError: (errorMessage: string | null) => void
  ): Promise<string> => {
    const tokenJWT = sessionStorage.getItem('tokenJWT');
    if (!tokenJWT) {
      const errorMessage = 'JWT token not found in session storage';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/csrf`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenJWT}`,
        },
        credentials: 'include',
      });
  
      if (!response.ok) {
        const errorMessage = `Failed to fetch CSRF token: ${response.statusText}`;
        setError(errorMessage);
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      setError('Błąd z tokenem CSRF');
      throw error;
    }
  };
  