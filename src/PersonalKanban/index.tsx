import React from 'react';

import KanbanBoardContainer from './containers/KanbanBoard';
import ThemeProvider from './providers/ThemeProvider';

interface PersonalKanbanProps {}

export function PersonalKanban() {
  return (
    <ThemeProvider>
      <KanbanBoardContainer />
    </ThemeProvider>
  );
}

export default PersonalKanban;
