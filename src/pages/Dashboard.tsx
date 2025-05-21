import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Search, Users } from 'lucide-react';
import { getAllPatients } from '../services/DatabaseService';
import { useDatabaseState } from '../state/DatabaseState';

const Dashboard: React.FC = () => {
  const { isDataLoading, isConfigured, error } = useDatabaseState();
  const [patientCount, setPatientCount] = useState<number>(0);
  const [isError, setIsError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (isConfigured) {
        try {
          const patients = await getAllPatients();
          setPatientCount(patients.length);
          setIsError(null);
        } catch (err) {
          setIsError('Failed to load dashboard data:');
        }
      }
    };
    loadData();
  }, [isConfigured]);

  if (isDataLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded-md max-w-xl mx-auto mt-10 shadow-md font-poppins text-sm">
        <div className="flex items-center">
          <svg
            className="h-5 w-5 text-red-600 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-red-700 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white-50 px-6 sm:px-10 lg:px-20 py-4 pt-10 font-poppins max-w-6xl mx-auto rounded-xl shadow-sm mt-12">

      <header className="max-w-7xl mx-auto mb-5 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          Welcome to MediBuddy Dashboard
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mb-13">
          Your trusted partner in digital patient care.
        </p>
      </header>

      {isError && (
        <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded-md max-w-xl mx-auto mb-6 shadow-md text-sm">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-red-600 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-red-700 font-semibold">{isError}</p>
          </div>
        </div>
      )}

      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-white shadow rounded-lg p-4 flex items-center space-x-4 hover:shadow-md transition-shadow cursor-default min-h-[140px]">
          <div className="flex-shrink-0 bg-pink-300 text-pink-800 rounded-full p-2 shadow">
            <Users size={35} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              Total Patient Entries
            </h3>
            <dd className="text-xl font-semibold text-gray-900 mt-3">{patientCount}</dd>
          </div>
        </div>

        <Link
          to="/register"
          className="bg-white shadow rounded-lg p-4 flex items-center space-x-4 hover:shadow-md transition-shadow min-h-[100px]"
        >
          <div className="flex-shrink-0 bg-amber-300 text-amber-800 rounded-full p-2 shadow">
            <UserPlus size={35} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              Register New Patient
            </h3>
            <p className="text-gray-600 text-base mt-1.5 max-w-xs">
              Onboard new patients quickly and easily.
            </p>
          </div>
        </Link>

        <Link
          to="/query"
          className="bg-white shadow rounded-lg p-4 flex items-center space-x-4 hover:shadow-md transition-shadow min-h-[100px]"
        >
          <div className="flex-shrink-0 bg-indigo-300 text-indigo-900 rounded-full p-2 shadow">
            <Search size={35} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              Query Patient Records
            </h3>
            <p className="text-gray-600 text-base mt-1.5 max-w-xs">
              Explore patient data through custom queries.
            </p>
          </div>
        </Link>
      </section>
    </div>
  );
};

export default Dashboard;
