import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ActivityForm from './components/ActivityForm';
import ActivityLog from './components/ActivityLog';
import ActivitySummary from './components/ActivitySummary';
import { useActivityStorage } from './hooks/useActivityStorage';

function App() {
  const { 
    logs, 
    summary, 
    dailySummaries, 
    addActivityLog, 
    clearLogs,
    updateActivityRate,
    getActivityRate
  } = useActivityStorage();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ActivityForm 
              onActivityComplete={addActivityLog}
              onUpdateRate={updateActivityRate}
              getActivityRate={getActivityRate}
            />
          </div>
          
          <div className="md:col-span-2 lg:col-span-2">
            <div className="grid grid-cols-1 gap-6">
              <ActivityLog logs={logs} />
              <ActivitySummary 
                summary={summary} 
                dailySummaries={dailySummaries}
                onClearLogs={clearLogs}
                logs={logs}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;