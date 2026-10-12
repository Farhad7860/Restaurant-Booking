import { useState, useEffect } from 'react';
export const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setDebugInfo('Fetching menu items...');
        console.log('🔍 Starting menu fetch...');

        const response = await fetch('http://localhost:5000/api/menu', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', response.headers);

        const text = await response.text();
        console.log('📡 Raw response:', text);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${text}`);
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          console.error('❌ Failed to parse JSON:', parseErr);
          throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
        }

        console.log('✅ Parsed data:', data);

        // Handle different response formats
        let items = [];
        if (Array.isArray(data)) {
          items = data;
        } else if (data.data && Array.isArray(data.data)) {
          items = data.data;
        } else if (data.items && Array.isArray(data.items)) {
          items = data.items;
        }

        console.log('✅ Final items:', items);
        setMenuItems(items);
        setDebugInfo(`Successfully loaded ${items.length} items`);
        setError('');
      } catch (err) {
        console.error('❌ Error:', err);
        setError(err.message);
        setDebugInfo(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Menu Page</h1>
      
      {/* Debug Info Box */}
      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '15px', 
        marginBottom: '20px',
        borderRadius: '5px',
        border: '1px solid #ddd'
      }}>
        <h3>Debug Info:</h3>
        <p><strong>Status:</strong> {loading ? '⏳ Loading...' : '✅ Done'}</p>
        <p><strong>Items found:</strong> {menuItems.length}</p>
        <p><strong>Message:</strong> {debugInfo}</p>
        {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2>⏳ Loading Menu...</h2>
          <p>Check console (F12) for details</p>
        </div>
      )}

      {error && !loading && (
        <div style={{ 
          backgroundColor: '#ffcccc', 
          padding: '20px', 
          borderRadius: '5px',
          border: '1px solid red'
        }}>
          <h2>❌ Error Loading Menu</h2>
          <p>{error}</p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            Check the Network tab (F12) to see the API response
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && menuItems.length > 0 && (
        <div>
          <h2>Menu Items ({menuItems.length})</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {menuItems.map(item => (
              <div key={item._id} style={{ 
                border: '1px solid #ddd', 
                padding: '15px', 
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p><strong>Price: ${item.price}</strong></p>
                <p>Category: {item.category}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && menuItems.length === 0 && (
        <div style={{ 
          backgroundColor: '#ffffcc', 
          padding: '20px', 
          borderRadius: '5px',
          border: '1px solid orange'
        }}>
          <h2>⚠️ No Menu Items Found</h2>
          <p>The API responded successfully but returned no items.</p>
          <p>Check your database in MongoDB Compass to ensure items exist.</p>
        </div>
      )}
    </div>
  );
};