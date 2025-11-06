const { useState, useEffect } = React;

function SkillTracker() {
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [loading, setLoading] = useState(true);
  const [updateTime, setUpdateTime] = useState({});

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = () => {
    try {
      const savedSkills = localStorage.getItem('skills-data');
      if (savedSkills) {
        setSkills(JSON.parse(savedSkills));
      }
    } catch (error) {
      console.log('No existing skills found');
    } finally {
      setLoading(false);
    }
  };

  const saveSkills = (updatedSkills) => {
    try {
      localStorage.setItem('skills-data', JSON.stringify(updatedSkills));
    } catch (error) {
      console.error('Failed to save skills:', error);
    }
  };

  const addSkill = () => {
    if (newSkillName.trim()) {
      const newSkill = {
        id: Date.now(),
        name: newSkillName.trim(),
        totalHours: 0,
        level: 1
      };
      const updatedSkills = [...skills, newSkill];
      setSkills(updatedSkills);
      saveSkills(updatedSkills);
      setNewSkillName('');
    }
  };

  const updateSkillTime = (skillId) => {
    const hoursToAdd = parseFloat(updateTime[skillId] || 0);
    if (hoursToAdd > 0) {
      const updatedSkills = skills.map(skill => {
        if (skill.id === skillId) {
          const newTotalHours = skill.totalHours + hoursToAdd;
          const newLevel = Math.floor(newTotalHours / 20) + 1;
          return { ...skill, totalHours: newTotalHours, level: newLevel };
        }
        return skill;
      });
      setSkills(updatedSkills);
      saveSkills(updatedSkills);
      setUpdateTime({ ...updateTime, [skillId]: '' });
    }
  };

  const deleteSkill = (skillId) => {
    const updatedSkills = skills.filter(skill => skill.id !== skillId);
    setSkills(updatedSkills);
    saveSkills(updatedSkills);
  };

  const getProgressPercentage = (hours) => {
    const hoursInCurrentLevel = hours % 20;
    return (hoursInCurrentLevel / 20) * 100;
  };

  const getHoursToNextLevel = (hours) => {
    return 20 - (hours % 20);
  };

  // Icons as SVG components
  const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );

  const ClockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );

  const TrendingUpIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );

  const TrashIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your skills...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <TrendingUpIcon />
            Skill Mastery Tracker
          </h1>
          <p className="text-purple-200">Level up your skills, 20 hours at a time</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">Add New Skill</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              placeholder="Enter skill name..."
              className="flex-1 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              onClick={addSkill}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all flex items-center gap-2 shadow-lg"
            >
              <PlusIcon />
              Add Skill
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {skills.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center border border-white/20">
              <p className="text-white/70 text-lg">No skills yet. Add your first skill to start tracking!</p>
            </div>
          ) : (
            skills.map(skill => (
              <div key={skill.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:bg-white/15 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-1">{skill.name}</h3>
                    <div className="flex items-center gap-4 text-purple-200">
                      <span className="flex items-center gap-1">
                        <ClockIcon />
                        {skill.totalHours.toFixed(1)} hours
                      </span>
                      <span className="text-yellow-300 font-semibold">Level {skill.level}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSkill(skill.id)}
                    className="p-2 hover:bg-red-500/30 rounded-lg transition-all"
                  >
                    <TrashIcon />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-purple-200 mb-2">
                    <span>Progress to Level {skill.level + 1}</span>
                    <span>{getHoursToNextLevel(skill.totalHours).toFixed(1)} hours remaining</span>
                  </div>
                  <div className="w-full h-4 bg-black/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 transition-all duration-500 ease-out rounded-full"
                      style={{ width: `${getProgressPercentage(skill.totalHours)}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={updateTime[skill.id] || ''}
                    onChange={(e) => setUpdateTime({ ...updateTime, [skill.id]: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && updateSkillTime(skill.id)}
                    placeholder="Hours to add..."
                    className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <button
                    onClick={() => updateSkillTime(skill.id)}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg"
                  >
                    Update
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<SkillTracker />, document.getElementById('root'));
