import React from 'react';
import { render } from 'react-dom';
import DemoApp from './DemoApp';
import './i18n/i18n';

document.addEventListener('DOMContentLoaded', () => {
  render(
    <React.Suspense fallback={<>Loading...</>}>
      <DemoApp />
    </React.Suspense>,
    document.body.appendChild(document.createElement('div'))
  );
});
