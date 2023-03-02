import { useState, useEffect } from 'react';

export default function BarcodePage() {
  const [barcodez, setBarcodez] = useState(null);

  useEffect(() => {
    fetch('/api/barcodeimage')
      .then(response => response.json())
      .then(data => setBarcodez(data.barcode));
  }, []);

  return (
    <div>
      {barcode ? (
        <img src={barcodez} width={200} height={100} />
      ) : (
        <p>Loading barcode...</p>
      )}
    </div>
  );
}
