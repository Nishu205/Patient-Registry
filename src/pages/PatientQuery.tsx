import React, { useState } from 'react';
import { executeQuery } from '../services/DatabaseService';
import { useDatabaseState } from '../state/DatabaseState';

interface QueryResult {
  success: boolean;
  data: any[];
  error: string | null;
}

const PatientQuery: React.FC = () => {
  const { isConfigured } = useDatabaseState();
  const [sqlCommand, setsqlCommand] = useState<string>('SELECT * FROM patients');
  const [sqlResult, setSqlResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const handleCommandChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setsqlCommand(e.target.value);
  };

  const handleQueryExecution = async () => {
    if (!sqlCommand.trim()) return;
    setIsExecuting(true);
    try {
      const result = await executeQuery(sqlCommand);
      if (!result.success && result.error) {
        let friendlyMessage = "Query not valid";
        if (
          result.error.includes("syntax error") ||
          result.error.includes("unexpected") ||
          result.error.includes("parse error")
        ) {
          friendlyMessage = "Please write a proper SQL query.";
        }

        setSqlResult({
          success: false,
          data: [],
          error: friendlyMessage,
        });
      } else {
        setSqlResult(result);
      }
    } catch (error: any) {
      setSqlResult({
        success: false,
        data: [],
        error: error.message || "An error occurred while executing the query",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  if (!isConfigured) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const formatToIndianDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white px-8 sm:px-12 lg:px-7 py-8 shadow-lg rounded-2xl max-w-6xl mx-auto mt-6 font-poppins border border-gray-200">

      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Patient Database Query</h1>
        <p className="text-base text-gray-600 mt-1">
          Execute custom queries on the patient database.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 bg-white rounded-lg shadow p-4 flex flex-col">
          <label htmlFor="sqlCommand" className="text-sm font-medium text-gray-700 mb-2">SQL Query</label>
          <textarea
            id="sqlCommand"
            rows={8}
            className="w-full border border-gray-300 rounded-md p-2 font-mono text-sm resize-none focus:ring focus:ring-blue-300"
            value={sqlCommand}
            onChange={handleCommandChange}
          />

          <button
            type="button"
            onClick={handleQueryExecution}
            disabled={isExecuting}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-50"
          >
            {isExecuting ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                </svg>
                Running...
              </>
            ) : (
              <>
                Run Query
              </>
            )}
          </button>

          {sqlResult?.error && (
            <p className="mt-4 text-sm text-red-600">{sqlResult.error}</p>
          )}
        </div>

        <div className="col-span-1 lg:col-span-2 bg-white rounded-lg shadow p-4 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-md font-semibold text-gray-700">Results</h2>
            <div className="flex space-x-2">
            </div>
          </div>

          {sqlResult?.success && sqlResult.data.length > 0 ? (
            <div className="overflow-auto max-h-[500px]">
              <table className="min-w-full text-sm border border-gray-200">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    {Object.keys(sqlResult.data[0]).map((key) => (
                      <th key={key} className="px-4 py-2 text-left font-medium text-gray-700">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sqlResult.data.map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {Object.entries(row).map(([key, value], colIndex) => {
                        let displayValue: React.ReactNode;
                        if (value === null) {
                          displayValue = <span className="text-gray-400 italic">null</span>;
                        } else if (
                          key === 'created_at' || key === 'date_of_birth'
                        ) {
                          displayValue = formatToIndianDate(value as string);
                        } else if (
                          typeof value === 'string' &&
                          /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value)
                        ) {
                          displayValue = formatToIndianDate(value);
                        } else if (typeof value === 'object') {
                          displayValue = JSON.stringify(value);
                        } else {
                          displayValue = String(value);
                        }
                        return (
                          <td key={colIndex} className="px-4 py-2 text-gray-700 whitespace-nowrap">
                            {displayValue}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 text-xs text-gray-500">
                Showing {sqlResult.data.length} {sqlResult.data.length === 1 ? 'record' : 'records'}
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-sm italic">Run a query to display data.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientQuery;
