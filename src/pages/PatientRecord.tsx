import React, { useEffect, useState } from 'react';
import { getAllPatients, searchPatientsByName } from '../services/DatabaseService';
import { useDatabaseState } from '../state/DatabaseState';
import { Search } from 'lucide-react';

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
}

const PatientRecord: React.FC = () => {
  const { isConfigured } = useDatabaseState();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [serachPatient, setserachPatient] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const data = await getAllPatients();
      setPatients(data);
      setError(null);
    } catch (err) {
      setError('Failed to load patients.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConfigured) fetchPatients();
  }, [isConfigured]);

  const handleSearch = async () => {
    if (!serachPatient.trim()) {
      fetchPatients();
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchPatientsByName(serachPatient);
      setPatients(results);
    } catch (err) {
      setError('Failed to perform search:');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConfigured) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 rounded-full border-t-4 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Patient Directory</h1>
        <p className="text-gray-500 mt-2">View and manage all registered patients</p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 mb-10 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute top-2.5 left-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            value={serachPatient}
            onChange={(e) => setserachPatient(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            Search
          </button>
          <button
            onClick={() => {
              setserachPatient('');
              fetchPatients();
            }}
            className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md"
          >
            Reset
          </button>
        </div>
      </div>

      {error && <div className="mb-4 text-red-500 text-center font-medium">{error}</div>}

      <div className="bg-white rounded-lg shadow p-3 max-h-[600px] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-10 w-10 rounded-full border-t-4 border-indigo-500"></div>
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p className="text-lg font-medium">No patients found</p>
            <p className="text-sm mt-2">
              {serachPatient ? 'Please refine your search.' : 'Start by adding new patient records.'}
            </p>
          </div>
        ) : (
          <div className="max-h-[140px] overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {patients.map((patient) => (
                <li
                  key={patient.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-4 px-2 hover:bg-gray-50 transition cursor-pointer"
                >

                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-semibold flex items-center justify-center">
                      {patient.first_name[0]}
                      {patient.last_name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-900 font-semibold truncate">
                        {patient.first_name} {patient.last_name}
                      </p>
                      <p className="text-gray-500 text-sm truncate">
                        {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}, {new Date(patient.date_of_birth).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 sm:mt-0 sm:flex-1 sm:flex sm:justify-center sm:gap-8 text-gray-600 text-sm">
                    <p className="truncate"><span className="font-medium">Email:</span> {patient.email || '—'}</p>
                    <p className="truncate"><span className="font-medium">Phone:</span> {patient.phone || '—'}</p>
                  </div>

                  <div className="mt-2 sm:mt-0 text-gray-500 text-sm whitespace-nowrap sm:text-right">
                    Registration Date <br />
                    {new Date(patient.created_at).toLocaleDateString('en-IN')}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {!isLoading && (
        <div className="mt-8 text-sm text-gray-500 text-center">
          {patients.length} {patients.length === 1 ? 'patient' : 'patients'} listed
        </div>
      )}
    </div>
  );
};

export default PatientRecord;
