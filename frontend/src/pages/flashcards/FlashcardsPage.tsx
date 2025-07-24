/**
 * ================================================================
 * FLASHCARDS PAGE COMPONENT
 * ================================================================
 */

import React from 'react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import FlashcardList from '../../components/flashcards/FlashcardList';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';

const FlashcardsPage: React.FC = () => {
  const breadcrumbItems = useBreadcrumb();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Main Content */}
      <FlashcardList />
    </div>
  );
};

export default FlashcardsPage;
