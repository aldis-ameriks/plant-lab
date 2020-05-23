import { render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { BackLink } from './BackLink';

describe('BackLink', () => {
  it('renders', () => {
    const result = render(
      <Router>
        <BackLink />
      </Router>
    );
    expect(result.getByTestId('back-link')).toBeVisible();
  });
});
