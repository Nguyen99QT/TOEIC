import React, { useState, useEffect } from 'react';

const DraftIndicator = () => {
  const [hasDraft, setHasDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    // Check if there's a draft saved
    const draft = localStorage.getItem('questionGroupDraft');
    if (draft) {
      setHasDraft(true);
      const savedTime = localStorage.getItem('questionGroupDraftTime');
      if (savedTime) {
        setLastSaved(new Date(savedTime));
      }
    }

    // Update last saved time whenever localStorage changes
    const interval = setInterval(() => {
      const draft = localStorage.getItem('questionGroupDraft');
      if (draft) {
        setHasDraft(true);
        const savedTime = localStorage.getItem('questionGroupDraftTime');
        if (savedTime) {
          setLastSaved(new Date(savedTime));
        }
      } else {
        setHasDraft(false);
        setLastSaved(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!hasDraft) return null;

  return (
    <div className="alert alert-info d-flex align-items-center" role="alert">
      <div className="me-2">💾</div>
      <div>
        <strong>Draft Saved</strong>
        {lastSaved && (
          <small className="d-block text-muted">
            Last saved: {lastSaved.toLocaleTimeString('en-US')}
          </small>
        )}
      </div>
    </div>
  );
};

export default DraftIndicator;
