import React, { useState } from 'react';
import { registerPatient } from '../services/DatabaseService';
import { useDatabaseState } from '../state/DatabaseState';

interface PatientFormData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
}

const initialFormData: PatientFormData = {
  first_name: '',
  last_name: '',
  date_of_birth: '',
  gender: '',
  email: '',
  phone: '',
  address: '',
};

const PatientRegistration: React.FC = () => {
  const { isConfigured } = useDatabaseState();
  const [formData, setFormData] = useState<PatientFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<PatientFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof PatientFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await registerPatient(formData);
      setSubmitSuccess(true);
      setFormData(initialFormData);

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
      setError(null);
    } catch (error) {
      setError('Patient Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PatientFormData> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.date_of_birth.trim()) {
      newErrors.date_of_birth = 'Date of birth is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!isConfigured) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-4 overflow-hidden">

      <div className="mb-3">
        <h1 className="text-3xl font-bold text-gray-900">Patient Registration</h1>
        <p className="text-base text-gray-600 mt-1">Fill out the form to add a new patient.</p>
      </div>

      {submitSuccess && (
        <div className="mb-4 rounded bg-green-100 text-green-800 px-4 py-2 text-sm border border-green-300">
          Patient registered successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block font-medium mb-1" htmlFor="first_name">First Name <span className="text-red-500">*</span></label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              className={`form-input w-full max-w-xs py-3 px-3 rounded border ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.first_name && <p className="text-xs text-red-600 mt-1">{errors.first_name}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="last_name">Last Name <span className="text-red-500">*</span></label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              className={`form-input w-full max-w-xs py-3 px-3 rounded border ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.last_name && <p className="text-xs text-red-600 mt-1">{errors.last_name}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="date_of_birth">Date of Birth <span className="text-red-500">*</span></label>
            <input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
              className={`form-input w-full max-w-xs py-3 px-3 rounded border ${errors.date_of_birth ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.date_of_birth && <p className="text-xs text-red-600 mt-1">{errors.date_of_birth}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="gender">Gender <span className="text-red-500">*</span></label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`form-input w-full max-w-xs py-3 px-3 rounded border ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
            {errors.gender && <p className="text-xs text-red-600 mt-1">{errors.gender}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input w-full max-w-xs py-3 px-3 rounded border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="form-input w-full max-w-xs py-3 px-3 rounded border border-gray-300"
              placeholder=""
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium mb-1" htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className="form-input w-full max-w-xs py-3 px-3 rounded border border-gray-300"
              placeholder="Street, City, State, ZIP"
            />
          </div>
        </div>

        {error && <p className="text-red-600 mt-2">{error}</p>}

        <div className="flex justify-end gap-3 -mt-4">
          <button
            type="button"
            onClick={() => setFormData(initialFormData)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Registering...' : 'Register Patient'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientRegistration;
