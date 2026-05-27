import React, { useState } from 'react';

const UniversityList = () => {
  const [view, setView] = useState('list');
  const [formData, setFormData] = useState({ fullName: "", universityName: "", emailPrefix: "" });

  // 1. MOCK DATABASE
  const [registeredStudents, setRegisteredStudents] = useState([
    { id: 101, name: "Manish Pandit", university: "Medi-Caps University", email: "manish@medicaps.ac.in" },
    { id: 102, name: "Rahul Sharma", university: "Medi-Caps University", email: "rahul@medicaps.ac.in" },
    { id: 103, name: "Alice Johnson", university: "Stanford University", email: "alice@stanford.edu" },
    { id: 104, name: "Arjun Rao", university: "IIT Bombay", email: "arjun@iitb.ac.in" },
  ]);

  // 2. DYNAMIC LOGIC
  const getUniversityStats = () => {
    const stats = {};
    registeredStudents.forEach(student => {
      if (!stats[student.university]) {
        stats[student.university] = {
          name: student.university,
          activeCount: 0,
          domain: student.email.split('@')[1]
        };
      }
      stats[student.university].activeCount += 1;
    });
    return Object.values(stats);
  };

  const activeUniversities = getUniversityStats();

  // Centralized Back Function
  const handleBack = () => {
    setFormData({ fullName: "", universityName: "", emailPrefix: "" });
    setView('list');
  };

  // 3. REGISTRATION LOGIC
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const newStudent = {
      id: Date.now(),
      name: formData.fullName,
      university: formData.universityName,
      email: `${formData.emailPrefix}@hub.edu`
    };

    setRegisteredStudents([...registeredStudents, newStudent]);
    alert(`Welcome! ${formData.universityName} hub updated.`);
    handleBack();
  };

  // CLEAN NAVBAR COMPONENT
  const Navbar = ({ title, showBack = false }) => (
    <header style={styles.header}>
      <div style={styles.navLeft}>
        {showBack && (
          <button onClick={handleBack} style={styles.backBtn} aria-label="Go back">
            ←
          </button>
        )}
        <h2 style={styles.title}>{title}</h2>
      </div>
    </header>
  );

  // VIEW 1: DIRECTORY
  const ListView = () => (
    <div style={styles.container}>
      <Navbar title="Intervarsity Hub" />
      <p style={styles.subtitle}>Showing hubs generated from current student registrations.</p>
      
      <div style={styles.grid}>
        {activeUniversities.map((uni, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.badge}>{uni.activeCount} Active Students</div>
            <h3 style={styles.uniName}>{uni.name}</h3>
            <code style={styles.codeTag}>@{uni.domain}</code>
            <div style={styles.divider} />
            <p style={styles.activeLabel}>Status: Verified Hub</p>
          </div>
        ))}
      </div>

      <button onClick={() => setView('register')} style={styles.fab}>
        + Register My University
      </button>
    </div>
  );

  // VIEW 2: REGISTRATION
  const RegisterView = () => (
    <div style={styles.container}>
      <Navbar title="New Registration" showBack={true} />
      <div style={styles.formCard}>
        <h3>Activate Your Hub</h3>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '25px' }}>
          Entering your university name here will automatically list it in the Intervarsity Hub.
        </p>
        
        <form onSubmit={handleRegisterSubmit} style={styles.form}>
          <input 
            type="text" placeholder="Your Full Name" style={styles.input} required 
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          />
          <input 
            type="text" placeholder="Exact University Name" style={styles.input} required 
            value={formData.universityName}
            onChange={(e) => setFormData({...formData, universityName: e.target.value})}
          />
          <div style={styles.emailWrapper}>
            <input 
              type="text" placeholder="Official Username" style={styles.inputEmail} required 
              value={formData.emailPrefix}
              onChange={(e) => setFormData({...formData, emailPrefix: e.target.value})}
            />
            <span style={styles.domainTag}>@edu.in</span>
          </div>
          <button type="submit" style={styles.submitBtn}>Verify & Activate Hub</button>
        </form>
      </div>
    </div>
  );

  return (
    <div style={styles.wrapper}>
      {view === 'list' ? <ListView /> : <RegisterView />}
    </div>
  );
};

const styles = {
  wrapper: { fontFamily: '-apple-system, sans-serif', backgroundColor: '#f4f7fe', minHeight: '100vh', padding: '40px 20px' },
  container: { maxWidth: '900px', margin: '0 auto', position: 'relative' },
  header: { display: 'flex', alignItems: 'center', marginBottom: '30px' },
  navLeft: { display: 'flex', alignItems: 'center', gap: '15px' },
  title: { color: '#1e293b', fontWeight: '800', fontSize: '24px', margin: 0 },
  subtitle: { textAlign: 'center', marginBottom: '40px', color: '#64748b', fontSize: '16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' },
  card: { background: '#fff', padding: '30px 20px', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', textAlign: 'center', border: '1px solid #e2e8f0' },
  badge: { backgroundColor: '#dcfce7', color: '#15803d', padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px' },
  uniName: { margin: '0 0 10px 0', fontSize: '20px', color: '#0f172a', fontWeight: '700' },
  codeTag: { color: '#3b82f6', backgroundColor: '#eff6ff', padding: '4px 10px', borderRadius: '8px', fontSize: '12px' },
  divider: { height: '1px', backgroundColor: '#f1f5f9', margin: '20px 0' },
  activeLabel: { fontSize: '13px', color: '#94a3b8', margin: 0 },
  fab: { display: 'block', margin: '40px auto', padding: '15px 30px', backgroundColor: '#1e293b', color: '#fff', borderRadius: '50px', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  formCard: { background: '#fff', padding: '40px', borderRadius: '30px', border: '1px solid #e2e8f0' },
  input: { width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', boxSizing: 'border-box' },
  emailWrapper: { display: 'flex', marginBottom: '25px' },
  inputEmail: { flex: 1, padding: '15px', borderRadius: '12px 0 0 12px', border: '1px solid #e2e8f0', borderRight: 'none', fontSize: '16px' },
  domainTag: { padding: '15px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0 12px 12px 0', color: '#64748b' },
  submitBtn: { width: '100%', padding: '16px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' },
  backBtn: { 
    background: '#fff', 
    border: '1px solid #e2e8f0', 
    width: '40px', 
    height: '40px', 
    borderRadius: '12px', 
    cursor: 'pointer', 
    fontSize: '20px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    color: '#1e293b'
  },
};

export default UniversityList;