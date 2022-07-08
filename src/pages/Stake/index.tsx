import React from 'react';
import { Link } from 'react-router-dom';

export default function StakePage() {
  return (
    <div>
      Stake Page
      <Link to="/position">Position page</Link>
    </div>
  );
}
