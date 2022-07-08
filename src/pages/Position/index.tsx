import React from 'react';
import { Link } from 'react-router-dom';

export default function PositionPage() {
  return (
    <div className="bg-black text-white">
      Position Page
      <Link to="/stake">Stake page</Link>
    </div>
  );
}
