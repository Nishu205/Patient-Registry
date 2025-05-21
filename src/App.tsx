import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PatientRegistration from './pages/PatientRegistration';
import PatientQuery from './pages/PatientQuery';
import { DatabaseProvider } from './state/DatabaseState';
import PatientRecord from './pages/PatientRecord';

function App() {
    return (
        <DatabaseProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="register" element={<PatientRegistration />} />
                        <Route path="patients" element={<PatientRecord />} />
                        <Route path="query" element={<PatientQuery />} />
                    </Route>
                </Routes>
            </Router>
        </DatabaseProvider>
    );
}

export default App;
